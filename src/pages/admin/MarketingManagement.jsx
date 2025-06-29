import React, { useState } from 'react';
import { useMarketing } from '../../contexts/MarketingContext';
import { PageHeader, Table, ActionButtons, Modal, FormField, StatCard } from '../../components/admin';
import {
  Megaphone,
  Tag,
  Image,
  Mail,
  TrendingUp,
  Users,
  Eye,
  MousePointer,
  Plus,
  Calendar,
  DollarSign,
  Target,
  BarChart3,
} from 'lucide-react';
import { motion } from 'framer-motion';

const MarketingManagement = () => {
  const {
    campaigns,
    discounts,
    banners,
    loading,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    createDiscount,
    updateDiscount,
    deleteDiscount,
    createBanner,
    updateBanner,
    deleteBanner,
    sendPromotionalEmail,
  } = useMarketing();

  const [activeTab, setActiveTab] = useState('campaigns');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({});

  const tabs = [
    { id: 'campaigns', label: 'Campaigns', icon: Megaphone },
    { id: 'discounts', label: 'Discounts', icon: Tag },
    { id: 'banners', label: 'Banners', icon: Image },
    { id: 'email', label: 'Email Marketing', icon: Mail },
  ];

  const handleCreateNew = () => {
    setSelectedItem(null);
    setFormData({});
    setModalType(`create-${activeTab.slice(0, -1)}`); // Remove 's' from plural
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData(item);
    setModalType(`edit-${activeTab.slice(0, -1)}`);
    setIsModalOpen(true);
  };

  const handleDelete = async (item) => {
    if (window.confirm(`Are you sure you want to delete this ${activeTab.slice(0, -1)}?`)) {
      try {
        if (activeTab === 'campaigns') {
          await deleteCampaign(item.id);
        } else if (activeTab === 'discounts') {
          await deleteDiscount(item.id);
        } else if (activeTab === 'banners') {
          await deleteBanner(item.id);
        }
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      if (modalType.includes('campaign')) {
        if (selectedItem) {
          await updateCampaign(selectedItem.id, formData);
        } else {
          await createCampaign(formData);
        }
      } else if (modalType.includes('discount')) {
        if (selectedItem) {
          await updateDiscount(selectedItem.id, formData);
        } else {
          await createDiscount(formData);
        }
      } else if (modalType.includes('banner')) {
        if (selectedItem) {
          await updateBanner(selectedItem.id, formData);
        } else {
          await createBanner(formData);
        }
      } else if (modalType === 'send-email') {
        await sendPromotionalEmail(formData);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Submit failed:', error);
    }
  };

  const getMarketingStats = () => {
    const totalCampaigns = campaigns.length;
    const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
    const totalDiscounts = discounts.length;
    const activeDiscounts = discounts.filter(d => d.status === 'active').length;
    const totalImpressions = campaigns.reduce((sum, c) => sum + c.impressions, 0);
    const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0);
    const avgClickRate = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : 0;

    return {
      totalCampaigns,
      activeCampaigns,
      totalDiscounts,
      activeDiscounts,
      totalImpressions,
      totalClicks,
      avgClickRate,
    };
  };

  const stats = getMarketingStats();

  const campaignColumns = [
    { id: 'name', label: 'Campaign Name', sortable: true },
    { id: 'type', label: 'Type', sortable: true },
    { id: 'status', label: 'Status', sortable: true },
    { id: 'budget', label: 'Budget', sortable: true },
    { id: 'spent', label: 'Spent', sortable: true },
    { id: 'impressions', label: 'Impressions', sortable: true },
    { id: 'clicks', label: 'Clicks', sortable: true },
    { id: 'actions', label: 'Actions', sortable: false },
  ];

  const discountColumns = [
    { id: 'code', label: 'Code', sortable: true },
    { id: 'type', label: 'Type', sortable: true },
    { id: 'value', label: 'Value', sortable: true },
    { id: 'usageCount', label: 'Used', sortable: true },
    { id: 'usageLimit', label: 'Limit', sortable: true },
    { id: 'status', label: 'Status', sortable: true },
    { id: 'endDate', label: 'Expires', sortable: true },
    { id: 'actions', label: 'Actions', sortable: false },
  ];

  const bannerColumns = [
    { id: 'title', label: 'Title', sortable: true },
    { id: 'position', label: 'Position', sortable: true },
    { id: 'status', label: 'Status', sortable: true },
    { id: 'priority', label: 'Priority', sortable: true },
    { id: 'startDate', label: 'Start Date', sortable: true },
    { id: 'endDate', label: 'End Date', sortable: true },
    { id: 'actions', label: 'Actions', sortable: false },
  ];

  const renderCampaignRow = (campaign) => (
    <tr key={campaign.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
        {campaign.name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
        <span className="capitalize">{campaign.type}</span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          campaign.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
          campaign.status === 'scheduled' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
        }`}>
          {campaign.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
        ${campaign.budget.toLocaleString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
        ${campaign.spent.toLocaleString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
        {campaign.impressions.toLocaleString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
        {campaign.clicks.toLocaleString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <ActionButtons
          onEdit={() => handleEdit(campaign)}
          onDelete={() => handleDelete(campaign)}
        />
      </td>
    </tr>
  );

  const renderDiscountRow = (discount) => (
    <tr key={discount.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
        {discount.code}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
        <span className="capitalize">{discount.type.replace('_', ' ')}</span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
        {discount.type === 'percentage' ? `${discount.value}%` : 
         discount.type === 'fixed' ? `$${discount.value}` : 'Free Shipping'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
        {discount.usageCount}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
        {discount.usageLimit}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          discount.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
        }`}>
          {discount.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
        {new Date(discount.endDate).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <ActionButtons
          onEdit={() => handleEdit(discount)}
          onDelete={() => handleDelete(discount)}
        />
      </td>
    </tr>
  );

  const renderBannerRow = (banner) => (
    <tr key={banner.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
        {banner.title}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
        <span className="capitalize">{banner.position}</span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          banner.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
        }`}>
          {banner.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
        {banner.priority}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
        {new Date(banner.startDate).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
        {new Date(banner.endDate).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <ActionButtons
          onEdit={() => handleEdit(banner)}
          onDelete={() => handleDelete(banner)}
        />
      </td>
    </tr>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Marketing Management"
        onAddNew={handleCreateNew}
        addNewLabel={`Add ${activeTab.slice(0, -1)}`}
        hideAddButton={activeTab === 'email'}
      />

      {/* Marketing Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Megaphone className="h-6 w-6" />}
          iconBgColor="bg-purple-100"
          iconColor="text-purple-600"
          title="Active Campaigns"
          value={`${stats.activeCampaigns}/${stats.totalCampaigns}`}
        />
        <StatCard
          icon={<Tag className="h-6 w-6" />}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
          title="Active Discounts"
          value={`${stats.activeDiscounts}/${stats.totalDiscounts}`}
        />
        <StatCard
          icon={<Eye className="h-6 w-6" />}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
          title="Total Impressions"
          value={stats.totalImpressions.toLocaleString()}
        />
        <StatCard
          icon={<MousePointer className="h-6 w-6" />}
          iconBgColor="bg-amber-100"
          iconColor="text-amber-600"
          title="Click Rate"
          value={`${stats.avgClickRate}%`}
        />
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
          {/* Campaigns Tab */}
          {activeTab === 'campaigns' && (
            <Table
              columns={campaignColumns}
              data={campaigns}
              renderRow={renderCampaignRow}
            />
          )}

          {/* Discounts Tab */}
          {activeTab === 'discounts' && (
            <Table
              columns={discountColumns}
              data={discounts}
              renderRow={renderDiscountRow}
            />
          )}

          {/* Banners Tab */}
          {activeTab === 'banners' && (
            <Table
              columns={bannerColumns}
              data={banners}
              renderRow={renderBannerRow}
            />
          )}

          {/* Email Marketing Tab */}
          {activeTab === 'email' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Email Campaigns
                </h3>
                <button
                  onClick={() => {
                    setModalType('send-email');
                    setFormData({});
                    setIsModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  Send Email Campaign
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">
                    Newsletter Subscribers
                  </h4>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    2,847
                  </p>
                  <p className="text-sm text-green-600">+12% this month</p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">
                    Open Rate
                  </h4>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    24.3%
                  </p>
                  <p className="text-sm text-green-600">+2.1% vs last month</p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">
                    Click Rate
                  </h4>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    3.7%
                  </p>
                  <p className="text-sm text-red-600">-0.3% vs last month</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Create/Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${selectedItem ? 'Edit' : 'Create'} ${modalType.split('-')[1] || 'Item'}`}
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
        {/* Campaign Form */}
        {modalType.includes('campaign') && (
          <div className="space-y-4">
            <FormField
              label="Campaign Name"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <FormField
              label="Description"
              type="textarea"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Start Date"
                type="date"
                value={formData.startDate || ''}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
              <FormField
                label="End Date"
                type="date"
                value={formData.endDate || ''}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
              />
            </div>
            <FormField
              label="Budget"
              type="number"
              value={formData.budget || ''}
              onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
              required
            />
          </div>
        )}

        {/* Discount Form */}
        {modalType.includes('discount') && (
          <div className="space-y-4">
            <FormField
              label="Discount Code"
              value={formData.code || ''}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              required
            />
            <FormField
              label="Description"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Type
                </label>
                <select
                  value={formData.type || 'percentage'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                  <option value="free_shipping">Free Shipping</option>
                </select>
              </div>
              <FormField
                label="Value"
                type="number"
                value={formData.value || ''}
                onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                required={formData.type !== 'free_shipping'}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Start Date"
                type="date"
                value={formData.startDate || ''}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
              <FormField
                label="End Date"
                type="date"
                value={formData.endDate || ''}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
              />
            </div>
            <FormField
              label="Usage Limit"
              type="number"
              value={formData.usageLimit || ''}
              onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
              required
            />
          </div>
        )}

        {/* Banner Form */}
        {modalType.includes('banner') && (
          <div className="space-y-4">
            <FormField
              label="Title"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <FormField
              label="Subtitle"
              value={formData.subtitle || ''}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            />
            <FormField
              label="Image URL"
              value={formData.imageUrl || ''}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              required
            />
            <FormField
              label="Link URL"
              value={formData.linkUrl || ''}
              onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Position
                </label>
                <select
                  value={formData.position || 'hero'}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                >
                  <option value="hero">Hero</option>
                  <option value="sidebar">Sidebar</option>
                  <option value="footer">Footer</option>
                </select>
              </div>
              <FormField
                label="Priority"
                type="number"
                value={formData.priority || 1}
                onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Start Date"
                type="date"
                value={formData.startDate || ''}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
              <FormField
                label="End Date"
                type="date"
                value={formData.endDate || ''}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
              />
            </div>
          </div>
        )}

        {/* Email Form */}
        {modalType === 'send-email' && (
          <div className="space-y-4">
            <FormField
              label="Subject"
              value={formData.subject || ''}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              required
            />
            <FormField
              label="Email Content"
              type="textarea"
              value={formData.content || ''}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Target Audience
              </label>
              <select
                value={formData.audience || 'all'}
                onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              >
                <option value="all">All Subscribers</option>
                <option value="new">New Customers</option>
                <option value="returning">Returning Customers</option>
                <option value="vip">VIP Customers</option>
              </select>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MarketingManagement;