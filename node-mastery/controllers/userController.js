const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const multer = require('multer');
const fs = require("fs");
const path = require("path");

// Multer setup
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `user-${Date.now()}.${ext}`);
  }
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload an image.'), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

const uploadUserPhoto = (req, res, next) => {
  const uploadSingle = upload.single('photo');

  uploadSingle(req, res, (err) => {
    if (err) {
      // If Multer error, respond in JSON
      return res.status(400).json({
        status: "fail",
        message: err.message // "Not an image! Please upload an image."
      });
    }
    next();
  });
};

// Helper to delete uploaded file
function deleteUploadedFile(file) {
  if (!file) return;
  const filePath = path.join(__dirname, "..", "public", "img", file.filename);
  fs.unlink(filePath, (err) => {
    if (err) console.error("Error deleting file:", err);
    else console.log("Uploaded file deleted:", file.filename);
  });
}

// Create User Controller
async function createUser(req, res) {
  const { name, email, password, passwordConfirm, role } = req.body;
  const photo = req.file ? req.file.filename : "default.jpg";

  // console.log("req.file:", req.file);
  // console.log("req.body:", req.body);

  try {
    // 1. Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      deleteUploadedFile(req.file);
      return res.status(400).json({
        status: "fail",
        message: "Email already exists. Please use another one."
      });
    }

    // 2. Check if role is valid
    if (role && !['user', 'admin', 'manager'].includes(role)) {
      deleteUploadedFile(req.file);
      return res.status(400).json({
        status: "fail",
        message: "Invalid role specified"
      });
    }

    // 3. Check password confirm  
    if (password !== passwordConfirm) {
      deleteUploadedFile(req.file);
      return res.status(400).json({
        status: "fail",
        message: "Password confirm does not match"
      });
    }

    // 4. Hash password  
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Create user
    const user = await User.create({
      name,
      email,
      role,
      photo,
      password: hashedPassword,
      passwordConfirm: hashedPassword
    });

    res.status(201).json({
      status: "success",
      data: { user }
    });

  } catch (error) {
    // If error occurs after upload, remove uploaded photo
    deleteUploadedFile(req.file);
    res.status(400).json({
      status: "fail",
      message: error.message
    });
  }
}

// to get all users
async function getAllUsers(req, res) {
 try {
    const allUser =  await User.find({});
    return res.status(200).json({ 
       total : allUser.length, status: "success", msg : allUser
    });
  } catch (error) {
    return res.status(500).json({ 
        error : error,
        msg: "Internal server error" 
    });
  }
};

// to get a single user
async function getUser(req, res) {
  try { 
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ status: "fail", message: "Invalid ID" });
    }

    res.status(200).json({ status: "success", msg: user });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ msg: "Internal server error" });
  }
}

//  to update a User
async function updateUser (req, res) {
    try {
    const { name, email, photo } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ status : "fail", msg: "user not found" });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.photo = photo || user.photo;

    await user.save();
    return res.status(200).json({ status : "success", msg: "User updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal server error"});
  }
};

//  to delete a User
async function deleteUser(req, res) {
   try {
    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(404).json({ status : "fail", message: "User not found"});
    }

    await user.deleteOne();
    return res.status(200).json({ status : "success", message: null });

   } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal server error"});
   }
};

module.exports = { createUser, getAllUsers, getUser, updateUser, deleteUser, uploadUserPhoto };