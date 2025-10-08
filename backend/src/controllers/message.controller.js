import User from "../models/user.model.js";
import Message from "../models/message.model.js";

import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const sendMessage = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const { text = "", image } = req.body;

    if (!text.trim() && !image) {
      return res.status(400).json({ message: "Text or image is required" });
    }

    let imageUrl = "";
    if (image) {
      const isDataUrl = /^data:image\/[a-zA-Z0-9.+-]+;base64,/.test(image);
      if (!isDataUrl) {
        return res.status(400).json({ message: "Invalid image data" });
      }

      // ניסיון העלאה – לוג מפורט בשגיאה
      try {
        const uploaded = await cloudinary.uploader.upload(image, {
          folder: "chatty/messages",
          resource_type: "image",
          transformation: [{ width: 1600, height: 1600, crop: "limit" }],
        });
        imageUrl = uploaded.secure_url;
      } catch (e) {
        console.error("Cloudinary upload error:", e);
        const msg =
          e?.message ||
          e?.error?.message ||
          e?.error?.http_code?.toString?.() ||
          "Image upload failed";
        return res.status(502).json({ message: msg }); // ← 502 ולא 500 כדי שתדע שזה מהענן
      }
    }

    const newMessage = await Message.create({
      senderId: req.user._id,
      receiverId,
      text: text?.trim() || "",
      image: imageUrl,
    });

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) io.to(receiverSocketId).emit("newMessage", newMessage);

    return res.status(201).json(newMessage);
  } catch (err) {
    console.error("sendMessage controller error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}