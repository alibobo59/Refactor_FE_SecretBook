import React, { useState, useEffect } from "react";
import { useBook } from "../../contexts/BookContext";
import { AlertCircle, Save } from "lucide-react";
import {
  PageHeader,
  Table,
  ActionButtons,
  Modal,
  FormField,
} from "../../components/admin";

const CategoryManagement = () => {
  const { categories } = useBook();
  const [localCategories, setLocalCategories] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    // Initialize local categories from context
    setLocalCategories(categories);
  }, [categories]);

  const validateForm = (category) => {
    const errors = {};
    if (!category.name.trim()) {
      errors.name = "Category name is required";
    }
    if (!category.description.trim()) {
      errors.description = "Category description is required";
    }
    return errors;
  };

  const handleAddCategory = () => {
    const errors = validateForm(newCategory);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // In a real app, this would make an API call
    const newId = Math.max(...localCategories.map((c) => c.id), 0) + 1;
    const categoryToAdd = {
      id: newId,
      name: newCategory.name,
      description: newCategory.description,
    };

    setLocalCategories([...localCategories, categoryToAdd]);
    setNewCategory({ name: "", description: "" });
    setFormErrors({});
    setIsAddModalOpen(false);
  };

  const handleEditCategory = () => {
    const errors = validateForm(currentCategory);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // In a real app, this would make an API call
    const updatedCategories = localCategories.map((category) =>
      category.id === currentCategory.id ? currentCategory : category
    );

    setLocalCategories(updatedCategories);
    setCurrentCategory(null);
    setFormErrors({});
    setIsEditModalOpen(false);
  };

  const handleDeleteCategory = () => {
    // In a real app, this would make an API call
    const updatedCategories = localCategories.filter(
      (category) => category.id !== currentCategory.id
    );

    setLocalCategories(updatedCategories);
    setCurrentCategory(null);
    setIsDeleteModalOpen(false);
  };

  const openEditModal = (category) => {
    setCurrentCategory({ ...category });
    setFormErrors({});
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (category) => {
    setCurrentCategory(category);
    setIsDeleteModalOpen(true);
  };

  // Define columns for the categories table
  const columns = [
    { id: "id", label: "ID", sortable: false },
    { id: "name", label: "Name", sortable: false },
    { id: "description", label: "Description", sortable: false },
    { id: "actions", label: "Actions", sortable: false },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Category Management"
        onAddNew={() => {
          setNewCategory({ name: "", description: "" });
          setFormErrors({});
          setIsAddModalOpen(true);
        }}
        addNewLabel="Add New Category"
      />

      <Table
        columns={columns}
        data={localCategories}
        renderRow={(category) => (
          <tr
            key={category.id}
            className="hover:bg-gray-50 dark:hover:bg-gray-700">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
              {category.id}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
              {category.name}
            </td>
            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
              {category.description}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <ActionButtons
                onEdit={() => openEditModal(category)}
                onDelete={() => openDeleteModal(category)}
              />
            </td>
          </tr>
        )}
      />

      {/* Add Category Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Category"
        footer={
          <div className="flex justify-end space-x-3">
            <button
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 flex items-center"
              onClick={handleAddCategory}>
              <Save className="h-4 w-4 mr-2" />
              Save Category
            </button>
          </div>
        }>
        <div className="space-y-4">
          <FormField
            label="Category Name"
            type="text"
            value={newCategory.name}
            onChange={(e) =>
              setNewCategory({ ...newCategory, name: e.target.value })
            }
            error={formErrors.name}
            required
          />
          <FormField
            label="Description"
            type="textarea"
            value={newCategory.description}
            onChange={(e) =>
              setNewCategory({ ...newCategory, description: e.target.value })
            }
            error={formErrors.description}
            required
          />
        </div>
      </Modal>

      {/* Edit Category Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Category"
        footer={
          <div className="flex justify-end space-x-3">
            <button
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 flex items-center"
              onClick={handleEditCategory}>
              <Save className="h-4 w-4 mr-2" />
              Update Category
            </button>
          </div>
        }>
        {currentCategory && (
          <div className="space-y-4">
            <FormField
              label="Category Name"
              type="text"
              value={currentCategory.name}
              onChange={(e) =>
                setCurrentCategory({
                  ...currentCategory,
                  name: e.target.value,
                })
              }
              error={formErrors.name}
              required
            />
            <FormField
              label="Description"
              type="textarea"
              value={currentCategory.description}
              onChange={(e) =>
                setCurrentCategory({
                  ...currentCategory,
                  description: e.target.value,
                })
              }
              error={formErrors.description}
              required
            />
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Category"
        footer={
          <div className="flex justify-end space-x-3">
            <button
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
              onClick={handleDeleteCategory}>
              Delete Category
            </button>
          </div>
        }>
        {currentCategory && (
          <div className="flex items-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>
              Are you sure you want to delete the category
              <span className="font-semibold"> {currentCategory.name}</span>?
              This action cannot be undone and may affect books assigned to this
              category.
            </span>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CategoryManagement;
