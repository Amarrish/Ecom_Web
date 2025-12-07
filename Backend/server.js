require('dotenv').config();
const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const authRouter = require('./Routes/auth/auth-routes')
const adminProductsRouter = require('./Routes/Admin/ProductRoutes')
const adminOrderRouter = require("./Routes/Admin/OrderRoutes")

const shopCartRouter = require('./Routes/shop/CartRoute')
const shopProductsRouter = require("./Routes/shop/ProductRoute");
const commonFeatureRouter = require("./Routes/common/featureRoute");
const shopAddressRouter = require("./Routes/shop/AddressRoute");
const shopOrderRouter =require("./Routes/shop/OrderRoutes")
const shopReviewRouter = require("./Routes/shop/ReviewRoutes")
const shopSearchRouter =require("./Routes/shop/SearchRoute")


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const app = express()
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Expires', 'Pragma'],
    credentials: true
}))

app.use(cookieParser());
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/admin/products', adminProductsRouter);
app.use("/api/admin/orders", adminOrderRouter);

app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/review", shopReviewRouter);
app.use("/api/common/feature", commonFeatureRouter);


app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
