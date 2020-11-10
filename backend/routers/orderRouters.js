import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Order from '../models/orderModels.js';
import { isAdmin, isAuth } from '../utils.js';

const orderRouter = express.Router();

//List orders for admin
orderRouter.get("/", isAuth, isAdmin, expressAsyncHandler( async (req, res) => {
    const orders = await Order.find({}).populate("user", "name");  //like join operation
    res.send(orders)
}));

//delete order
orderRouter.delete("/:id", isAuth, isAdmin, expressAsyncHandler( async (req, res) => {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);

    if(order) {
        const deleteOrder = await order.remove();
        res.send({message: "Order deleted", order: deleteOrder});
    } else {
        res.status(404).send({ message: "Order Not Found" });
    }
}));

//API for oder hsitory
orderRouter.get("/mine", isAuth, expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.send(orders);
}));

//API for inserting order data into database.
orderRouter.post("/", isAuth, expressAsyncHandler(async (req, res) => {
    if (req.body.orderItems.length === 0) {
        res.status(400).send({ message: 'Cart is empty' });
    } else {
        const order = new Order({
            orderItems: req.body.orderItems,
            shippingAddress: req.body.shippingAddress,
            paymentMethod: req.body.paymentMethod,
            itemsPrice: req.body.itemsPrice,
            shippingPrice: req.body.shippingPrice,
            taxPrice: req.body.taxPrice,
            totalPrice: req.body.totalPrice,
            user: req.user._id,
        });
        const createdOrder = await order.save();
        res.status(201).send({ message: 'New Order Created', order: createdOrder });
    }
})
);

//API for getting order details from db
orderRouter.get("/:id", isAuth, expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        res.send(order);
    } else {
        res.status(404).send({ message: "Order Not Found" });
    }
})
);


//API for updating payment status
orderRouter.put("/:id/pay", isAuth, expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address
        };
        const updatedOrder = await order.save();
        res.send({ message: "Order paid", order: updatedOrder });
    } else {
        res.status(404).send({ message: "Order Not Found" });
    }
}));

//API for updating delivery status
orderRouter.put("/:id/deliver", isAuth, expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        const updatedOrder = await order.save();
        res.send({ message: "Order delivered", order: updatedOrder });
    } else {
        res.status(404).send({ message: "Order Not Found" });
    }
}));
export default orderRouter;