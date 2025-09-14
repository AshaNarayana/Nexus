
import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { Investment } from '../types';
import { USERS } from '../constants';

const SharedInvestmentsPage: React.FC = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInvestments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getAllInvestments();
      setInvestments(data);
    } catch (error) {
      console.error("Failed to fetch shared investments:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvestments();
  }, [fetchInvestments]);
  
  const getUserById = (id: number) => USERS.find(u => u.id === id)?.username || 'Unknown';

  if (loading) {
    return <div className="text-center p-10">Loading shared investments...</div>;
  }

  const totalSharedInvestment = investments.reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Shared Investments</h1>
        <div>
            <span className="text-lg font-semibold text-slate-500 dark:text-slate-400">Total: </span>
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">€{totalSharedInvestment.toFixed(2)}</span>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-md">
        {investments.length > 0 ? (
          <ul className="divide-y divide-slate-200 dark:divide-slate-700">
            {investments.map((investment) => (
              <li key={investment.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                     <span className="text-xl font-bold text-emerald-500">€{investment.amount.toFixed(2)}</span>
                     <div>
                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{investment.category}</span>
                        <span className={`ml-3 px-2 py-0.5 text-xs rounded-full ${investment.user_id === 1 ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'}`}>
                            {getUserById(investment.user_id)}
                        </span>
                     </div>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 mt-1">{investment.notes}</p>
                   <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{new Date(investment.date).toLocaleDateString()}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-slate-500 dark:text-slate-400 py-8">No investments have been recorded yet.</p>
        )}
      </div>
    </div>
  );
};

export default SharedInvestmentsPage;
