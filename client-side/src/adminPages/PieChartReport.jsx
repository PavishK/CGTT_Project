import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

function PieChartReport({pieData}) {

    const COLORS = ['#4f46e5', '#10b981', '#facc15', '#f97316'];
    
  return (
    <div className="w-full mt-8 bg-white rounded-lg p-4 shadow">
            <h2 className="text-xl font-semibold mb-4">Overview Pie Chart</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
  )
}

export default PieChartReport