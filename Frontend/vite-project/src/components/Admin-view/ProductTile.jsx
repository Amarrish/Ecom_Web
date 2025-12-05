
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";

const ProductTile = ({ product,setFormData, setOpenCreateProductsDialog, setCurrentEditedId, handleDelete,}) => {

  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="w-full max-w-sm mx-auto overflow-hidden rounded-2xl shadow-md transition-transform hover:scale-[1.01]">
      <div className="relative w-full aspect-[4/3] bg-gray-100">
        <img
          src={product?.image}
          alt={product?.title || "Product Image"}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      <CardContent className="p-4">
        <h2 className="text-sm font-semibold mb-2 text-gray-800 line-clamp-1">
          {product?.title}
        </h2>

        {/* Description with animation */}
        <AnimatePresence initial={false}>
          <motion.div
            key={expanded ? "expanded" : "collapsed"}
            initial={{ height: 20, opacity: 0.7 }}
            animate={{ height: expanded ? "auto" : 20, opacity: 1 }}
            exit={{ height: 20, opacity: 0.7 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="text-xs text-gray-600 overflow-hidden"
          >
            {product?.description}
          </motion.div>
        </AnimatePresence>

        {product?.description?.length > 50 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-blue-600 text-xs font-medium hover:underline mt-1"
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        )}

       <div className="flex justify-between">
         <h6 className="text-xs text-blue-800 font-semibold rounded bg-gray-100 m-1 p-1">
          Stock: {product?.totalStock}
        </h6>

        <h6 className="text-xs text-blue-800 font-semibold rounded bg-gray-100 m-1 p-1">
         ☆ Avg Reveiw: {product?.averageReview}
        </h6>
       </div>

        <div className="flex justify-between items-center">
          <span
            className={`${
              product?.salePrice > 0
                ? "line-through text-gray-400"
                : "text-gray-600"
            } text-sm`}
          >
            ${product?.price}
          </span>
          {product?.salePrice > 0 && (
            <span className="text-sm font-medium text-green-600">
              ${product?.salePrice}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between p-4 pt-0">
        <Button
          variant="outline"
          onClick={() => {
            setOpenCreateProductsDialog(true);
            setCurrentEditedId(product?._id);
            setFormData(product);
          }}
        >
          Edit
        </Button>
        <Button
          variant="destructive"
          onClick={() => handleDelete(product?._id)}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductTile;
