const User = require("../models/userModel");
const bcrypt = require("bcrypt");

// to create a user
async function createUser(req, res) {
  const { name, email, photo, password, passwordConfirm, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    if(password !== passwordConfirm) {
      return res.status(400).json({
        status: "fail",
        message: "Password confirm do not match"
      });
    }

    const user = await User.create({ name, email, role, photo, password: hashedPassword, passwordConfirm: hashedPassword });

    res.status(201).json({
      status: "success",
      data: { user }
    });
    
  } catch (error) {
    res.status(400).json({
    status: "fail",
    message: `Duplicate entry for email: ${error.keyValue.email}`
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
    const { name, email, photo, password, passwordConfirm } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ status : "fail", msg: "user not found" });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.photo = photo || user.photo;
    user.password = password || user.password;
    user.passwordConfirm = passwordConfirm || user.passwordConfirm;

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
    return res.status(200).json({ status : "success", message: "User deleted successfully" });

   } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal server error"});
   }
};

module.exports = { createUser, getAllUsers, getUser, updateUser, deleteUser };