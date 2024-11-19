import React, { useState, useEffect } from "react";
import axiosInstance from "../common/utils/axios-instance.util";

interface Category {
  id: string;
  name: string;
}

export interface ProductCreateFormInterface {
  name: string;
  brand: string;
  description: string;
  img: string;
  specifications: Record<string, string>;
  price: number;
  warranty: string;
  availability: number;
  discount: number;
  categoryId: string;
}

interface ProductFormProps {
  initialData?: ProductCreateFormInterface;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
}

interface SpecificationField {
  id: string;
  key: string;
  value: string;
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const initialSpecs = Object.entries(initialData?.specifications || {}).map(
    ([key, value], index) => ({
      id: `spec-${index}`,
      key,
      value,
    })
  );

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    brand: initialData?.brand || "",
    description: initialData?.description || "",
    price: initialData?.price || "",
    warranty: initialData?.warranty || "",
    availability: initialData?.availability || "",
    discount: initialData?.discount || "",
    categoryId: initialData?.categoryId || "",
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    initialData?.img || ""
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [specifications, setSpecifications] =
    useState<SpecificationField[]>(initialSpecs);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get("/categories");
        setCategories(response.data);
      } catch (err) {
        setError("Failed to load categories. Please try again later.");
        console.error("Error fetching categories:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    const numericFields = ["price", "availability", "discount"];

    if (numericFields.includes(name)) {
      // Allow empty string or valid numbers only
      if (value === "" || /^\d*\.?\d*$/.test(value)) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSpecificationAdd = () => {
    const newId = `spec-${specifications.length}`;
    setSpecifications((prev) => [...prev, { id: newId, key: "", value: "" }]);
  };

  const handleSpecificationChange = (
    id: string,
    field: "key" | "value",
    newValue: string
  ) => {
    setSpecifications((prev) =>
      prev.map((spec) =>
        spec.id === id ? { ...spec, [field]: newValue } : spec
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formDataToSubmit = new FormData();

    // Add all basic form fields
    Object.entries(formData).forEach(([key, value]) => {
      // Convert empty strings to "0" for numeric fields
      if (["price", "availability", "discount"].includes(key)) {
        const numericValue = value === "" ? "0" : value.toString();
        formDataToSubmit.append(key, numericValue);
      } else {
        formDataToSubmit.append(key, value.toString());
      }
    });

    // Convert specifications array to object and stringify
    const specificationsObject = specifications.reduce(
      (acc, { key, value }) => {
        if (key.trim()) {
          acc[key] = value;
        }
        return acc;
      },
      {} as Record<string, string>
    );

    formDataToSubmit.append(
      "specifications",
      JSON.stringify(specificationsObject)
    );

    // Add image if selected
    if (selectedImage) {
      formDataToSubmit.append("img", selectedImage);
    }

    // Submit the form
    onSubmit(formDataToSubmit);
  };

  const formStyles = {
    inputBase:
      "w-full px-3 py-2 border border-[#1A3F6B]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3F6B]/50 hover:border-[#1A3F6B]/50",
    label: "block text-sm font-medium text-[#1A3F6B]",
    button: {
      primary:
        "px-4 py-2 bg-[#1A3F6B] text-white rounded-md hover:bg-[#15355A]",
      secondary:
        "px-4 py-2 border border-[#1A3F6B] text-[#1A3F6B] rounded-md hover:bg-[#1A3F6B]/10",
    },
    fileInput:
      "block w-full text-sm text-[#1A3F6B] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-[#1A3F6B] file:text-[#1A3F6B] file:bg-white hover:file:bg-[#1A3F6B]/10 file:cursor-pointer cursor-pointer",
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 space-y-6 bg-white rounded-lg shadow-md"
    >
      {/* Image Upload */}
      <div>
        <label className={formStyles.label}>Product Image</label>
        <div className="mt-1 flex flex-col items-center">
          {imagePreview && (
            <div className="mb-4">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-40 w-40 object-cover rounded-md"
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className={formStyles.fileInput}
          />
        </div>
      </div>

      {/* Basic Information */}
      <div>
        <label className={formStyles.label}>Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          className={formStyles.inputBase}
        />
      </div>

      <div>
        <label className={formStyles.label}>Brand</label>
        <input
          type="text"
          name="brand"
          value={formData.brand}
          onChange={handleInputChange}
          required
          className={formStyles.inputBase}
        />
      </div>

      <div>
        <label className={formStyles.label}>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className={formStyles.inputBase}
          rows={4}
        />
      </div>

      {/* Grid layout for compact fields */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={formStyles.label}>Price</label>
          <input
            type="text"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="Enter price"
            required
            className={formStyles.inputBase}
          />
        </div>

        <div>
          <label className={formStyles.label}>Warranty</label>
          <input
            type="text"
            name="warranty"
            value={formData.warranty}
            onChange={handleInputChange}
            placeholder="Enter warranty period"
            className={formStyles.inputBase}
          />
        </div>

        <div>
          <label className={formStyles.label}>Availability</label>
          <input
            type="text"
            name="availability"
            value={formData.availability}
            onChange={handleInputChange}
            placeholder="Enter quantity"
            required
            className={formStyles.inputBase}
          />
        </div>

        <div>
          <label className={formStyles.label}>Discount</label>
          <input
            type="text"
            name="discount"
            value={formData.discount}
            onChange={handleInputChange}
            placeholder="Enter discount"
            className={formStyles.inputBase}
          />
        </div>
      </div>

      {/* Category Selection */}
      <div>
        <label className={formStyles.label}>Category</label>
        {isLoading ? (
          <div className="mt-1 text-sm text-[#1A3F6B]/70">
            Loading categories...
          </div>
        ) : error ? (
          <div className="mt-1 text-sm text-red-500">{error}</div>
        ) : (
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleInputChange}
            required
            className={formStyles.inputBase}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Specifications */}
      <div>
        <label className={formStyles.label}>Specifications</label>
        {specifications.map((spec) => (
          <div key={spec.id} className="flex items-center space-x-2 mt-2">
            <input
              type="text"
              value={spec.key}
              onChange={(e) =>
                handleSpecificationChange(spec.id, "key", e.target.value)
              }
              placeholder="Key"
              className={`${formStyles.inputBase} w-1/3`}
            />
            <input
              type="text"
              value={spec.value}
              onChange={(e) =>
                handleSpecificationChange(spec.id, "value", e.target.value)
              }
              placeholder="Value"
              className={`${formStyles.inputBase} w-2/3`}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={handleSpecificationAdd}
          className={formStyles.button.secondary}
        >
          Add Specification
        </button>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className={formStyles.button.secondary}
        >
          Cancel
        </button>
        <button type="submit" className={formStyles.button.primary}>
          {initialData ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
