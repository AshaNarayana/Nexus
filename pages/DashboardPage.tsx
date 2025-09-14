
import React, { useEffect, useState } from 'react';
import { useUser } from '../hooks/useUser';
import api from '../services/api';
import { Expense, Goal, Reminder, Investment } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF4560'];
const COLORS_INVEST = ['#8E44AD', '#2ECC71', '#F1C40F', '#E67E22', '#3498DB', '#E74C3C'];


const DashboardPage: React.FC = () => {
    const { user } = useUser();
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [investments, setInvestments] = useState<Investment[]>([]);
    const [goals, setGoals] = useState<Goal[]>([]);
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            setLoading(true);
            try {
                const [userExpenses, userInvestments, userGoals, userReminders] = await Promise.all([
                    api.getExpenses(user.id),
                    api.getInvestments(user.id),
                    api.getGoals(user.id),
                    api.getReminders(user.id),
                ]);
                setExpenses(userExpenses);
                setInvestments(userInvestments);
                setGoals(userGoals);
                setReminders(userReminders);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);
    
    const totalSpending = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalInvestments = investments.reduce((sum, investment) => sum + investment.amount, 0);

    const expenseCategoryData = expenses.reduce((acc, expense) => {
        const existingCategory = acc.find(item => item.name === expense.category);
        if (existingCategory) {
            existingCategory.value += expense.amount;
        } else {
            acc.push({ name: expense.category, value: expense.amount });
        }
        return acc;
    }, [] as { name: string; value: number }[]);

    const investmentCategoryData = investments.reduce((acc, investment) => {
        const existingCategory = acc.find(item => item.name === investment.category);
        if (existingCategory) {
            existingCategory.value += investment.amount;
        } else {
            acc.push({ name: investment.category, value: investment.amount });
        }
        return acc;
    }, [] as { name: string; value: number }[]);


    if (loading) {
        return <div className="text-center p-10">Loading dashboard...</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
                    <h2 className="text-lg font-semibold text-slate-500 dark:text-slate-400 mb-2">Total Spending</h2>
                    <p className="text-4xl font-bold text-slate-800 dark:text-white">€{totalSpending.toFixed(2)}</p>
                </div>
                 <div className="md:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
                    <h2 className="text-lg font-semibold text-slate-500 dark:text-slate-400 mb-2">Expense Category Breakdown</h2>
                     {expenseCategoryData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={100}>
                             <PieChart>
                                <Pie data={expenseCategoryData} cx="50%" cy="50%" outerRadius={40} fill="#8884d8" dataKey="value" nameKey="name" labelLine={false}>
                                    {expenseCategoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip formatter={(value: number) => `€${value.toFixed(2)}`} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                         <p className="text-center text-slate-500 dark:text-slate-400 pt-4">No expense data to display.</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
                    <h2 className="text-lg font-semibold text-slate-500 dark:text-slate-400 mb-2">Total Investments</h2>
                    <p className="text-4xl font-bold text-slate-800 dark:text-white">€{totalInvestments.toFixed(2)}</p>
                </div>
                 <div className="md:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
                    <h2 className="text-lg font-semibold text-slate-500 dark:text-slate-400 mb-2">Investment Category Breakdown</h2>
                     {investmentCategoryData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={100}>
                             <PieChart>
                                <Pie data={investmentCategoryData} cx="50%" cy="50%" outerRadius={40} fill="#8884d8" dataKey="value" nameKey="name" labelLine={false}>
                                    {investmentCategoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS_INVEST[index % COLORS_INVEST.length]} />)}
                                </Pie>
                                <Tooltip formatter={(value: number) => `€${value.toFixed(2)}`} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                         <p className="text-center text-slate-500 dark:text-slate-400 pt-4">No investment data to display.</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Upcoming Goals</h2>
                    <ul className="space-y-3">
                        {goals.slice(0, 5).map(goal => (
                            <li key={goal.id} className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                                <p className="font-semibold">{goal.title}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Target: {new Date(goal.target_date).toLocaleDateString()}</p>
                            </li>
                        ))}
                         {goals.length === 0 && <p className="text-slate-500 dark:text-slate-400">No goals set yet.</p>}
                    </ul>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Upcoming Reminders</h2>
                    <ul className="space-y-3">
                        {reminders.slice(0, 5).map(reminder => (
                            <li key={reminder.id} className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                                <p className="font-semibold">{reminder.note}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Due: {new Date(reminder.due_date).toLocaleDateString()}</p>
                            </li>
                        ))}
                         {reminders.length === 0 && <p className="text-slate-500 dark:text-slate-400">No reminders set yet.</p>}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
