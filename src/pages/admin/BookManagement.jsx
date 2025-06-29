import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PageHeader,
  SearchFilter,
  Table,
  ActionButtons,
} from "../../components/admin";
import { Eye, Edit, Trash2 } from "lucide-react";

/**
 * Book management component for the admin dashboard
 */
const BookManagement = ({ books, categories }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortField, setSortField] = useState("title");
  const [sortDirection, setSortDirection] = useState("asc");

  // Filter books based on search term and category
  const filteredBooks = books
    .filter(
      (book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((book) =>
      selectedCategory ? book.category_id.toString() === selectedCategory : true
    );

  // Sort filtered books
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (sortDirection === "asc") {
      return a[sortField] > b[sortField] ? 1 : -1;
    } else {
      return a[sortField] < b[sortField] ? 1 : -1;
    }
  });

  // Handle sorting when a column header is clicked
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Handle adding a new book
  const handleAddBook = () => {
    navigate('/admin/books/create');
  };

  // Handle viewing book details
  const handleViewBook = (bookId) => {
    navigate(`/admin/books/${bookId}`);
  };

  // Handle editing a book
  const handleEditBook = (bookId) => {
    navigate(`/admin/books/${bookId}/edit`);
  };

  // Handle deleting a book
  const handleDeleteBook = (book) => {
    if (window.confirm(`Are you sure you want to delete "${book.title}"?`)) {
      // In a real app, this would call a delete function
      console.log(`Delete book ${book.id}`);
    }
  };

  // Prepare category options for the filter dropdown
  const categoryOptions = categories.map((category) => ({
    value: category.id.toString(),
    label: category.name,
  }));

  // Define columns for the books table
  const columns = [
    { id: "id", label: "ID", sortable: true },
    { id: "title", label: "Title", sortable: true },
    { id: "author", label: "Author", sortable: true },
    { id: "price", label: "Price", sortable: true },
    { id: "stock", label: "Stock", sortable: true },
    { id: "category", label: "Category", sortable: false },
    { id: "actions", label: "Actions", sortable: false },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Book Management"
        onAddNew={handleAddBook}
        addNewLabel="Add New Book"
      />

      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search books..."
        filterValue={selectedCategory}
        onFilterChange={setSelectedCategory}
        filterOptions={categoryOptions}
        filterPlaceholder="All Categories"
      />

      <Table
        columns={columns}
        data={sortedBooks}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
        renderRow={(book) => {
          const category = categories.find(
            (c) => c.id.toString() === book.category_id.toString()
          );
          return (
            <tr
              key={book.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
              onClick={() => handleViewBook(book.id)}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {book.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                <div className="flex items-center gap-3">
                  <img
                    src={book.cover_image}
                    alt={book.title}
                    className="w-8 h-10 object-cover rounded"
                  />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {book.title}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      ISBN: {book.isbn}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {book.author}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                ${book.price.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  book.stock === 0 
                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    : book.stock < 10 
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                }`}>
                  {book.stock}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {category?.name || "Unknown"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => handleViewBook(book.id)}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleEditBook(book.id)}
                    className="text-amber-600 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-300"
                    title="Edit Book"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteBook(book)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    title="Delete Book"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          );
        }}
      />
    </div>
  );
};

export default BookManagement;