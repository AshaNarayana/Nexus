
import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from '../hooks/useUser';
import api from '../services/api';
import { Goal, Reminder } from '../types';
import Modal from '../components/Modal';
import GoalForm from '../components/GoalForm';
import ReminderForm from '../components/ReminderForm';
import { Plus, Trash2 } from 'lucide-react';

const GoalsPage: React.FC = () => {
    const { user } = useUser();
    const [goals, setGoals] = useState<Goal[]>([]);
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [loading, setLoading] = useState(true);

    const [isGoalModalOpen, setGoalModalOpen] = useState(false);
    const [isReminderModalOpen, setReminderModalOpen] = useState(false);

    const fetchData = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const [userGoals, userReminders] = await Promise.all([
                api.getGoals(user.id),
                api.getReminders(user.id)
            ]);
            setGoals(userGoals);
            setReminders(userReminders);
        } catch (error) {
            console.error("Failed to fetch goals and reminders:", error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);
    
    const handleDeleteGoal = async (goalId: number) => {
        if (user && window.confirm('Are you sure you want to delete this goal?')) {
            await api.deleteGoal(goalId, user.id);
            fetchData();
        }
    };
    
    const handleDeleteReminder = async (reminderId: number) => {
        if (user && window.confirm('Are you sure you want to delete this reminder?')) {
            await api.deleteReminder(reminderId, user.id);
            fetchData();
        }
    };

    if (loading) {
        return <div className="text-center p-10">Loading goals and reminders...</div>;
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Goals & Reminders</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Goals Section */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold">My Goals</h2>
                        <button onClick={() => setGoalModalOpen(true)} className="flex items-center bg-primary-600 text-white px-3 py-1.5 rounded-lg shadow-md hover:bg-primary-700 text-sm">
                            <Plus size={16} className="mr-1" /> Add Goal
                        </button>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md space-y-4">
                        {goals.length > 0 ? goals.map(goal => (
                            <div key={goal.id} className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg flex justify-between items-start">
                                <div>
                                    <p className="font-bold">{goal.title}</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-300">{goal.description}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Target: {new Date(goal.target_date).toLocaleDateString()}</p>
                                </div>
                                <button onClick={() => handleDeleteGoal(goal.id)} className="p-2 text-slate-500 hover:text-red-600 dark:hover:text-red-400">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        )) : <p className="text-center text-slate-500 dark:text-slate-400 py-4">No goals set.</p>}
                    </div>
                </div>

                {/* Reminders Section */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold">My Reminders</h2>
                        <button onClick={() => setReminderModalOpen(true)} className="flex items-center bg-primary-600 text-white px-3 py-1.5 rounded-lg shadow-md hover:bg-primary-700 text-sm">
                            <Plus size={16} className="mr-1" /> Add Reminder
                        </button>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md space-y-4">
                        {reminders.length > 0 ? reminders.map(reminder => (
                            <div key={reminder.id} className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg flex justify-between items-start">
                                <div>
                                    <p className="font-semibold">{reminder.note}</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Due: {new Date(reminder.due_date).toLocaleDateString()}</p>
                                </div>
                                <button onClick={() => handleDeleteReminder(reminder.id)} className="p-2 text-slate-500 hover:text-red-600 dark:hover:text-red-400">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        )) : <p className="text-center text-slate-500 dark:text-slate-400 py-4">No reminders set.</p>}
                    </div>
                </div>
            </div>

            <Modal isOpen={isGoalModalOpen} onClose={() => setGoalModalOpen(false)}>
                <h2 className="text-2xl font-bold mb-4">Add New Goal</h2>
                <GoalForm onSuccess={() => { setGoalModalOpen(false); fetchData(); }} />
            </Modal>
            
            <Modal isOpen={isReminderModalOpen} onClose={() => setReminderModalOpen(false)}>
                <h2 className="text-2xl font-bold mb-4">Add New Reminder</h2>
                <ReminderForm onSuccess={() => { setReminderModalOpen(false); fetchData(); }} />
            </Modal>
        </div>
    );
};

export default GoalsPage;
