import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import AdminProductsSlice from "./Admin/ProductSlice";
import shopProductsSlice from "./shop/productslice";
import shopCartSlice from "./shop/cartslice";
import shopReviewSlice from "./shop/reviewslice";
import commonFeatureSlice from "./commonslice";
import shopAddressSlice from "./shop/AddressSlice";
import shopOrderSlice from "./shop/orderslice";
import adminOrderSlice from "./Admin/Orderslice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        adminProducts: AdminProductsSlice,
        adminOrder: adminOrderSlice,

         shopCart: shopCartSlice,
         shopProducts: shopProductsSlice,
         shopReview: shopReviewSlice,
         shopAddress: shopAddressSlice,
         shopOrder: shopOrderSlice,

         commonFeature: commonFeatureSlice,
         
    },
});

export default store;

