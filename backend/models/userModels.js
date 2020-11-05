import mongoose from "mongoose";

//create schema
const userSchema = new mongoose.Schema(
    {
        name : {type: String, required: true},
        email : {type: String, required: true, unique: true},
        password : {type: String, required: true},
        isAdmin : {type: Boolean, required: true, default: false}
    },
    {
        timestamps: true 
        //When you enable timestamps, Mongoose adds createdAt and updatedAt properties to your schema. 
        //By default, createdAt and updatedAt are of type Date. When you update a document, Mongoose automatically increments updatedAt.
    }
);

//create model
const User = mongoose.model("User", userSchema);
export default User;