import React, { useState, useEffect } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { HiPlus, HiPencil, HiTrash, HiUpload } from 'react-icons/hi';
import api from '../services/api';
import { DataTable } from '../components/DataTable';
import Modal from '../components/Modal';
import { useToast } from '../hooks/useToast';

interface Supplier {
  id: number;
  name: string;
  logo_url?: string;
  contact_person: string;
  email: string;
  phone: string;
  address?: string;
}

const Suppliers: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    logo_url: '',
    contact_person: '',
    email: '',
    phone: '',
    address: ''
  });

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/suppliers');
      setSuppliers(response.data);
    } catch (error) {
      addToast('Failed to fetch suppliers', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/suppliers/${editId}`, formData);
        addToast('Supplier updated successfully', 'success');
      } else {
        await api.post('/suppliers', formData);
        addToast('Supplier added successfully', 'success');
      }
      setIsModalOpen(false);
      setEditId(null);
      fetchSuppliers();
      setFormData({ name: '', logo_url: '', contact_person: '', email: '', phone: '', address: '' });
    } catch (err) {
      addToast(editId ? 'Failed to update supplier' : 'Failed to add supplier', 'error');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadFormData = new FormData();
    uploadFormData.append('image', file);

    setIsUploading(true);
    try {
      const { data } = await api.post('/upload', uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData({ ...formData, logo_url: data.url });
      addToast('Image uploaded successfully', 'success');
    } catch (err) {
      addToast('Failed to upload image', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = (supplier: Supplier) => {
    setEditId(supplier.id);
    setFormData({
      name: supplier.name,
      logo_url: supplier.logo_url || '',
      contact_person: supplier.contact_person || '',
      email: supplier.email || '',
      phone: supplier.phone || '',
      address: supplier.address || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Delete this supplier?')) {
      try {
        await api.delete(`/suppliers/${id}`);
        addToast('Supplier removed', 'success');
        fetchSuppliers();
      } catch (err) {
        addToast('Failed to delete supplier', 'error');
      }
    }
  };

  const getLogoUrl = (url: string | undefined, name: string) => {
    if (!url) return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`;
    
    // Check if it's a relative path (uploaded file)
    if (url.startsWith('/uploads')) {
      const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
      return `${baseUrl}${url}`;
    }
    
    return url;
  };

  const columns: ColumnDef<Supplier, unknown>[] = [
    { 
      id: 'logo',
      header: 'Logo',
      cell: ({ row }) => (
        <img 
          src={getLogoUrl(row.original.logo_url, row.original.name)} 
          alt={row.original.name} 
          className="h-10 w-10 rounded-full object-cover border border-gray-200"
        />
      )
    },
    { accessorKey: 'name', header: 'Supplier Name' },
    { accessorKey: 'contact_person', header: 'Contact' },
    { accessorKey: 'email', header: 'Email' },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <button 
            onClick={() => handleEdit(row.original)}
            className="text-indigo-600 hover:text-indigo-900 transition-colors"
          >
            <HiPencil className="h-5 w-5" />
          </button>
          <button 
            onClick={() => handleDelete(row.original.id)}
            className="text-red-600 hover:text-red-900 transition-colors"
          >
            <HiTrash className="h-5 w-5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Suppliers</h1>
        <button 
          onClick={() => {
            setEditId(null);
            setFormData({ name: '', logo_url: '', contact_person: '', email: '', phone: '', address: '' });
            setIsModalOpen(true);
          }}
          className="flex items-center space-x-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-all active:scale-95"
        >
          <HiPlus className="h-5 w-5" />
          <span>New Supplier</span>
        </button>
      </div>

      <DataTable columns={columns} data={suppliers} loading={loading} />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editId ? "Edit Supplier" : "Add New Supplier"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center space-y-4 mb-4 p-4 bg-gray-50 rounded-lg">
            <img 
              src={getLogoUrl(formData.logo_url, formData.name || 'S')} 
              alt="Preview" 
              className="h-20 w-20 rounded-full object-cover border-4 border-white shadow-md"
            />
            
            <div className="w-full grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Option 1: Image URL</label>
                <input
                  type="text"
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  placeholder="https://example.com/logo.png"
                  value={formData.logo_url}
                  onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                />
              </div>
              
              <div className="relative">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Option 2: Upload File</label>
                <div className="mt-1 flex items-center justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                  <div className="space-y-1 text-center">
                    <HiUpload className="mx-auto h-10 w-10 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500">
                        <span>{isUploading ? 'Uploading...' : 'Upload a file'}</span>
                        <input 
                          type="file" 
                          className="sr-only" 
                          accept="image/*" 
                          onChange={handleFileUpload} 
                          disabled={isUploading}
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Supplier Name</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Person</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                value={formData.contact_person}
                onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {editId ? "Update Supplier" : "Save Supplier"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Suppliers;
