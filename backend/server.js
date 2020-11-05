import express from "express";
import mongoose from "mongoose"
import dotenv from "dotenv";
import userRouter from "./routers/userRouters.js";
import productRouter from "./routers/productRouters.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//connecting to mongodb
mongoose.connect( process.env.MONGODB_URL || "mongodb://localhost/amazona", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

app.get("/", function (req, res) {
    res.send("Server is ready");
});

//below code was for static data

// app.get("/api/products", function (req, res) {
//     res.send(data.products);
// });

// app.get("/api/products/:id", function (req, res) {
//     const product = data.products.find((x) => x._id === req.params.id);
//     if (product) {
//         res.send(product);
//     } else {
//         res.status(404).send({ message: "Product not found" });
//     }
// });


//here we are fetching data from db and inserting data into db through api
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);

//send errors to user
app.use((err, req, res, next) => {
    res.status(500).send({message: err.message});
});

const port = process.env.PORT || 5001;
app.listen(port, function () {
    console.log("Server is up & running");
})