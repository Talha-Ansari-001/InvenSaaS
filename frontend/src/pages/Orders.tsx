import React, { useState, useEffect } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { HiPlus } from 'react-icons/hi';
import api from '../services/api';
import { DataTable } from '../components/DataTable';
import Modal from '../components/Modal';
import { useToast } from '../hooks/useToast';

interface Order {
  id: number;
  customer_name: string;
  total_amount: number;
  status: string;
  created_at: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    customer_name: '',
    product_id: '',
    quantity: '1'
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [orderRes, prodRes] = await Promise.all([
        api.get('/orders'),
        api.get('/products')
      ]);
      setOrders(orderRes.data);
      setProducts(prodRes.data);
    } catch (error) {
      addToast('Failed to fetch orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedProduct = products.find(p => p.id === parseInt(formData.product_id));
      if (!selectedProduct) return;

      const orderData = {
        customer_name: formData.customer_name,
        order_items: [
          {
            product_id: selectedProduct.id,
            quantity: parseInt(formData.quantity),
            price: selectedProduct.price
          }
        ]
      };

      await api.post('/orders', orderData);
      addToast('Order created successfully', 'success');
      setIsModalOpen(false);
      fetchData();
      setFormData({ customer_name: '', product_id: '', quantity: '1' });
    } catch (err) {
      addToast('Failed to create order', 'error');
    }
  };

  const columns: ColumnDef<Order, unknown>[] = [
    { accessorKey: 'id', header: 'Order ID' },
    { accessorKey: 'customer_name', header: 'Customer' },
    { 
      accessorKey: 'total_amount', 
      header: 'Total',
      cell: ({ getValue }) => `$${Number(getValue()).toFixed(2)}`
    },
    { 
      accessorKey: 'status', 
      header: 'Status',
      cell: ({ getValue }) => (
        <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
          {String(getValue())}
        </span>
      )
    },
    { 
      accessorKey: 'created_at', 
      header: 'Date',
      cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString()
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Sales Orders</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-all active:scale-95"
        >
          <HiPlus className="h-5 w-5" />
          <span>New Order</span>
        </button>
      </div>

      <DataTable columns={columns} data={orders} loading={loading} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Order">
        <form onSubmit={handleCreateOrder} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Customer Name</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              value={formData.customer_name}
              onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
            />
          </div>
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
                {products.map(p => <option key={p.id} value={p.id}>{p.name} (${p.price})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <input
                type="number"
                min="1"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              />
            </div>
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
              Place Order
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Orders;
