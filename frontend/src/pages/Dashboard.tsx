import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend
} from 'recharts';
import { HiOutlineCube, HiOutlineTruck, HiOutlineUsers, HiOutlineTrendingUp } from 'react-icons/hi';
import api from '../services/api';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockItems: 0,
    recentOrders: 0,
    totalUsers: 0
  });
  const [movements, setMovements] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, moveRes] = await Promise.all([
          api.get('/reports/dashboard'),
          api.get('/reports/monthly-movements')
        ]);
        setStats(statsRes.data);
        setMovements(moveRes.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    { name: 'Total Products', value: stats.totalProducts, icon: HiOutlineCube, color: 'bg-blue-500' },
    { name: 'Low Stock Items', value: stats.lowStockItems, icon: HiOutlineTrendingUp, color: 'bg-red-500' },
    { name: 'Recent Orders', value: stats.recentOrders, icon: HiOutlineTruck, color: 'bg-green-500' },
    { name: 'Total Users', value: stats.totalUsers, icon: HiOutlineUsers, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <div className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.name} className="flex items-center rounded-xl bg-white p-6 shadow-sm">
            <div className={`rounded-lg ${card.color} p-3 text-white`}>
              <card.icon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{card.name}</p>
              <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-800">Stock Movements</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={movements}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="stockIn" name="Stock In" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="stockOut" name="Stock Out" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-800">Activity Trends</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={movements}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="stockIn" name="Inflow" stroke="#4f46e5" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="stockOut" name="Outflow" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
