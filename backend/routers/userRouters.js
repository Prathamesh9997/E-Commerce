//seed api to create users.
import express from "express";
import bcrypt from "bcryptjs";
import expressAsyncHandler from "express-async-handler" //catch the errors
import data from "../data.js";
import User from "../models/userModels.js";
import { generateToken } from "../utils.js";

const userRouter = express.Router();


//inserting users into db.
userRouter.get('/seed', expressAsyncHandler(async (req, res) => { //async bcz mongoose nature is async 
    const createdUsers = await User.insertMany(data.users);
    res.send({ createdUsers });
}));


//signin operation
userRouter.post("/signin", expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
            res.send({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user)
            });
            return;
        }
    }
    res.status(401).send({ message: "Invalid username or password" });
}));


//registering new users
userRouter.post("/register", expressAsyncHandler(async (req, res) => {

    //new user creation
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    });
    const createdUser = await user.save();
    //responding back with json token
    res.send({
        id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        isAdmin: createdUser.isAdmin,
        token: generateToken(createdUser)
    });

}));
export default userRouter;