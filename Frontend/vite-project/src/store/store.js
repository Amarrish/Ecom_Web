import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import AdminProductsSlice from "./Admin/ProductSlice";
import shopProductsSlice from "./shop/productslice";
import shopCartSlice from "./shop/cartslice";
import shopReviewSlice from "./shop/reviewslice";
import commonFeatureSlice from "./commonslice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        adminProducts: AdminProductsSlice,

         shopCart: shopCartSlice,
         shopProducts: shopProductsSlice,
         shopReview: shopReviewSlice,
         commonFeature: commonFeatureSlice,
         
    },
});

export default store;

