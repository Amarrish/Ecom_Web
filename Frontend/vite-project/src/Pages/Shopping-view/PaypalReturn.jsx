import React from 'react'
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { capturePayment } from "@/store/shop/orderslice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

const PaypalReturn = () => {

     const dispatch = useDispatch();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const paymentId = params.get("token");
  const payerId = params.get("PayerID");

  // console.log(paymentId,"paymentID");
  //   console.log(payerId,"payertID");
      console.log(params,"params");
  

  useEffect(() => {
    if (paymentId && payerId) {
        
      const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));
      console.log(orderId,"OrderId from returnpage");
      

       dispatch(capturePayment({ paymentId, payerId, orderId })).then((data) => {
        console.log("capturePayment response:", data); // check actual structure
        if (data?.payload?.success) {
          sessionStorage.removeItem("currentOrderId");
          window.location.href = "/shop/payment-success";
        } else {
          console.error("Payment capture failed:", data?.payload);
        }
      }).catch((error) => {
        console.error("capturePayment error:", error);
      });
    }
  }, [paymentId, payerId, dispatch]);

  return (
      <Card>
      <CardHeader>
        <CardTitle>Processing Payment...Please wait!</CardTitle>
      </CardHeader>
    </Card>
  )
}

export default PaypalReturn