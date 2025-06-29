import React, { createContext, useContext, useState, useEffect } from 'react';

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
    const mockCategories = [
      { id: 1, name: 'Fiction', description: 'Fictional stories and novels' },
      { id: 2, name: 'Non-Fiction', description: 'Educational and factual books' },
      { id: 3, name: 'Mystery', description: 'Mystery and thriller novels' },
      { id: 4, name: 'Romance', description: 'Romantic novels and stories' },
      { id: 5, name: 'Science Fiction', description: 'Science fiction and fantasy' },
      { id: 6, name: 'Biography', description: 'Biographies and memoirs' },
    ];

    const mockBooks = [
      {
        id: 1,
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        description: 'A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream through the eyes of narrator Nick Carraway.',
        price: 12.99,
        stock: 25,
        category_id: 1,
        isbn: '978-0-7432-7356-5',
        published_date: '1925-04-10',
        cover_image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg',
        pages: 180,
        language: 'English',
        format: 'Paperback',
        rating: 4.2,
        views: 1250,
        hasVariations: true,
      },
      {
        id: 2,
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        description: 'A gripping tale of racial injustice and childhood innocence in the American South, told through the eyes of Scout Finch.',
        price: 14.99,
        stock: 18,
        category_id: 1,
        isbn: '978-0-06-112008-4',
        published_date: '1960-07-11',
        cover_image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg',
        pages: 324,
        language: 'English',
        format: 'Hardcover',
        rating: 4.5,
        views: 980,
        hasVariations: true,
      },
      {
        id: 3,
        title: '1984',
        author: 'George Orwell',
        description: 'A dystopian social science fiction novel that explores themes of totalitarianism, surveillance, and individual freedom.',
        price: 13.99,
        stock: 30,
        category_id: 5,
        isbn: '978-0-452-28423-4',
        published_date: '1949-06-08',
        cover_image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg',
        pages: 328,
        language: 'English',
        format: 'Paperback',
        rating: 4.4,
        views: 1450,
        hasVariations: false,
      },
      {
        id: 4,
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        description: 'A romantic novel that critiques the British landed gentry at the end of the 18th century, following Elizabeth Bennet and Mr. Darcy.',
        price: 11.99,
        stock: 22,
        category_id: 4,
        isbn: '978-0-14-143951-8',
        published_date: '1813-01-28',
        cover_image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg',
        pages: 432,
        language: 'English',
        format: 'Paperback',
        rating: 4.3,
        views: 875,
        hasVariations: true,
      },
      {
        id: 5,
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        description: 'A fantasy adventure novel about Bilbo Baggins, a hobbit who embarks on an unexpected journey to help a group of dwarves reclaim their homeland.',
        price: 16.99,
        stock: 15,
        category_id: 5,
        isbn: '978-0-547-92822-7',
        published_date: '1937-09-21',
        cover_image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg',
        pages: 366,
        language: 'English',
        format: 'Hardcover',
        rating: 4.6,
        views: 1680,
        hasVariations: true,
      },
      {
        id: 6,
        title: 'Harry Potter and the Philosopher\'s Stone',
        author: 'J.K. Rowling',
        description: 'The first novel in the Harry Potter series, following young Harry as he discovers his magical heritage and attends Hogwarts School of Witchcraft and Wizardry.',
        price: 15.99,
        stock: 40,
        category_id: 5,
        isbn: '978-0-7475-3269-9',
        published_date: '1997-06-26',
        cover_image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg',
        pages: 223,
        language: 'English',
        format: 'Paperback',
        rating: 4.7,
        views: 2150,
        hasVariations: true,
      },
      {
        id: 7,
        title: 'The Catcher in the Rye',
        author: 'J.D. Salinger',
        description: 'A controversial coming-of-age novel narrated by teenager Holden Caulfield, exploring themes of alienation and rebellion.',
        price: 13.50,
        stock: 28,
        category_id: 1,
        isbn: '978-0-316-76948-0',
        published_date: '1951-07-16',
        cover_image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg',
        pages: 277,
        language: 'English',
        format: 'Paperback',
        rating: 3.8,
        views: 720,
        hasVariations: false,
      },
      {
        id: 8,
        title: 'The Da Vinci Code',
        author: 'Dan Brown',
        description: 'A mystery thriller that follows symbologist Robert Langdon as he investigates a murder in the Louvre Museum and uncovers a religious conspiracy.',
        price: 14.50,
        stock: 35,
        category_id: 3,
        isbn: '978-0-307-47427-5',
        published_date: '2003-03-18',
        cover_image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg',
        pages: 454,
        language: 'English',
        format: 'Paperback',
        rating: 4.1,
        views: 1320,
        hasVariations: true,
      },
    ];

    setCategories(mockCategories);
    setBooks(mockBooks);
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
        hasVariations: false,
      };
      
      setBooks(prevBooks => [...prevBooks, newBook]);
      return newBook;
    } catch (error) {
      console.error('Failed to add book:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateBook = async (id, updates) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedBooks = books.map(book =>
        book.id === id ? { ...book, ...updates } : book
      );
      
      setBooks(updatedBooks);
      return updatedBooks.find(book => book.id === id);
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
      
      setBooks(prevBooks => prevBooks.filter(book => book.id !== id));
    } catch (error) {
      console.error('Failed to delete book:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getBookById = (id) => {
    return books.find(book => book.id === parseInt(id));
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