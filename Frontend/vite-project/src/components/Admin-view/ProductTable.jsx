import React, { useState, useMemo, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { Button } from "../ui/button";
import { ModuleRegistry } from "ag-grid-community";
import { AllCommunityModule } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);

const ProductTable = ({
  productList,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  handleDelete,
}) => {
  const [expandedRows, setExpandedRows] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState("default");



  // ✅ Toggle description expand/collapse
  const toggleDescription = useCallback((id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }, []);

 

  // ✅ Filtered + sorted list
  const filteredProducts = useMemo(() => {
    let filtered = productList?.filter((product) => {
      const query = searchQuery.toLowerCase();
      return (
        product.title?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query)
      );
    });

    switch (filterOption) {
      case "priceLow":
        return filtered.sort((a, b) => a.price - b.price);
      case "priceHigh":
        return filtered.sort((a, b) => b.price - a.price);
      case "stockLow":
        return filtered.sort((a, b) => a.totalStock - b.totalStock);
      case "stockHigh":
        return filtered.sort((a, b) => b.totalStock - a.totalStock);
      case "reviewHigh":
        return filtered.sort((a, b) => b.averageReview - a.averageReview);
      default:
        return filtered;
    }
  }, [productList, searchQuery, filterOption]);

  // ✅ Columns
  const columnDefs = useMemo(
    () => [
      {
        headerName: "Image",
        field: "image",
        flex: 0.7,
        minWidth: 80,
        autoHeight: true,
        cellRenderer: (params) => (
          <img
            src={params.value}
            alt="Product"
            style={{
              width: "45px",
              height: "45px",
              borderRadius: "6px",
              objectFit: "cover",
            }}
          />
        ),
      },
      {
        headerName: "Title",
        field: "title",
        flex: 1.2,
        minWidth: 150,
        cellStyle: { whiteSpace: "normal", lineHeight: "1.2em" },
      },
      {
        headerName: "Description",
        field: "description",
        flex: 2,
        minWidth: 220,
        autoHeight: true,
        wrapText: true,
        cellRenderer: (params) => {
          const desc = params.value || "";
          const isExpanded = expandedRows[params.data._id];
          const shortDesc =
            desc.length > 100 && !isExpanded
              ? desc.substring(0, 50) + "..."
              : desc;

          return (
            <div
              style={{
                whiteSpace: "normal",
                lineHeight: "1.4em",
                wordWrap: "break-word",
              }}
            >
              {shortDesc}
              {desc.length > 100 && (
                <button
                  onClick={() => toggleDescription(params.data._id)}
                  style={{
                    color: "#60A5FA",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                    marginLeft: "4px",
                    textDecoration: "underline",
                  }}
                >
                  {isExpanded ? "Show less" : "Read more"}
                </button>
              )}
            </div>
          );
        },
      },
      {
        headerName: "Stock",
        field: "totalStock",
        flex: 0.6,
        minWidth: 80,
        cellStyle: { textAlign: "center" },
      },
      {
        headerName: "Avg Review",
        field: "averageReview",
        flex: 0.6,
        minWidth: 100,
        cellStyle: { textAlign: "center" },
      },
      {
        headerName: "Price",
        field: "price",
        flex: 0.7,
        minWidth: 80,
        cellRenderer: (params) => (
          <span
            style={{
              textDecoration:
                params.data.salePrice > 0 ? "line-through" : "none",
              color: params.data.salePrice > 0 ? "#999" : "#FFF",
            }}
          >
            ${params.value}
          </span>
        ),
      },
      {
        headerName: "Sale Price",
        field: "salePrice",
        flex: 0.7,
        minWidth: 80,
        cellRenderer: (params) =>
          params.value > 0 ? (
            <span style={{ color: "#22C55E", fontWeight: 500 }}>
              ${params.value}
            </span>
          ) : (
            "-"
          ),
      },
      {
        headerName: "Actions",
        field: "actions",
        flex: 1,
        minWidth: 160,
        cellRenderer: (params) => (
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setOpenCreateProductsDialog(true);
                setCurrentEditedId(params.data._id);
                setFormData(params.data);
              }}
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(params.data._id)}
            >
              Delete
            </Button>
          </div>
        ),
      },
    ],
    [expandedRows, toggleDescription]
  );

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
      wrapText: true,
      autoHeight: true,
    }),
    []
  );

  return (
    <div className="w-full space-y-4">
      {/* ✅ Search + Filter */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 px-2">
        <input
          type="text"
          placeholder="Search by title or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/2 p-2 rounded-lg border text-dark text-xs focus:outline-none"
        />

        <select
          value={filterOption}
          onChange={(e) => setFilterOption(e.target.value)}
          className="w-full md:w-1/4 p-2 text-xs border  text-dark focus:outline-none"
        >
          <option value="default">Sort By</option>
          <option value="priceLow">Price: Low to High</option>
          <option value="priceHigh">Price: High to Low</option>
          <option value="stockLow">Stock: Low to High</option>
          <option value="stockHigh">Stock: High to Low</option>
          <option value="reviewHigh">Top Reviews</option>
        </select>
      </div>

      {/* ✅ AG Grid Table */}
      <div
        className="ag-theme-quartz items-center"
        style={{
          width: "100%",
          overflowX: "auto",
          borderRadius: "10px",
        }}
      >
        <div className="ag-theme-quartz items-center" style={{ width: "100%", minWidth: "650px" }}>
          <AgGridReact
            rowData={filteredProducts}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            pagination={true}
            paginationPageSize={10}
            suppressHorizontalScroll={false}
            domLayout="autoHeight"
            modules={[AllCommunityModule]}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductTable;
