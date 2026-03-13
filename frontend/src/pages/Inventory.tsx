import React, { useState, useEffect } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { HiPlus } from 'react-icons/hi2';
import api from '../services/api';
import { DataTable } from '../components/DataTable';
import Modal from '../components/Modal';
import { useToast } from '../hooks/useToast';

interface InventoryItem {
  id: number;
  product_id: number;
  warehouse_id: number;
  sku: string;
  product_name: string;
  warehouse_name: string;
  quantity: number;
  updated_at: string;
}

interface Product {
  id: number;
  name: string;
  sku: string;
}

interface Warehouse {
  id: number;
  name: string;
}

const Inventory: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    product_id: '',
    warehouse_id: '',
    quantity: '',
    type: 'ADJUSTMENT',
    reason: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [invRes, prodRes, whRes] = await Promise.all([
        api.get('/inventory'),
        api.get('/products'),
        api.get('/warehouses')
      ]);
      setItems(invRes.data);
      setProducts(prodRes.data);
      setWarehouses(whRes.data);
    } catch (error) {
      console.error('Failed to fetch data', error);
      addToast('Failed to load inventory data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/inventory/adjust', {
        ...formData,
        product_id: parseInt(formData.product_id),
        warehouse_id: parseInt(formData.warehouse_id),
        quantity: parseInt(formData.quantity)
      });
      addToast('Stock adjusted successfully', 'success');
      setIsModalOpen(false);
      fetchData();
      setFormData({ product_id: '', warehouse_id: '', quantity: '', type: 'ADJUSTMENT', reason: '' });
    } catch (err) {
      addToast('Failed to adjust stock', 'error');
    }
  };

  const columns: ColumnDef<InventoryItem, unknown>[] = [
    { accessorKey: 'sku', header: 'SKU' },
    { accessorKey: 'product_name', header: 'Product' },
    { accessorKey: 'warehouse_name', header: 'Warehouse' },
    { 
      accessorKey: 'quantity', 
      header: 'Quantity',
      cell: ({ getValue }) => (
        <span className={`font-semibold ${
          Number(getValue()) < 10 ? 'text-red-600' : 'text-gray-900'
        }`}>
          {String(getValue())}
        </span>
      )
    },
    { 
      accessorKey: 'updated_at', 
      header: 'Last Updated',
      cell: ({ getValue }) => new Date(getValue() as string).toLocaleString()
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Inventory Levels</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-all active:scale-95"
        >
          <HiPlus className="h-5 w-5" />
          <span>Stock Adjustment</span>
        </button>
      </div>

      <DataTable columns={columns} data={items} loading={loading} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Stock Adjustment">
        <form onSubmit={handleAdjust} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Product</label>
              <select
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                value={formData.product_id}
                onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
              >
                <option value="">Select Product</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Warehouse</label>
              <select
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                value={formData.warehouse_id}
                onChange={(e) => setFormData({ ...formData, warehouse_id: e.target.value })}
              >
                <option value="">Select Warehouse</option>
                {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Adjustment Type</label>
              <select
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="ADJUSTMENT">Manual Adjustment (+/-)</option>
                <option value="IN">Stock In (+)</option>
                <option value="OUT">Stock Out (-)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <input
                type="number"
                required
                placeholder={formData.type === 'ADJUSTMENT' ? 'e.g. -5 or 10' : 'e.g. 10'}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Reason</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              placeholder="e.g. Damage, Restock, Return"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
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
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Apply Adjustment
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Inventory;
