import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({});
  const [image, setImage] = useState(null);
  const [updateProduct, setUpdateProduct] = useState({
    id: null,
    name: "",
    description: "",
    brand: "",
    price: "",
    category: "",
    releaseDate: "",
    productAvailable: false,
    stockQuantity: "",
  });
  const [imageChanged, setImageChanged] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const baseUrl = import.meta.env.VITE_BASE_URL;

  // 🧩 Convert blob to File
  const convertUrlToFile = async (blobData, fileName) => {
    return new File([blobData], fileName, { type: blobData.type });
  };

  // 🧩 Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/product/${id}`);
        setProduct(response.data);
        setUpdateProduct(response.data);

        // Fetch image as blob
        const responseImage = await axios.get(
          `${baseUrl}/api/product/${id}/image`,
          { responseType: "blob" }
        );

        const imageFile = await convertUrlToFile(
          responseImage.data,
          response.data.imageName
        );
        setImage(imageFile);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product details");
      }
    };

    fetchProduct();
  }, [id, baseUrl]);

  // 🧩 Handle Image Change
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setImageChanged(true);
    }
  };

  // 🧩 Handle Field Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateProduct({
      ...updateProduct,
      [name]: value,
    });
  };

  // 🧩 Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append(
      "product",
      new Blob([JSON.stringify(updateProduct)], { type: "application/json" })
    );

    if (imageChanged && image) {
      formData.append("imageFile", image);
    } else {
      formData.append("imageFile", new Blob());
    }

    try {
      const response = await axios.put(`${baseUrl}/api/product/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Product updated successfully:", response.data);
      toast.success("Product updated successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🧩 Show loading spinner while fetching
  if (!product.id) {
    return (
      <div className="container mt-5 pt-5">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "300px" }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  // 🧩 Main Render
  return (
    <div className="container mt-5 pt-5">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="text-center mb-4">Update Product</h2>

              <form className="row g-3" noValidate onSubmit={handleSubmit}>
                {/* Name */}
                <div className="col-md-6">
                  <label htmlFor="name" className="form-label fw-bold">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={product.name}
                    value={updateProduct.name}
                    onChange={handleChange}
                    name="name"
                    id="name"
                    required
                  />
                </div>

                {/* Brand */}
                <div className="col-md-6">
                  <label htmlFor="brand" className="form-label fw-bold">
                    Brand
                  </label>
                  <input
                    type="text"
                    name="brand"
                    className="form-control"
                    placeholder={product.brand}
                    value={updateProduct.brand}
                    onChange={handleChange}
                    id="brand"
                    required
                  />
                </div>

                {/* Description */}
                <div className="col-12">
                  <label htmlFor="description" className="form-label fw-bold">
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    placeholder={product.description}
                    value={updateProduct.description}
                    name="description"
                    onChange={handleChange}
                    id="description"
                    rows="3"
                    required
                  />
                </div>

                {/* Price */}
                <div className="col-md-4">
                  <label htmlFor="price" className="form-label fw-bold">
                    Price
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">Rs</span>
                    <input
                      type="number"
                      className="form-control"
                      onChange={handleChange}
                      value={updateProduct.price}
                      placeholder={product.price}
                      name="price"
                      id="price"
                      min="0.01"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="col-md-4">
                  <label htmlFor="category" className="form-label fw-bold">
                    Category
                  </label>
                  <select
                    className="form-select"
                    value={updateProduct.category}
                    onChange={handleChange}
                    name="category"
                    id="category"
                    required
                  >
                    <option value="">Select category</option>
                    <option value="Laptop">Laptop</option>
                    <option value="Headphone">Headphone</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Toys">Toys</option>
                    <option value="Fashion">Fashion</option>
                  </select>
                </div>

                {/* Stock Quantity */}
                <div className="col-md-4">
                  <label htmlFor="stockQuantity" className="form-label fw-bold">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    onChange={handleChange}
                    placeholder={product.stockQuantity}
                    value={updateProduct.stockQuantity}
                    name="stockQuantity"
                    id="stockQuantity"
                    min="0"
                    required
                  />
                </div>

                {/* Release Date */}
                <div className="col-md-6">
                  <label htmlFor="releaseDate" className="form-label fw-bold">
                    Release Date
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    value={
                      updateProduct.releaseDate
                        ? updateProduct.releaseDate.slice(0, 10)
                        : ""
                    }
                    name="releaseDate"
                    onChange={handleChange}
                    id="releaseDate"
                    required
                  />
                </div>

                {/* Image Upload */}
                <div className="col-md-6">
                  <label htmlFor="imageFile" className="form-label fw-bold">
                    Image
                  </label>
                  {image && (
                    <div className="mb-2">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={product.name}
                        className="img-fluid rounded mb-2"
                        style={{ height: "150px", objectFit: "contain" }}
                        onLoad={(e) => URL.revokeObjectURL(e.target.src)}
                      />
                    </div>
                  )}
                  <input
                    className="form-control"
                    type="file"
                    onChange={handleImageChange}
                    id="imageFile"
                    accept="image/png, image/jpeg"
                  />
                  <div className="form-text">
                    Leave empty to keep current image
                  </div>
                </div>

                {/* Product Available */}
                <div className="col-12">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="productAvailable"
                      id="productAvailable"
                      checked={updateProduct.productAvailable}
                      onChange={(e) =>
                        setUpdateProduct({
                          ...updateProduct,
                          productAvailable: e.target.checked,
                        })
                      }
                    />
                    <label
                      className="form-check-label"
                      htmlFor="productAvailable"
                    >
                      Product Available
                    </label>
                  </div>
                </div>

                {/* Buttons */}
                <div className="col-12 mt-4">
                  {loading ? (
                    <button className="btn btn-primary" type="button" disabled>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Updating...
                    </button>
                  ) : (
                    <button type="submit" className="btn btn-primary">
                      Update Product
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn btn-outline-secondary ms-2"
                    onClick={() => navigate("/")}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProduct;
