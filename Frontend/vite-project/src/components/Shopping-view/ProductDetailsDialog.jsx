import React from 'react'
import { StarIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cartslice";
import { toast } from 'sonner';
import { setProductDetails } from "@/store/shop/productslice";
import { Label } from "../ui/label";
import StarRatingComponent from "../Common/StarRating";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "@/store/shop/reviewslice";

const ProductDetailsDialog = ({ open, setOpen, productDetails }) => {
     const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);

console.log(reviews,"reviewssss");
console.log(user,"user");


  function handleRatingChange(getRating) {
    console.log(getRating, "getRating");

    setRating(getRating);
  }

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast( `Only ${getQuantity} quantity can be added for this item`);

          return;
        }
      }
    }
    dispatch(
      addToCart({
        userId: user?.userId,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.userId));
        toast("Product is added to cart");
      }
    });
  }

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMsg("");
  }

  function handleAddReview() {
    dispatch(
  addReview({
    productId: productDetails?._id,
    userId: user?.userId,
    username: user?.username,
    reviewMessage: reviewMsg,
    reviewValue: rating,
  })
).then((res) => {
  if (res.type.includes("fulfilled")) {
    setRating(0);
    setReviewMsg("");
    dispatch(getReviews(productDetails?._id));
    toast("Review added successfully!");
  }

  if (res.type.includes("rejected")) {
    toast(res.payload.message || "You already reviewed this product!");
  }
});
  }

  useEffect(() => {
    if (productDetails !== null) dispatch(getReviews(productDetails?._id));
  }, [productDetails]);

  console.log(reviews, "reviews");

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        reviews.length
      : 0;

  return (
      <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4 sm:p-8 md:p-12 
             max-w-[90vw] max-h-[90vh] sm:max-w-[80vw] lg:max-w-[70vw] overflow-auto">
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={productDetails?.image}
            alt={productDetails?.title}
            className="w-full h-auto max-h-[300px] sm:max-h-[400px] object-cover rounded-xl"
          />
        </div>
        <div className="flex flex-col max-h-[80vh] overflow-y-auto pr-2">
          <div>
            <h1 className="text-sm font-extrabold">{productDetails?.title}</h1>
            <p className="text-muted-foreground text-xs mb-5 mt-4">
              {productDetails?.description}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p
              className={`text-sm font-bold text-primary ${
                productDetails?.salePrice > 0 ? "line-through" : ""
              }`}
            >
              ${productDetails?.price}
            </p>
            {productDetails?.salePrice > 0 ? (
              <p className="text-sm font-bold text-muted-foreground">
                ${productDetails?.salePrice}
              </p>
            ) : null}
          </div>
          <div className="flex items-center mt-2">
            <div className="flex items-center gap-0.5">
              <StarRatingComponent rating={averageReview} />
            </div>
            <span className="text-muted-foreground">
              ({averageReview.toFixed(2)})
            </span>
          </div>
          <div className="mt-5 mb-5">
            {productDetails?.totalStock === 0 ? (
              <Button className="w-full opacity-60 cursor-not-allowed">
                Out of Stock
              </Button>
            ) : (
              <Button
                className="w-full text-xs"
                onClick={() =>
                  handleAddToCart(
                    productDetails?._id,
                    productDetails?.totalStock
                  )
                }
              >
                Add to Cart
              </Button>
            )}
          </div>
          <Separator />
          <div className="max-h-[300px]">
            <h2 className="text-sm font-bold mb-4">Reviews</h2>
        <div className="grid gap-6">
              {reviews && reviews.length > 0 ? (
                reviews.map((reviewItem) => {
                  const displayName =
                    reviewItem?.username ||
                    reviewItem?.userName ||
                    reviewItem?.name ||
                    "User";
                  const initial = displayName?.charAt(0)?.toUpperCase() || "?";

                  return (
                    <div className="flex gap-4" key={reviewItem._id || `${displayName}-${Math.random()}`}>
                      <Avatar className="w-10 h-10 border">
                        <AvatarFallback>{initial}</AvatarFallback>
                      </Avatar>
                      <div className="grid gap-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold">{displayName}</h3>
                        </div>
                        <div className="flex items-center gap-0.5">
                          <StarRatingComponent rating={reviewItem?.reviewValue} />
                        </div>
                        <p className="text-muted-foreground">
                          {reviewItem?.reviewMessage}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <h1 className="text-xs">No Reviews</h1>
              )}
            </div>
            <div className="mt-10 flex-col flex gap-2 ">
              <Label className='text-xs'>Write a review</Label>
              <div className="flex gap-1">
                <StarRatingComponent
                  rating={rating}
                  handleRatingChange={handleRatingChange}
                />
              </div>
              <Input
                name="reviewMsg"
                value={reviewMsg}
                onChange={(event) => setReviewMsg(event.target.value)}
                placeholder="Write a review..."
              />
              <Button
              className="text-sm"
                onClick={handleAddReview}
                disabled={reviewMsg.trim() === ""}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ProductDetailsDialog