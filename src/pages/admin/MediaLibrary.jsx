import React, { useState } from 'react';
import { useMediaLibrary } from '../../contexts/MediaLibraryContext';
import { PageHeader, Modal, FormField, StatCard } from '../../components/admin';
import {
  Upload,
  Search,
  Filter,
  Grid,
  List,
  Folder,
  FolderPlus,
  Image,
  Video,
  FileText,
  Download,
  Trash2,
  Edit,
  Eye,
  Copy,
  MoreVertical,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MediaLibrary = () => {
  const {
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
  } = useMediaLibrary();

  const [viewMode, setViewMode] = useState('grid');
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFiles, setSelectedFiles] = useState(new Set());
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadData, setUploadData] = useState({ files: [], folderId: null });
  const [folderData, setFolderData] = useState({ name: '', parentId: null });
  const [fileData, setFileData] = useState({ alt: '', caption: '' });

  const stats = getFileStats();

  const displayedFiles = searchTerm 
    ? searchFiles(searchTerm)
    : selectedFolder 
      ? getFilesByFolder(selectedFolder.id)
      : mediaFiles.filter(file => !file.folderId);

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    setUploadData({ files, folderId: selectedFolder?.id || null });
    setIsUploadModalOpen(true);
  };

  const handleUploadSubmit = async () => {
    try {
      for (const file of uploadData.files) {
        await uploadFile(file, uploadData.folderId, {
          alt: fileData.alt,
          caption: fileData.caption,
        });
      }
      setIsUploadModalOpen(false);
      setUploadData({ files: [], folderId: null });
      setFileData({ alt: '', caption: '' });
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const handleCreateFolder = async () => {
    try {
      await createFolder(folderData.name, folderData.parentId);
      setIsFolderModalOpen(false);
      setFolderData({ name: '', parentId: null });
    } catch (error) {
      console.error('Folder creation failed:', error);
    }
  };

  const handleFileSelect = (fileId) => {
    setSelectedFiles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(fileId)) {
        newSet.delete(fileId);
      } else {
        newSet.add(fileId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedFiles.size === displayedFiles.length) {
      setSelectedFiles(new Set());
    } else {
      setSelectedFiles(new Set(displayedFiles.map(file => file.id)));
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Delete ${selectedFiles.size} selected files?`)) {
      for (const fileId of selectedFiles) {
        await deleteFile(fileId);
      }
      setSelectedFiles(new Set());
    }
  };

  const copyFileUrl = (url) => {
    navigator.clipboard.writeText(url);
    // Show toast notification
  };

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return <Image className="h-5 w-5" />;
    if (type.startsWith('video/')) return <Video className="h-5 w-5" />;
    return <FileText className="h-5 w-5" />;
  };

  const getFileTypeColor = (type) => {
    if (type.startsWith('image/')) return 'text-green-600';
    if (type.startsWith('video/')) return 'text-blue-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <PageHeader title="Media Library" hideAddButton />
        <div className="flex gap-3">
          <button
            onClick={() => setIsFolderModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <FolderPlus className="h-4 w-4" />
            New Folder
          </button>
          <label className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors cursor-pointer">
            <Upload className="h-4 w-4" />
            Upload Files
            <input
              type="file"
              multiple
              accept="image/*,video/*,.pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          icon={<FileText className="h-6 w-6" />}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
          title="Total Files"
          value={stats.totalFiles}
        />
        <StatCard
          icon={<Image className="h-6 w-6" />}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
          title="Images"
          value={stats.imageFiles}
        />
        <StatCard
          icon={<Video className="h-6 w-6" />}
          iconBgColor="bg-purple-100"
          iconColor="text-purple-600"
          title="Videos"
          value={stats.videoFiles}
        />
        <StatCard
          icon={<FileText className="h-6 w-6" />}
          iconBgColor="bg-gray-100"
          iconColor="text-gray-600"
          title="Storage Used"
          value={formatFileSize(stats.totalSize)}
        />
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          {/* Search and Filters */}
          <div className="flex gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search files..."
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              />
            </div>
          </div>

          {/* View Controls */}
          <div className="flex items-center gap-4">
            {selectedFiles.size > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedFiles.size} selected
                </span>
                <button
                  onClick={handleBulkDelete}
                  className="text-red-600 hover:text-red-700 p-1"
                  title="Delete Selected"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
            <div className="flex border border-gray-300 dark:border-gray-600 rounded-md">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-amber-600 text-white' : 'text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-amber-600 text-white' : 'text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="mt-4 flex items-center gap-2 text-sm">
          <button
            onClick={() => setSelectedFolder(null)}
            className="text-amber-600 hover:text-amber-700"
          >
            Media Library
          </button>
          {selectedFolder && (
            <>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600 dark:text-gray-400">{selectedFolder.name}</span>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        {/* Folders */}
        {!selectedFolder && folders.length > 0 && (
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Folders</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {folders.map((folder) => (
                <motion.div
                  key={folder.id}
                  whileHover={{ scale: 1.02 }}
                  className="flex flex-col items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer group"
                  onClick={() => setSelectedFolder(folder)}
                >
                  <Folder className="h-12 w-12 text-blue-500 mb-2" />
                  <span className="text-sm font-medium text-gray-800 dark:text-white text-center">
                    {folder.name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {getFilesByFolder(folder.id).length} files
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('Delete this folder?')) {
                        deleteFolder(folder.id);
                      }
                    }}
                    className="opacity-0 group-hover:opacity-100 mt-2 text-red-600 hover:text-red-700 transition-opacity"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Files */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Files {selectedFolder && `in ${selectedFolder.name}`}
            </h3>
            {displayedFiles.length > 0 && (
              <button
                onClick={handleSelectAll}
                className="text-sm text-amber-600 hover:text-amber-700"
              >
                {selectedFiles.size === displayedFiles.length ? 'Deselect All' : 'Select All'}
              </button>
            )}
          </div>

          {displayedFiles.length === 0 ? (
            <div className="text-center py-12">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
                No files found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchTerm ? 'Try adjusting your search terms.' : 'Upload some files to get started.'}
              </p>
              {!searchTerm && (
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors cursor-pointer">
                  <Upload className="h-4 w-4" />
                  Upload Files
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*,.pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {displayedFiles.map((file) => (
                <motion.div
                  key={file.id}
                  whileHover={{ scale: 1.02 }}
                  className={`relative group border-2 rounded-lg overflow-hidden cursor-pointer transition-colors ${
                    selectedFiles.has(file.id)
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={() => handleFileSelect(file.id)}
                >
                  {/* Selection Checkbox */}
                  <div className="absolute top-2 left-2 z-10">
                    <input
                      type="checkbox"
                      checked={selectedFiles.has(file.id)}
                      onChange={() => handleFileSelect(file.id)}
                      className="w-4 h-4 text-amber-600 bg-white border-gray-300 rounded focus:ring-amber-500"
                    />
                  </div>

                  {/* File Preview */}
                  <div className="aspect-square bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    {file.type.startsWith('image/') ? (
                      <img
                        src={file.url}
                        alt={file.alt || file.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className={`${getFileTypeColor(file.type)}`}>
                        {getFileIcon(file.type)}
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  <div className="p-3">
                    <h4 className="font-medium text-sm text-gray-800 dark:text-white truncate">
                      {file.name}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(file.size)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(file);
                          setFileData({ alt: file.alt, caption: file.caption });
                          setIsFileModalOpen(true);
                        }}
                        className="p-1 bg-white dark:bg-gray-800 rounded shadow-md hover:bg-gray-50 dark:hover:bg-gray-700"
                        title="Edit"
                      >
                        <Edit className="h-3 w-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyFileUrl(file.url);
                        }}
                        className="p-1 bg-white dark:bg-gray-800 rounded shadow-md hover:bg-gray-50 dark:hover:bg-gray-700"
                        title="Copy URL"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm('Delete this file?')) {
                            deleteFile(file.id);
                          }
                        }}
                        className="p-1 bg-white dark:bg-gray-800 rounded shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {displayedFiles.map((file) => (
                <div
                  key={file.id}
                  className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedFiles.has(file.id)
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={() => handleFileSelect(file.id)}
                >
                  <input
                    type="checkbox"
                    checked={selectedFiles.has(file.id)}
                    onChange={() => handleFileSelect(file.id)}
                    className="w-4 h-4 text-amber-600 bg-white border-gray-300 rounded focus:ring-amber-500"
                  />
                  
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                    {file.type.startsWith('image/') ? (
                      <img
                        src={file.url}
                        alt={file.alt || file.name}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <div className={`${getFileTypeColor(file.type)}`}>
                        {getFileIcon(file.type)}
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 dark:text-white">{file.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatFileSize(file.size)} • Uploaded {new Date(file.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(file);
                        setFileData({ alt: file.alt, caption: file.caption });
                        setIsFileModalOpen(true);
                      }}
                      className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyFileUrl(file.url);
                      }}
                      className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                      title="Copy URL"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('Delete this file?')) {
                          deleteFile(file.id);
                        }
                      }}
                      className="p-2 text-red-600 hover:text-red-700"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Files"
        footer={
          <div className="flex justify-end space-x-3">
            <button
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setIsUploadModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 disabled:opacity-50"
              onClick={handleUploadSubmit}
              disabled={loading}
            >
              {loading ? 'Uploading...' : 'Upload Files'}
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-800 dark:text-white mb-2">
              Files to Upload ({uploadData.files.length})
            </h4>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {uploadData.files.map((file, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  {getFileIcon(file.type)}
                  <span className="flex-1 truncate">{file.name}</span>
                  <span className="text-gray-500">{formatFileSize(file.size)}</span>
                </div>
              ))}
            </div>
          </div>
          
          <FormField
            label="Alt Text (for images)"
            value={fileData.alt}
            onChange={(e) => setFileData({ ...fileData, alt: e.target.value })}
            placeholder="Describe the image for accessibility"
          />
          
          <FormField
            label="Caption"
            value={fileData.caption}
            onChange={(e) => setFileData({ ...fileData, caption: e.target.value })}
            placeholder="Optional caption for the file"
          />
        </div>
      </Modal>

      {/* Create Folder Modal */}
      <Modal
        isOpen={isFolderModalOpen}
        onClose={() => setIsFolderModalOpen(false)}
        title="Create New Folder"
        footer={
          <div className="flex justify-end space-x-3">
            <button
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setIsFolderModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={handleCreateFolder}
            >
              Create Folder
            </button>
          </div>
        }
      >
        <FormField
          label="Folder Name"
          value={folderData.name}
          onChange={(e) => setFolderData({ ...folderData, name: e.target.value })}
          placeholder="Enter folder name"
          required
        />
      </Modal>

      {/* Edit File Modal */}
      <Modal
        isOpen={isFileModalOpen}
        onClose={() => setIsFileModalOpen(false)}
        title="Edit File Details"
        footer={
          <div className="flex justify-end space-x-3">
            <button
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setIsFileModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
              onClick={async () => {
                await updateFile(selectedFile.id, fileData);
                setIsFileModalOpen(false);
              }}
            >
              Save Changes
            </button>
          </div>
        }
      >
        {selectedFile && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                {selectedFile.type.startsWith('image/') ? (
                  <img
                    src={selectedFile.url}
                    alt={selectedFile.alt || selectedFile.name}
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <div className={`${getFileTypeColor(selectedFile.type)}`}>
                    {getFileIcon(selectedFile.type)}
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-medium text-gray-800 dark:text-white">{selectedFile.name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            
            <FormField
              label="Alt Text"
              value={fileData.alt}
              onChange={(e) => setFileData({ ...fileData, alt: e.target.value })}
              placeholder="Describe the file for accessibility"
            />
            
            <FormField
              label="Caption"
              value={fileData.caption}
              onChange={(e) => setFileData({ ...fileData, caption: e.target.value })}
              placeholder="Optional caption for the file"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                File URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={selectedFile.url}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                />
                <button
                  onClick={() => copyFileUrl(selectedFile.url)}
                  className="px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MediaLibrary;