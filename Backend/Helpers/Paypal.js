require("dotenv").config();
const paypal = require("@paypal/checkout-server-sdk");

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const isLive = process.env.MODE === "live";

const environment = isLive
  ? new paypal.core.LiveEnvironment(clientId, clientSecret)
  : new paypal.core.SandboxEnvironment(clientId, clientSecret);

const paypalClient = new paypal.core.PayPalHttpClient(environment);

module.exports = paypalClient;

