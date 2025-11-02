// import User from "../models/user.model.js";
// import Message from "../models/message.model.js";

// import cloudinary from "../lib/cloudinary.js";
// import { getReceiverSocketId, io } from "../lib/socket.js";

// export const getUsersForSidebar = async (req, res) => {
//   try {
//     const loggedInUserId = req.user._id;
//     const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

//     res.status(200).json(filteredUsers);
//   } catch (error) {
//     console.error("Error in getUsersForSidebar: ", error.message);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// export const getMessages = async (req, res) => {
//   try {
//     const { id: userToChatId } = req.params;
//     const myId = req.user._id;

//     const messages = await Message.find({
//       $or: [
//         { senderId: myId, receiverId: userToChatId },
//         { senderId: userToChatId, receiverId: myId },
//       ],
//     });

//     res.status(200).json(messages);
//   } catch (error) {
//     console.log("Error in getMessages controller: ", error.message);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// export const sendMessage = async (req, res) => {
//   try {
//     const { text, image } = req.body;
//     const { id: receiverId } = req.params;
//     const senderId = req.user._id;

//     let imageUrl;
//     if (image) {
//       // Upload base64 image to cloudinary
//       const uploadResponse = await cloudinary.uploader.upload(image);
//       imageUrl = uploadResponse.secure_url;
//     }

//     const newMessage = new Message({
//       senderId,
//       receiverId,
//       text,
//       image: imageUrl,
//     });

//     await newMessage.save();

//     const receiverSocketId = getReceiverSocketId(receiverId);
//     if (receiverSocketId) {
//       io.to(receiverSocketId).emit("newMessage", newMessage);
//     }

//     res.status(201).json(newMessage);
//   } catch (error) {
//     console.log("Error in sendMessage controller: ", error.message);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };



import User from "../models/user.model.js";
// שים לב: אנחנו עדיין מייבאים Message אבל לא נשתמש בו לשמירה קבועה.
// אם אתה רוצה, אפשר למחוק את ה-import הזה לגמרי.
// import Message from "../models/message.model.js";

import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

// ===== 1. users sidebar נשאר כמו שהוא =====
export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } })
      .select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ===== 2. getMessages - לא מחזירים היסטוריה =====
// כל פעם שהתלמיד נכנס לחדר צ'אט או עושה ריענון - יחזור [], כאילו אין שיחה ישנה
export const getMessages = async (req, res) => {
  try {
    // בכוונה לא עושים שום Message.find
    // כי אנחנו לא רוצים להחזיר/להראות/לשמור היסטוריה בכלל
    return res.status(200).json([]);
  } catch (error) {
    console.log("Error in getMessages controller (demo mode): ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ===== 3. sendMessage - משדר בזמן אמת בלבד, בלי לשמור ב-DB =====
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    // נטפל בתמונה (אם נשלחה) כדי שהתלמיד בצד השני יוכל לראות אותה
    let imageUrl;
    if (image) {
      // מעלה ל-Cloudinary כי זו לא הדאטהבייס שלך, זה רק asset זמני/ויזואלי
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    // במקום ליצור ולשמור Message במסד,
    // אנחנו פשוט "ממציאים" אובייקט הודעה בזיכרון בלבד.
    // זה מה שנחזיר לפרונט ונשדר בסוקט.
    const demoMessage = {
      // שים לב: בפרונט אתה כנראה מצפה לשדות כמו ב-Message המלא
      senderId,
      receiverId,
      text: text || "",
      image: imageUrl || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // מפתח ייחודי בשביל React key
      _id: crypto.randomUUID?.() || Date.now().toString(),
      // אם במודל המקורי שלך היה __v או משהו, אפשר להוסיף גם אותו:
      __v: 0,
    };

    // שולחים לצד המקבל אם הוא מחובר
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", demoMessage);
    }

    // וגם לשולח עצמו (כדי שההודעה תופיע אצלו מיד ב-UI)
    const senderSocketId = getReceiverSocketId(senderId.toString());
    if (senderSocketId) {
      io.to(senderSocketId).emit("newMessage", demoMessage);
    }

    // חשוב:
    // אין await newMessage.save();
    // אין שמירה ב-DB בכלל.
    // אחרי ריענון הכל ייעלם.

    return res.status(201).json(demoMessage);
  } catch (error) {
    console.log("Error in sendMessage controller (demo mode): ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
