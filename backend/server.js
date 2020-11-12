import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import userRouter from "./routers/userRouters.js";
import productRouter from "./routers/productRouters.js";
import orderRouter from "./routers/orderRouters.js";
import uploadRouter from "./routers/uploadRouter.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//connecting to mongodb
mongoose.connect(process.env.MONGODB_URL || "mongodb://localhost/amazona", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
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
app.use("/api/orders", orderRouter);
app.use("/api/uploads", uploadRouter);

//to send client id from backend to frontend
app.get("/api/config/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || "sb");
});

//for image upload
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

//send errors to user
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5001;
app.listen(port, function () {
  console.log("Server is up & running");
});
