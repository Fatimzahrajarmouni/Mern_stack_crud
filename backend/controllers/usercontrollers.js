import usermodel from "../models/User.js";
import multer from 'multer';
import path from 'path';

// Configurer multer pour stocker les images dans un répertoire spécifique
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

const create = async (req, res) => {
  try {
    const { name, nationality, email, phone } = req.body;
    const image = req.file ? req.file.path : '';

    const newUser = new usermodel({
      name,
      nationality,
      email,
      phone,
      image
    });

    await newUser.save();

    res.status(200).json({ success: true, message: "User Created Successfully.", newUser });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const get = async (req, res) => {
  try {
    const users = await usermodel.find();
    if (!users) {
      return res.status(404).json({ success: false });
    }

    res.status(200).json({ users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false });
  }
};

const Updated = async (req, res) => {
  try {
    const userId = req.params.id;
    const image = req.file ? req.file.path : '';
    const updateData = { ...req.body, ...(image && { image }) };

    const updatedUser = await usermodel.findByIdAndUpdate(userId, updateData, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, message: 'User updated successfully', updatedUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const Delete = async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await usermodel.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export { create, get, Updated, Delete, upload };
