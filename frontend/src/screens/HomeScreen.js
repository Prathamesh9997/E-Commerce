import React, { useEffect } from "react";
import Product from "../components/Product";
import MessageBox from "../components/MessageBox";
import LoadingBox from "../components/LoadingBox";
import { useDispatch, useSelector } from "react-redux";
import { listProducts } from "../actions/productActions";

function HomeScreen() {
  const dispatch = useDispatch(); //using this we can dispatch any redux action inside react comp.
  const productList = useSelector((state) => state.productList); // to get object from redux store.
  const { loading, error, products } = productList;
  //Below function will run after rendering the components
  useEffect(() => {
    dispatch(listProducts()); //calling action
  }, [dispatch]);

  return (
    <div>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox varient="danger">{error}</MessageBox>
      ) : (
        <div className="row center">
          {products.map((product) => (
            <Product key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default HomeScreen;
