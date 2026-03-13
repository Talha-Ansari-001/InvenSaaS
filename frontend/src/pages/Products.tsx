import React, { useState, useEffect } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { HiPlus, HiPencil, HiTrash } from 'react-icons/hi';
import api from '../services/api';
import { DataTable } from '../components/DataTable';
import Modal from '../components/Modal';
import { useToast } from '../hooks/useToast';

interface Product {
  id: number;
  sku: string;
  name: string;
  category_name?: string;
  price: number;
  total_stock?: number;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToast } = useToast();
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: '',
    category_id: '1',
    description: ''
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products', error);
      // Mock data if API fails
      setProducts([
        { id: 1, sku: 'PROD-001', name: 'Wireless Mouse', price: 25.99 },
        { id: 2, sku: 'PROD-002', name: 'Mechanical Keyboard', price: 89.99 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/products', formData);
      addToast('Product added successfully', 'success');
      setIsModalOpen(false);
      fetchProducts();
      setFormData({ name: '', sku: '', price: '', category_id: '1', description: '' });
    } catch (err) {
      addToast('Failed to add product', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        addToast('Product deleted', 'success');
        fetchProducts();
      } catch (err) {
        addToast('Failed to delete product', 'error');
      }
    }
  };

  const columns: ColumnDef<Product, unknown>[] = [
    { accessorKey: 'sku', header: 'SKU' },
    { accessorKey: 'name', header: 'Product Name' },
    { 
      accessorKey: 'price', 
      header: 'Price',
      cell: ({ getValue }) => `$${Number(getValue()).toFixed(2)}`
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <button className="text-indigo-600 hover:text-indigo-900 transition-colors">
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
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-all active:scale-95"
        >
          <HiPlus className="h-5 w-5" />
          <span>Add Product</span>
        </button>
      </div>

      <DataTable columns={columns} data={products} loading={loading} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Product">
        <form onSubmit={handleAddProduct} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Product Name</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">SKU</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Price ($)</label>
              <input
                type="number"
                step="0.01"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Save Product
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Products;
