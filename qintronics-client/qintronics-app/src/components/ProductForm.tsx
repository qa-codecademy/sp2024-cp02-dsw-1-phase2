import React from "react";
import { useForm } from "react-hook-form";
import { Product } from "./../common/types/Product.interface";

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: Omit<Product, "id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || {
      name: "",
      brand: "",
      description: "",
      img: "",
      specifications: {
        cpu: "",
        gpu: "",
        ram: "",
        storage: "",
        display: "",
        camera: "",
        battery: "",
        os: "",
      },
      price: 0,
      warranty: "",
      availability: 0,
      discount: 0,
      categoryId: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          {...register("name", { required: "Name is required" })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Brand</label>
        <input
          {...register("brand", { required: "Brand is required" })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          {...register("description")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      {/* Add other form fields similarly */}

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded-md text-gray-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          {initialData ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
