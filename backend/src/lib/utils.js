import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
    // יצירת JWT:
  //  - ה־payload יכלול את userId (אפשר להרחיב: role, permissions וכו')
  //  - החתימה תתבצע עם הסוד מה־ENV
  //  - תוקף ל־7 ימים (expiresIn)
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ימים במילישניות
    httpOnly: true,                  // מניעת XSS באמצעות חסימת JS מעוגייה
    sameSite: "strict",              // הקשחת CSRF (במקרי SSO/דומיינים שונים שקול 'lax')
    secure: process.env.NODE_ENV !== "development", // ב־HTTPS בלבד מחוץ לדיבלופמנט
  });

  return token;
};
