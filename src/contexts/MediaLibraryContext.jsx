import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const MediaLibraryContext = createContext();

export const useMediaLibrary = () => {
  return useContext(MediaLibraryContext);
};

export const MediaLibraryProvider = ({ children }) => {
  const { user } = useAuth();
  const [mediaFiles, setMediaFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMediaData();
  }, []);

  const loadMediaData = () => {
    // Load from localStorage or initialize with demo data
    const storedMedia = localStorage.getItem('mediaLibrary');
    const storedFolders = localStorage.getItem('mediaFolders');

    if (storedMedia) {
      setMediaFiles(JSON.parse(storedMedia));
    } else {
      // Initialize with demo media files
      const demoMedia = [
        {
          id: 1,
          name: 'hero-banner.jpg',
          originalName: 'hero-banner.jpg',
          url: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg',
          type: 'image/jpeg',
          size: 245760,
          folderId: 1,
          uploadedBy: user?.name || 'Admin',
          uploadedAt: '2024-01-15T10:00:00Z',
          alt: 'Hero banner image',
          caption: 'Main hero banner for homepage',
        },
        {
          id: 2,
          name: 'book-cover-placeholder.jpg',
          originalName: 'book-cover-placeholder.jpg',
          url: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg',
          type: 'image/jpeg',
          size: 189432,
          folderId: 2,
          uploadedBy: user?.name || 'Admin',
          uploadedAt: '2024-01-14T15:30:00Z',
          alt: 'Book cover placeholder',
          caption: 'Default placeholder for book covers',
        },
        {
          id: 3,
          name: 'author-photo.jpg',
          originalName: 'author-photo.jpg',
          url: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
          type: 'image/jpeg',
          size: 156789,
          folderId: 3,
          uploadedBy: user?.name || 'Admin',
          uploadedAt: '2024-01-13T09:15:00Z',
          alt: 'Author photo',
          caption: 'Professional author headshot',
        },
      ];
      setMediaFiles(demoMedia);
      localStorage.setItem('mediaLibrary', JSON.stringify(demoMedia));
    }

    if (storedFolders) {
      setFolders(JSON.parse(storedFolders));
    } else {
      // Initialize with demo folders
      const demoFolders = [
        { id: 1, name: 'Banners', parentId: null, createdAt: '2024-01-01T00:00:00Z' },
        { id: 2, name: 'Book Covers', parentId: null, createdAt: '2024-01-01T00:00:00Z' },
        { id: 3, name: 'Authors', parentId: null, createdAt: '2024-01-01T00:00:00Z' },
        { id: 4, name: 'Blog Images', parentId: null, createdAt: '2024-01-01T00:00:00Z' },
      ];
      setFolders(demoFolders);
      localStorage.setItem('mediaFolders', JSON.stringify(demoFolders));
    }
  };

  const uploadFile = async (file, folderId = null, metadata = {}) => {
    setLoading(true);
    try {
      // In a real app, this would upload to a server/cloud storage
      // For demo, we'll create a mock URL
      const mockUrl = URL.createObjectURL(file);
      
      const newFile = {
        id: Date.now() + Math.random(),
        name: file.name,
        originalName: file.name,
        url: mockUrl,
        type: file.type,
        size: file.size,
        folderId,
        uploadedBy: user?.name || 'Admin',
        uploadedAt: new Date().toISOString(),
        alt: metadata.alt || '',
        caption: metadata.caption || '',
      };

      setMediaFiles(prev => {
        const updated = [newFile, ...prev];
        localStorage.setItem('mediaLibrary', JSON.stringify(updated));
        return updated;
      });

      return newFile;
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (fileId) => {
    setMediaFiles(prev => {
      const updated = prev.filter(file => file.id !== fileId);
      localStorage.setItem('mediaLibrary', JSON.stringify(updated));
      return updated;
    });
  };

  const updateFile = async (fileId, updates) => {
    setMediaFiles(prev => {
      const updated = prev.map(file => 
        file.id === fileId ? { ...file, ...updates } : file
      );
      localStorage.setItem('mediaLibrary', JSON.stringify(updated));
      return updated;
    });
  };

  const createFolder = async (name, parentId = null) => {
    const newFolder = {
      id: Date.now() + Math.random(),
      name,
      parentId,
      createdAt: new Date().toISOString(),
    };

    setFolders(prev => {
      const updated = [...prev, newFolder];
      localStorage.setItem('mediaFolders', JSON.stringify(updated));
      return updated;
    });

    return newFolder;
  };

  const deleteFolder = async (folderId) => {
    // Move files in this folder to root
    setMediaFiles(prev => {
      const updated = prev.map(file => 
        file.folderId === folderId ? { ...file, folderId: null } : file
      );
      localStorage.setItem('mediaLibrary', JSON.stringify(updated));
      return updated;
    });

    setFolders(prev => {
      const updated = prev.filter(folder => folder.id !== folderId);
      localStorage.setItem('mediaFolders', JSON.stringify(updated));
      return updated;
    });
  };

  const getFilesByFolder = (folderId) => {
    return mediaFiles.filter(file => file.folderId === folderId);
  };

  const searchFiles = (query) => {
    const lowerQuery = query.toLowerCase();
    return mediaFiles.filter(file => 
      file.name.toLowerCase().includes(lowerQuery) ||
      file.alt.toLowerCase().includes(lowerQuery) ||
      file.caption.toLowerCase().includes(lowerQuery)
    );
  };

  const getFileStats = () => {
    const totalFiles = mediaFiles.length;
    const totalSize = mediaFiles.reduce((sum, file) => sum + file.size, 0);
    const imageFiles = mediaFiles.filter(file => file.type.startsWith('image/')).length;
    const videoFiles = mediaFiles.filter(file => file.type.startsWith('video/')).length;
    const documentFiles = mediaFiles.filter(file => 
      file.type.includes('pdf') || 
      file.type.includes('document') || 
      file.type.includes('text')
    ).length;

    return {
      totalFiles,
      totalSize,
      imageFiles,
      videoFiles,
      documentFiles,
    };
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const value = {
    mediaFiles,
    folders,
    loading,
    uploadFile,
    deleteFile,
    updateFile,
    createFolder,
    deleteFolder,
    getFilesByFolder,
    searchFiles,
    getFileStats,
    formatFileSize,
    refreshData: loadMediaData,
  };

  return (
    <MediaLibraryContext.Provider value={value}>
      {children}
    </MediaLibraryContext.Provider>
  );
};