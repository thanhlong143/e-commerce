import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Login, Home, Public, Products, ProductDetails, Blogs, Services, FAQ } from "./pages/public"
import path from "./utils/path";
import { getCategories } from "./store/app/asyncActions";
import { useDispatch } from "react-redux";

function App() {
   const dispatch = useDispatch();

   useEffect(() => {
      dispatch(getCategories());
   }, [dispatch])
   return (
      <div className="min-h-screen font-main">
         <Routes>
            <Route path={path.LOGIN} element={<Login />} />
            <Route path={path.PUBLIC} element={<Public />} >
               <Route path={path.HOME} element={<Home />} />
               <Route path={path.PRODUCTS} element={<Products />} />
               <Route path={path.PRODUCT_DETAILS__PID__TITLE} element={<ProductDetails />} />
               <Route path={path.BLOGS} element={<Blogs />} />
               <Route path={path.OUR_SERVICES} element={<Services />} />
               <Route path={path.FAQ} element={<FAQ />} />
            </Route>
         </Routes>
      </div>
   );
}

export default App;
