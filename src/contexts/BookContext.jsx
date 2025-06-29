import React, { createContext, useContext, useState, useEffect } from "react";

const BookContext = createContext();

export const useBook = () => {
  return useContext(BookContext);
};

export const BookProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initialize with mock data
    const mockBooks = [
      {
        id: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        description: "A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream.",
        price: 12.99,
        stock: 25,
        category_id: 1,
        isbn: "978-0-7432-7356-5",
        published_date: "1925-04-10",
        cover_image: "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg",
        pages: 180,
        language: "English",
        format: "Paperback",
        rating: 4.2,
        views: 1250,
      },
      {
        id: 2,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        description: "A gripping tale of racial injustice and childhood innocence in the American South.",
        price: 14.99,
        stock: 18,
        category_id: 1,
        isbn: "978-0-06-112008-4",
        published_date: "1960-07-11",
        cover_image: "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg",
        pages: 324,
        language: "English",
        format: "Paperback",
        rating: 4.5,
        views: 980,
      },
      {
        id: 3,
        title: "1984",
        author: "George Orwell",
        description: "A dystopian social science fiction novel about totalitarian control and surveillance.",
        price: 13.99,
        stock: 0,
        category_id: 2,
        isbn: "978-0-452-28423-4",
        published_date: "1949-06-08",
        cover_image: "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg",
        pages: 328,
        language: "English",
        format: "Paperback",
        rating: 4.4,
        views: 1500,
      },
      {
        id: 4,
        title: "Pride and Prejudice",
        author: "Jane Austen",
        description: "A romantic novel that critiques the British landed gentry at the end of the 18th century.",
        price: 11.99,
        stock: 32,
        category_id: 3,
        isbn: "978-0-14-143951-8",
        published_date: "1813-01-28",
        cover_image: "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg",
        pages: 432,
        language: "English",
        format: "Paperback",
        rating: 4.3,
        views: 750,
      },
      {
        id: 5,
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        description: "A fantasy adventure novel about Bilbo Baggins' unexpected journey.",
        price: 16.99,
        stock: 8,
        category_id: 4,
        isbn: "978-0-547-92822-7",
        published_date: "1937-09-21",
        cover_image: "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg",
        pages: 366,
        language: "English",
        format: "Paperback",
        rating: 4.6,
        views: 2100,
      },
    ];

    const mockCategories = [
      { id: 1, name: "Fiction", description: "Fictional literature and novels" },
      { id: 2, name: "Science Fiction", description: "Science fiction and dystopian novels" },
      { id: 3, name: "Romance", description: "Romantic literature and love stories" },
      { id: 4, name: "Fantasy", description: "Fantasy and magical realism" },
      { id: 5, name: "Mystery", description: "Mystery and thriller novels" },
      { id: 6, name: "Non-Fiction", description: "Non-fictional books and biographies" },
    ];

    setBooks(mockBooks);
    setCategories(mockCategories);
  }, []);

  const addBook = async (bookData) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newBook = {
        id: Math.max(...books.map(b => b.id), 0) + 1,
        ...bookData,
        rating: 0,
        views: 0,
      };
      
      setBooks(prev => [...prev, newBook]);
      return newBook;
    } catch (error) {
      console.error('Failed to add book:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateBook = async (id, bookData) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedBook = { ...bookData, id };
      setBooks(prev => prev.map(book => book.id === id ? updatedBook : book));
      return updatedBook;
    } catch (error) {
      console.error('Failed to update book:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteBook = async (id) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setBooks(prev => prev.filter(book => book.id !== id));
    } catch (error) {
      console.error('Failed to delete book:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getBookById = (id) => {
    return books.find(book => book.id === id);
  };

  const getBooksByCategory = (categoryId) => {
    return books.filter(book => book.category_id === categoryId);
  };

  const searchBooks = (query) => {
    const lowerQuery = query.toLowerCase();
    return books.filter(book => 
      book.title.toLowerCase().includes(lowerQuery) ||
      book.author.toLowerCase().includes(lowerQuery) ||
      book.description.toLowerCase().includes(lowerQuery)
    );
  };

  const value = {
    books,
    categories,
    loading,
    addBook,
    updateBook,
    deleteBook,
    getBookById,
    getBooksByCategory,
    searchBooks,
  };

  return (
    <BookContext.Provider value={value}>
      {children}
    </BookContext.Provider>
  );
};