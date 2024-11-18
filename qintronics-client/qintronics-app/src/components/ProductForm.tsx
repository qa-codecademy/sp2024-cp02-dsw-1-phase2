import React, { useState, useEffect } from "react";
import axiosInstance from "../common/utils/axios-instance.util";

interface Product {
  id: string;
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
  createdAt: Date;
  updatedAt: Date;
}

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
    price: initialData?.price || 0,
    warranty: initialData?.warranty || "",
    availability: initialData?.availability || 0,
    discount: initialData?.discount || 0,
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

    setFormData((prev) => ({
      ...prev,
      [name]: numericFields.includes(name) ? parseInt(value) : value,
    }));
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
      // Convert numbers to strings for FormData
      formDataToSubmit.append(key, value.toString());
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

    // Add image if selected - using 'image' as the field name to match FileInterceptor
    if (selectedImage) {
      formDataToSubmit.append("img", selectedImage);
    }

    // Submit the form
    onSubmit(formDataToSubmit);
  };

  const inputClassName =
    "mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Product Image
        </label>
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
            className={inputClassName}
          />
        </div>
      </div>

      {/* Basic Information */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          className={inputClassName}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Brand</label>
        <input
          type="text"
          name="brand"
          value={formData.brand}
          onChange={handleInputChange}
          required
          className={inputClassName}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className={inputClassName}
          rows={4}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Price</label>
        <input
          type="number"
          step="1"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          required
          className={inputClassName}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Warranty
        </label>
        <input
          type="text"
          name="warranty"
          value={formData.warranty}
          onChange={handleInputChange}
          className={inputClassName}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Availability
        </label>
        <input
          type="number"
          name="availability"
          value={formData.availability}
          onChange={handleInputChange}
          required
          className={inputClassName}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Discount (%)
        </label>
        <input
          type="number"
          step="0.01"
          name="discount"
          value={formData.discount}
          onChange={handleInputChange}
          className={inputClassName}
        />
      </div>

      {/* Category Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Category
        </label>
        {isLoading ? (
          <div className="mt-1 text-sm text-gray-500">
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
            className={inputClassName}
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
        <label className="block text-sm font-medium text-gray-700">
          Specifications
        </label>
        {specifications.map((spec) => (
          <div key={spec.id} className="flex items-center space-x-2 mt-2">
            <input
              type="text"
              value={spec.key}
              onChange={(e) =>
                handleSpecificationChange(spec.id, "key", e.target.value)
              }
              placeholder="Key"
              className={`${inputClassName} w-1/3`}
            />
            <input
              type="text"
              value={spec.value}
              onChange={(e) =>
                handleSpecificationChange(spec.id, "value", e.target.value)
              }
              placeholder="Value"
              className={`${inputClassName} w-2/3`}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={handleSpecificationAdd}
          className="mt-2 px-4 py-2 bg-gray-100 text-sm rounded-md hover:bg-gray-200"
        >
          Add Specification
        </button>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-[#1A3F6B] text-white rounded-md hover:bg-[#15355A]"
        >
          {initialData ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
