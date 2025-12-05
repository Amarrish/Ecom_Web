import ProductImageUpload from "@/components/Admin-view/Images_Upload";
import AdminProductTile from "@/components/Admin-view/ProductTile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { toast } from 'sonner';
//  useToast
import { addProductFormElements } from "@/Config";
import {addNewProduct,deleteProduct,editProduct,fetchAllProducts,} from "@/store/Admin/ProductSlice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductTable from "@/components/Admin-view/ProductTable";

const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
  averageReview: 0,
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] =useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  console.log(currentEditedId,'currentEditedId');
  

  const { productList } = useSelector((state) => state.adminProducts);
  console.log(productList);
  
  const dispatch = useDispatch();
  // const { toast } = useToast();

  // function onSubmit(event) {
  //   event.preventDefault();

  //   currentEditedId !== null
  //     ? dispatch(
  //         editProduct({
  //           id: currentEditedId,
  //           formData,
  //         })
  //       ).then((data) => {
  //         console.log(data, "edit");

  //         if (data?.payload?.success) {
  //           dispatch(fetchAllProducts());
  //           setFormData(initialFormData);
  //           setOpenCreateProductsDialog(false);
  //           setCurrentEditedId(null);
  //         }
  //       })
  //     : dispatch(
  //         addNewProduct({
  //           ...formData,
  //           image: uploadedImageUrl,
  //         })
  //       ).then((data) => {
  //         if (data?.payload?.success) {
  //           dispatch(fetchAllProducts());
  //           console.log(fetchAllProducts);
            
  //           setOpenCreateProductsDialog(false);
  //           setImageFile(null);
  //           setFormData(initialFormData);
  //           toast.success("Product added successfully");
  //         }
  //       });
  // }

  function onSubmit(event) {
  event.preventDefault(); 
  // Handle EDIT
  if (currentEditedId !== null) {
    const updatedData = {
      ...formData,
      image: uploadedImageUrl || formData.image, // Use new image if uploaded
    };

    dispatch(editProduct({ id: currentEditedId, formData: updatedData }))
      .then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          setFormData(initialFormData);
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
          setUploadedImageUrl(""); // Reset image URL
          toast.success("Product updated successfully");
        }
      });
  } 
  // Handle ADD
  else {
    dispatch(addNewProduct({ ...formData, image: uploadedImageUrl }))
      .then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          setOpenCreateProductsDialog(false);
          setImageFile(null);
          setFormData(initialFormData);
          setUploadedImageUrl("");
          toast.success("Product added successfully");
        }
      });
  }
}

  function handleDelete(getCurrentProductId) {
    dispatch(deleteProduct(getCurrentProductId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
      }
    });
  }

  function isFormValid() {
    return Object.keys(formData)
      .filter((currentKey) => currentKey !== "averageReview")
      .map((key) => formData[key] !== "")
      .every((item) => item);
  }

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);


  console.log(formData, "productList");

  return (
    <Fragment>
      <div className="mb-5 w-full text-xs flex justify-end">
        <Button className='bg-white text-blue-950 text-sm hover:text-white' onClick={() =>{setOpenCreateProductsDialog(true)
        setImageFile(null);          // ✅ clear any previous image
    setUploadedImageUrl("");    // ✅ clear cloud image
}}>
          Add New Product
        </Button>
      </div>

      {/* <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4"> */}
      {/* <div className="flex flex-wrap">
        {productList && productList.length > 0
          ? productList.map((productItem) => (
              <AdminProductTile
                setFormData={setFormData}
                setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                setCurrentEditedId={setCurrentEditedId}
                product={productItem}
                handleDelete={handleDelete}
              />
            ))
          : null}
      </div> */}

<ProductTable
  productList={productList}
  setFormData={setFormData}
  setOpenCreateProductsDialog={setOpenCreateProductsDialog}
  setCurrentEditedId={setCurrentEditedId}
  handleDelete={handleDelete}
/>
     <Sheet
        open={openCreateProductsDialog}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setOpenCreateProductsDialog(false);
            setCurrentEditedId(null);
            setFormData(initialFormData);
            setImageFile(null);
            setUploadedImageUrl("");
          }
  }}>

        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? "Edit Product" : "Add New Product"}
            </SheetTitle>
          </SheetHeader>
          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={currentEditedId !== null}
          />
          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Edit" : "Add"}
              formControls={addProductFormElements}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;