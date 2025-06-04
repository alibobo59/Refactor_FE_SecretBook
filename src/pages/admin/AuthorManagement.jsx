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

const AuthorManagement = () => {
  // Mock data - in a real app, this would come from an API
  const [authors, setAuthors] = useState([
    {
      id: 1,
      name: "J.K. Rowling",
      biography: "British author best known for the Harry Potter series",
      birthDate: "1965-07-31",
      nationality: "British",
      booksCount: 15,
    },
    {
      id: 2,
      name: "Stephen King",
      biography: "American author of horror, supernatural fiction, and fantasy",
      birthDate: "1947-09-21",
      nationality: "American",
      booksCount: 64,
    },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentAuthor, setCurrentAuthor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const validateForm = (author) => {
    const errors = {};
    if (!author.name?.trim()) errors.name = "Author name is required";
    if (!author.biography?.trim()) errors.biography = "Biography is required";
    if (!author.birthDate) errors.birthDate = "Birth date is required";
    if (!author.nationality?.trim()) errors.nationality = "Nationality is required";
    return errors;
  };

  const handleAddAuthor = (authorData) => {
    const errors = validateForm(authorData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const newAuthor = {
      id: Math.max(...authors.map((a) => a.id)) + 1,
      ...authorData,
      booksCount: 0,
    };
    setAuthors([...authors, newAuthor]);
    setIsAddModalOpen(false);
  };

  const handleEditAuthor = (authorData) => {
    const errors = validateForm(authorData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setAuthors(
      authors.map((author) =>
        author.id === authorData.id ? { ...author, ...authorData } : author
      )
    );
    setIsEditModalOpen(false);
  };

  const handleDeleteAuthor = (id) => {
    setAuthors(authors.filter((author) => author.id !== id));
    setIsDeleteModalOpen(false);
  };

  const filteredAuthors = authors.filter((author) =>
    author.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { id: "id", label: "ID", sortable: false },
    { id: "name", label: "Name", sortable: true },
    { id: "nationality", label: "Nationality", sortable: true },
    { id: "birthDate", label: "Birth Date", sortable: true },
    { id: "booksCount", label: "Books", sortable: true },
    { id: "actions", label: "Actions", sortable: false },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Author Management"
        onAddNew={() => {
          setCurrentAuthor({
            name: "",
            biography: "",
            birthDate: "",
            nationality: "",
          });
          setFormErrors({});
          setIsAddModalOpen(true);
        }}
        addNewLabel="Add New Author"
      />

      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search authors..."
      />

      <Table
        columns={columns}
        data={filteredAuthors}
        renderRow={(author) => (
          <tr key={author.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
              {author.id}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
              {author.name}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
              {author.nationality}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
              {new Date(author.birthDate).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
              {author.booksCount}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <ActionButtons
                onEdit={() => {
                  setCurrentAuthor(author);
                  setFormErrors({});
                  setIsEditModalOpen(true);
                }}
                onDelete={() => {
                  setCurrentAuthor(author);
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
        title={`${isAddModalOpen ? "Add" : "Edit"} Author`}
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
                  handleAddAuthor(currentAuthor);
                } else {
                  handleEditAuthor(currentAuthor);
                }
              }}>
              {isAddModalOpen ? "Add Author" : "Save Changes"}
            </button>
          </div>
        }>
        <div className="space-y-4">
          <FormField
            label="Name"
            value={currentAuthor?.name || ""}
            onChange={(e) =>
              setCurrentAuthor({ ...currentAuthor, name: e.target.value })
            }
            error={formErrors.name}
            required
          />
          <FormField
            label="Biography"
            type="textarea"
            value={currentAuthor?.biography || ""}
            onChange={(e) =>
              setCurrentAuthor({ ...currentAuthor, biography: e.target.value })
            }
            error={formErrors.biography}
            required
          />
          <FormField
            label="Birth Date"
            type="date"
            value={currentAuthor?.birthDate || ""}
            onChange={(e) =>
              setCurrentAuthor({ ...currentAuthor, birthDate: e.target.value })
            }
            error={formErrors.birthDate}
            required
          />
          <FormField
            label="Nationality"
            value={currentAuthor?.nationality || ""}
            onChange={(e) =>
              setCurrentAuthor({ ...currentAuthor, nationality: e.target.value })
            }
            error={formErrors.nationality}
            required
          />
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Author"
        footer={
          <div className="flex justify-end space-x-3">
            <button
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              onClick={() => handleDeleteAuthor(currentAuthor.id)}>
              Delete Author
            </button>
          </div>
        }>
        <div className="flex items-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span>
            Are you sure you want to delete author{" "}
            <span className="font-semibold">{currentAuthor?.name}</span>? This
            action cannot be undone.
          </span>
        </div>
      </Modal>
    </div>
  );
};

export default AuthorManagement;