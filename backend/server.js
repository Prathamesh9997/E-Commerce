import express from "express";
import data from "./data.js";

const app = express();

app.get("/", function (req, res) {
    res.send("Server is ready");
});

app.get("/api/products", function (req, res) {
    res.send(data.products);
});

app.get("/api/products/:id", function (req, res) {
    const product = data.products.find((x) => x._id === req.params.id);
    if (product) {
        res.send(product);
    } else {
        res.status(404).send({ message: "Product not found" });
    }
});

const port = process.env.PORT || 5000;
app.listen(port, function () {
    console.log("Server is up & running");
})