import React, { useState } from "react";
import {
  PageHeader,
  Table,
  ActionButtons,
  Modal,
  FormField,
  SearchFilter,
} from "../../components/admin";
import { AlertCircle } from "lucide-react";

const PublisherManagement = () => {
  // Mock data - in a real app, this would come from an API
  const [publishers, setPublishers] = useState([
    {
      id: 1,
      name: "Penguin Random House",
      description: "One of the largest English-language publishers",
      founded: "2013-07-01",
      country: "United States",
      booksCount: 25,
    },
    {
      id: 2,
      name: "HarperCollins",
      description: "Major publishing company based in New York City",
      founded: "1989-01-01",
      country: "United States",
      booksCount: 18,
    },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentPublisher, setCurrentPublisher] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const validateForm = (publisher) => {
    const errors = {};
    if (!publisher.name?.trim()) errors.name = "Publisher name is required";
    if (!publisher.description?.trim())
      errors.description = "Description is required";
    if (!publisher.founded) errors.founded = "Founded date is required";
    if (!publisher.country?.trim()) errors.country = "Country is required";
    return errors;
  };

  const handleAddPublisher = (publisherData) => {
    const errors = validateForm(publisherData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const newPublisher = {
      id: Math.max(...publishers.map((p) => p.id)) + 1,
      ...publisherData,
      booksCount: 0,
    };
    setPublishers([...publishers, newPublisher]);
    setIsAddModalOpen(false);
  };

  const handleEditPublisher = (publisherData) => {
    const errors = validateForm(publisherData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setPublishers(
      publishers.map((publisher) =>
        publisher.id === publisherData.id
          ? { ...publisher, ...publisherData }
          : publisher
      )
    );
    setIsEditModalOpen(false);
  };

  const handleDeletePublisher = (id) => {
    setPublishers(publishers.filter((publisher) => publisher.id !== id));
    setIsDeleteModalOpen(false);
  };

  const filteredPublishers = publishers.filter((publisher) =>
    publisher.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { id: "id", label: "ID", sortable: false },
    { id: "name", label: "Name", sortable: true },
    { id: "country", label: "Country", sortable: true },
    { id: "founded", label: "Founded", sortable: true },
    { id: "booksCount", label: "Books", sortable: true },
    { id: "actions", label: "Actions", sortable: false },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Publisher Management"
        onAddNew={() => {
          setCurrentPublisher({
            name: "",
            description: "",
            founded: "",
            country: "",
          });
          setFormErrors({});
          setIsAddModalOpen(true);
        }}
        addNewLabel="Add New Publisher"
      />

      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search publishers..."
      />

      <Table
        columns={columns}
        data={filteredPublishers}
        renderRow={(publisher) => (
          <tr
            key={publisher.id}
            className="hover:bg-gray-50 dark:hover:bg-gray-700">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
              {publisher.id}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
              {publisher.name}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
              {publisher.country}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
              {new Date(publisher.founded).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
              {publisher.booksCount}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <ActionButtons
                onEdit={() => {
                  setCurrentPublisher(publisher);
                  setFormErrors({});
                  setIsEditModalOpen(true);
                }}
                onDelete={() => {
                  setCurrentPublisher(publisher);
                  setIsDeleteModalOpen(true);
                }}
              />
            </td>
          </tr>
        )}
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isAddModalOpen || isEditModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
          setFormErrors({});
        }}
        title={`${isAddModalOpen ? "Add" : "Edit"} Publisher`}
        footer={
          <div className="flex justify-end space-x-3">
            <button
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => {
                setIsAddModalOpen(false);
                setIsEditModalOpen(false);
                setFormErrors({});
              }}>
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
              onClick={() => {
                if (isAddModalOpen) {
                  handleAddPublisher(currentPublisher);
                } else {
                  handleEditPublisher(currentPublisher);
                }
              }}>
              {isAddModalOpen ? "Add Publisher" : "Save Changes"}
            </button>
          </div>
        }>
        <div className="space-y-4">
          <FormField
            label="Name"
            value={currentPublisher?.name || ""}
            onChange={(e) =>
              setCurrentPublisher({ ...currentPublisher, name: e.target.value })
            }
            error={formErrors.name}
            required
          />
          <FormField
            label="Description"
            type="textarea"
            value={currentPublisher?.description || ""}
            onChange={(e) =>
              setCurrentPublisher({
                ...currentPublisher,
                description: e.target.value,
              })
            }
            error={formErrors.description}
            required
          />
          <FormField
            label="Founded Date"
            type="date"
            value={currentPublisher?.founded || ""}
            onChange={(e) =>
              setCurrentPublisher({ ...currentPublisher, founded: e.target.value })
            }
            error={formErrors.founded}
            required
          />
          <FormField
            label="Country"
            value={currentPublisher?.country || ""}
            onChange={(e) =>
              setCurrentPublisher({ ...currentPublisher, country: e.target.value })
            }
            error={formErrors.country}
            required
          />
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Publisher"
        footer={
          <div className="flex justify-end space-x-3">
            <button
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              onClick={() => handleDeletePublisher(currentPublisher.id)}>
              Delete Publisher
            </button>
          </div>
        }>
        <div className="flex items-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span>
            Are you sure you want to delete publisher{" "}
            <span className="font-semibold">{currentPublisher?.name}</span>? This
            action cannot be undone.
          </span>
        </div>
      </Modal>
    </div>
  );
};

export default PublisherManagement;