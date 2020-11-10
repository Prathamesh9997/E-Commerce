import multer from 'multer';
import express from 'express';
import { isAuth } from '../utils.js';

const uploadRouter = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) { //cb:callback 
    cb(null, 'uploads/'); // callbacks to uploads folder in root directory
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}.jpg`); //name format of file
  },
});

const upload = multer({ storage });

uploadRouter.post('/', isAuth, upload.single('image'), (req, res) => {
  res.send(`/${req.file.path}`); //save the address of file inside the mongodb for that specific product
});

export default uploadRouter;