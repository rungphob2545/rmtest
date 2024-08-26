const User = require("../users/model");
const bcrypt = require("bcryptjs");

const CryptoJS = require("crypto-js");
// ฟังก์ชันเข้ารหัส AES
const encryptPassword = (password) => {
  return CryptoJS.AES.encrypt(password, "secret_key").toString();
};

// ฟังก์ชันถอดรหัส AES
const decryptPassword = (encryptedPassword) => {
  const bytes = CryptoJS.AES.decrypt(encryptedPassword, "secret_key");
  return bytes.toString(CryptoJS.enc.Utf8);
};
const jwt = require("jsonwebtoken");

const userRegister = async (req, res) => {
  const { email, phone, password } = req.body;

  if (!email && !phone) {
    return res.status(400).json({
      field: "emailOrPhone",
      message: "Email or phone number is required",
    });
  }

  //Regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10,15}$/;

  if (email && !emailRegex.test(email)) {
    return res.status(400).json({
      field: "email",
      message: "Invalid email format",
    });
  }

  if (phone && !phoneRegex.test(phone)) {
    return res.status(400).json({
      field: "phone",
      message: "Invalid phone format",
    });
  }

  // ตรวจสอบความยาวของรหัสผ่าน
  if (password.length < 4 || password.length > 60) {
    return res.status(400).json({
      field: "password",
      message: "Password must be between 4 and 60 characters",
    });
  }

  try {
    // ตรวจสอบว่ามี email หรือ phone อยู่ในระบบแล้วหรือไม่
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      // ตรวจสอบว่า field ไหนซ้ำ
      if (existingUser.email === email) {
        return res.status(400).json({
          field: "email",
          message: "Email already exists",
        });
      } else if (existingUser.phone === phone) {
        return res.status(400).json({
          field: "phone",
          message: "Phone number already exists",
        });
      }
    }

    // เข้ารหัสรหัสผ่าน
    const encryptedPassword = encryptPassword(password);

    // สร้างผู้ใช้ใหม่
    const newUser = new User({ email, phone, password: encryptedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error creating user", error: err });
  }
};

const userLogin = async (req, res) => {
  const { emailOrPhone, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    });
    if (!user) {
      return res
        .status(400)
        .json({ field: "emailOrPhone", message: "User not found" });
    }

    const decryptedPassword = decryptPassword(user.password);
    if (decryptedPassword !== password) {
      return res
        .status(401)
        .json({ field: "password", message: "Invalid password" });
    }

    //JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, phone: user.phone },
      "mysecretpassword",
      { expiresIn: "1h" }
    );

    // ส่ง JWT กลับไปยังผู้ใช้
    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

const getUser = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "mysecretpassword");

    const userId = decodedToken.id; // สมมติว่าใน token มี id เก็บไว้

    const user = await User.findById(userId); // ใช้ findById กับ _id ที่ MongoDB สร้างให้
    if (!user) {
      return res.status(404).send({ message: "User Not Found !" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error", message: err.message });
  }
};

module.exports = {
  userRegister,
  userLogin,
  getUser,
};
