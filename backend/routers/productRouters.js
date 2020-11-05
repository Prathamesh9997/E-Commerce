//seed api to create products n db.
import express from "express";
import expressAsyncHandler from "express-async-handler" //catch the errors
import data from "../data.js";
import Product from "../models/productModels.js";


const productRouter = express.Router();

//display product list on homepage
productRouter.get("/", expressAsyncHandler( async(req, res) => {
    const products = await Product.find({});
    res.send(products);
}));

//Insertion of products into db
productRouter.get('/seed', expressAsyncHandler( async(req, res) => {  
    const createdProducts = await Product.insertMany(data.products);
    res.send({createdProducts});
}));

//display requested product
productRouter.get("/:id", expressAsyncHandler( async (req, res) => {
    const product = await Product.findById(req.params.id);
    if(product){
        res.send(product);
    } else {
        res.status(404).send({message: "Product Not Found"});
    }
  
}));

export default productRouter;