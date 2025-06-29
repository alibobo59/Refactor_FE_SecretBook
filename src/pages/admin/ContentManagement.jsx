import React, { useState } from 'react';
import { useContent } from '../../contexts/ContentContext';
import { PageHeader, Table, ActionButtons, Modal, FormField, StatCard } from '../../components/admin';
import {
  FileText,
  HelpCircle,
  Edit,
  Eye,
  Trash2,
  Plus,
  Globe,
  Calendar,
  User,
  Tag,
  Search,
  Filter,
  BarChart3,
  ThumbsUp,
  MessageCircle,
  TrendingUp,
} from 'lucide-react';
import { motion } from 'framer-motion';

const ContentManagement = () => {
  const {
    blogPosts,
    faqs,
    loading,
    createBlogPost,
    updateBlogPost,
    deleteBlogPost,
    publishBlogPost,
    unpublishBlogPost,
    createFaq,
    updateFaq,
    deleteFaq,
    getFaqCategories,
  } = useContent();

  const [activeTab, setActiveTab] = useState('blog');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const tabs = [
    { id: 'blog', label: 'Blog Posts', icon: FileText },
    { id: 'faq', label: 'FAQs', icon: HelpCircle },
  ];

  const handleCreateNew = () => {
    setSelectedItem(null);
    setFormData({});
    setModalType(`create-${activeTab}`);
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData(item);
    setModalType(`edit-${activeTab}`);
    setIsModalOpen(true);
  };

  const handleDelete = async (item) => {
    if (window.confirm(`Are you sure you want to delete this ${activeTab === 'blog' ? 'blog post' : 'FAQ'}?`)) {
      try {
        if (activeTab === 'blog') {
          await deleteBlogPost(item.id);
        } else {
          await deleteFaq(item.id);
        }
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      if (modalType.includes('blog')) {
        if (selectedItem) {
          await updateBlogPost(selectedItem.id, formData);
        } else {
          await createBlogPost(formData);
        }
      } else if (modalType.includes('faq')) {
        if (selectedItem) {
          await updateFaq(selectedItem.id, formData);
        } else {
          await createFaq(formData);
        }
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Submit failed:', error);
    }
  };

  const handlePublishToggle = async (post) => {
    try {
      if (post.status === 'published') {
        await unpublishBlogPost(post.id);
      } else {
        await publishBlogPost(post.id);
      }
    } catch (error) {
      console.error('Publish toggle failed:', error);
    }
  };

  const getContentStats = () => {
    const publishedPosts = blogPosts.filter(p => p.status === 'published').length;
    const draftPosts = blogPosts.filter(p => p.status === 'draft').length;
    const publishedFaqs = faqs.filter(f => f.status === 'published').length;
    const totalViews = blogPosts.reduce((sum, post) => sum + post.views, 0);

    return {
      publishedPosts,
      draftPosts,
      publishedFaqs,
      totalViews,
    };
  };

  const stats = getContentStats();

  const blogColumns = [
    { id: 'title', label: 'Title', sortable: true },
    { id: 'author', label: 'Author', sortable: true },
    { id: 'category', label: 'Category', sortable: true },
    { id: 'status', label: 'Status', sortable: true },
    { id: 'views', label: 'Views', sortable: true },
    { id: 'createdAt', label: 'Created', sortable: true },
    { id: 'actions', label: 'Actions', sortable: false },
  ];

  const faqColumns = [
    { id: 'question', label: 'Question', sortable: true },
    { id: 'category', label: 'Category', sortable: true },
    { id: 'status', label: 'Status', sortable: true },
    { id: 'helpful', label: 'Helpful', sortable: true },
    { id: 'order', label: 'Order', sortable: true },
    { id: 'actions', label: 'Actions', sortable: false },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const filteredBlogPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? post.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? faq.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Content Management"
        onAddNew={handleCreateNew}
        addNewLabel={`Add ${activeTab === 'blog' ? 'Blog Post' : 'FAQ'}`}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<FileText className="h-6 w-6" />}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
          title="Published Posts"
          value={stats.publishedPosts}
        />
        <StatCard
          icon={<Edit className="h-6 w-6" />}
          iconBgColor="bg-yellow-100"
          iconColor="text-yellow-600"
          title="Draft Posts"
          value={stats.draftPosts}
        />
        <StatCard
          icon={<HelpCircle className="h-6 w-6" />}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
          title="Published FAQs"
          value={stats.publishedFaqs}
        />
        <StatCard
          icon={<Eye className="h-6 w-6" />}
          iconBgColor="bg-purple-100"
          iconColor="text-purple-600"
          title="Total Views"
          value={stats.totalViews.toLocaleString()}
        />
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Search ${activeTab === 'blog' ? 'posts' : 'FAQs'}...`}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            >
              <option value="">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-amber-500 text-amber-600 dark:text-amber-500'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Blog Posts Tab */}
          {activeTab === 'blog' && (
            <Table
              columns={blogColumns}
              data={filteredBlogPosts}
              renderRow={(post) => (
                <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    <div>
                      <div className="font-medium">{post.title}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {post.excerpt?.substring(0, 60)}...
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {post.author}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                      {post.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {post.views}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(post)}
                        className="text-amber-600 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-300"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handlePublishToggle(post)}
                        className={`${
                          post.status === 'published'
                            ? 'text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300'
                            : 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'
                        }`}
                        title={post.status === 'published' ? 'Unpublish' : 'Publish'}
                      >
                        <Globe className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(post)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            />
          )}

          {/* FAQs Tab */}
          {activeTab === 'faq' && (
            <Table
              columns={faqColumns}
              data={filteredFaqs}
              renderRow={(faq) => (
                <tr key={faq.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    <div>
                      <div className="font-medium">{faq.question}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {faq.answer?.substring(0, 80)}...
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                      {faq.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(faq.status)}`}>
                      {faq.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-green-600">
                        <ThumbsUp className="h-3 w-3" />
                        {faq.helpful}
                      </div>
                      <div className="flex items-center gap-1 text-red-600">
                        <ThumbsUp className="h-3 w-3 rotate-180" />
                        {faq.notHelpful}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {faq.order}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <ActionButtons
                      onEdit={() => handleEdit(faq)}
                      onDelete={() => handleDelete(faq)}
                    />
                  </td>
                </tr>
              )}
            />
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${selectedItem ? 'Edit' : 'Create'} ${activeTab === 'blog' ? 'Blog Post' : 'FAQ'}`}
        footer={
          <div className="flex justify-end space-x-3">
            <button
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
              onClick={handleSubmit}
            >
              {selectedItem ? 'Update' : 'Create'}
            </button>
          </div>
        }
      >
        {/* Blog Post Form */}
        {modalType.includes('blog') && (
          <div className="space-y-4">
            <FormField
              label="Title"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <FormField
              label="Excerpt"
              type="textarea"
              value={formData.excerpt || ''}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              required
            />
            <FormField
              label="Content"
              type="textarea"
              value={formData.content || ''}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
              inputProps={{ rows: 8 }}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Category"
                value={formData.category || ''}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={formData.status || 'draft'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>
            <FormField
              label="Tags (comma-separated)"
              value={formData.tags?.join(', ') || ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
              })}
            />
            <FormField
              label="Featured Image URL"
              value={formData.featuredImage || ''}
              onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
            />
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-800 dark:text-white mb-3">SEO Settings</h4>
              <div className="space-y-3">
                <FormField
                  label="SEO Title"
                  value={formData.seoTitle || ''}
                  onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                />
                <FormField
                  label="SEO Description"
                  type="textarea"
                  value={formData.seoDescription || ''}
                  onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                />
                <FormField
                  label="SEO Keywords"
                  value={formData.seoKeywords || ''}
                  onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        {/* FAQ Form */}
        {modalType.includes('faq') && (
          <div className="space-y-4">
            <FormField
              label="Question"
              value={formData.question || ''}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              required
            />
            <FormField
              label="Answer"
              type="textarea"
              value={formData.answer || ''}
              onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
              required
              inputProps={{ rows: 4 }}
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  value={formData.category || ''}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Shipping">Shipping</option>
                  <option value="Returns">Returns</option>
                  <option value="Orders">Orders</option>
                  <option value="Payment">Payment</option>
                  <option value="Account">Account</option>
                  <option value="General">General</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={formData.status || 'published'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>
            <FormField
              label="Display Order"
              type="number"
              value={formData.order || ''}
              onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ContentManagement;