//seed api to create products n db.
import express from "express";
import expressAsyncHandler from "express-async-handler" //catch the errors
import data from "../data.js";
import Product from "../models/productModels.js";
import { isAdmin, isAuth } from "../utils.js";


const productRouter = express.Router();

//display product list on homepage
productRouter.get("/", expressAsyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.send(products);
}));

//Insertion of products into db
productRouter.get('/seed', expressAsyncHandler(async (req, res) => {
    const createdProducts = await Product.insertMany(data.products);
    res.send({ createdProducts });
}));

//display requested product
productRouter.get("/:id", expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        res.send(product);
    } else {
        res.status(404).send({ message: "Product Not Found" });
    }

}));


//create new product
productRouter.post("/", isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
    const product = new Product({
        name: "sample name" + Date.now(),
        image: "/images/p1.jpg",
        price: 0,
        category: 'sample category',
        brand: 'sample brand',
        countInStock: 0,
        rating: 5,
        numReviews: 1,
        description: 'sample description'
    });
    const createdProduct = await product.save();
    res.send({ message: "Product Created", product: createdProduct });
}));


//update product
productRouter.put("/:id", isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (product) {
        product.name = req.body.name,
            product.price = req.body.price,
            product.image = req.body.image,
            product.category = req.body.category,
            product.brand = req.body.brand,
            product.countInStock = req.body.countInStock,
            product.description = req.body.description

        const updatedProduct = await product.save();
        res.send({ message: "Product updated", product: updatedProduct });

    } else {
        res.status(404).send({ message: "Product Not Found" });
    }
}));

//delete product
productRouter.delete("/:id", isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (product) {
        const deleteProduct = await product.remove();
        res.send({ message: "Product deleted", product: deleteProduct });
    } else {
        res.status(404).send({ message: "Product Not Found" });
    }
}));

export default productRouter;