import Axios from "axios"
import { CART_ADD_ITEM, CART_REMOVE_ITEM } from "../constants/cartConstants";

export const addToCart = (productId, qty) => async (dispatch, getState) => { //getstate: access the state of redux store.
    const { data } = await Axios(`/api/products/${productId}`);
    //by dispatching this action requesting redux store to add product to the cart.
    dispatch({
        type: CART_ADD_ITEM,
        payload: {
            name: data.name,
            image: data.image,
            price: data.price,
            countInStock: data.countInStock,
            product: data._id,
            qty,
        }
    });
    localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems)); //store cart status on local storage
};

export const removeFromCart = (productId) => (dispatch, getState) => {
    dispatch({ type: CART_REMOVE_ITEM, payload: productId });
    localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};