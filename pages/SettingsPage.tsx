import React, { useState, useEffect } from 'react';

const SettingsPage: React.FC = () => {
    // State for all settings
    const [reminderTime, setReminderTime] = useState('20:00');
    const [reminderMessage, setReminderMessage] = useState('Please add the expenses or investments to Nexus');
    const [emailAsh, setEmailAsh] = useState('');
    const [emailAnb, setEmailAnb] = useState('');
    const [saved, setSaved] = useState(false);

    // Load saved settings from localStorage on component mount
    useEffect(() => {
        const savedTime = localStorage.getItem('nexus_reminder_time');
        const savedMessage = localStorage.getItem('nexus_reminder_message');
        const savedEmailAsh = localStorage.getItem('nexus_email_ash');
        const savedEmailAnb = localStorage.getItem('nexus_email_anb');

        if (savedTime) setReminderTime(savedTime);
        if (savedMessage) setReminderMessage(savedMessage);
        if (savedEmailAsh) setEmailAsh(savedEmailAsh);
        if (savedEmailAnb) setEmailAnb(savedEmailAnb);
    }, []);

    // Save settings to localStorage
    const handleSave = () => {
        localStorage.setItem('nexus_reminder_time', reminderTime);
        localStorage.setItem('nexus_reminder_message', reminderMessage);
        localStorage.setItem('nexus_email_ash', emailAsh);
        localStorage.setItem('nexus_email_anb', emailAnb);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };
    
    // Dynamically create the list of recipients for the mailto link
    const recipients = [emailAsh, emailAnb].map(e => e.trim()).filter(Boolean).join(',');
    const mailtoLink = `mailto:${recipients}?subject=Nexus Daily Reminder&body=${encodeURIComponent(reminderMessage)}`;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Settings</h1>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md max-w-2xl">
                <h2 className="text-2xl font-semibold mb-4">Daily Email Reminder</h2>
                
                {/* Email Configuration Section */}
                <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg mb-6">
                    <h3 className="text-xl font-semibold mb-3">Recipient Emails</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="emailAsh" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Ash's Email</label>
                            <input 
                                type="email" 
                                id="emailAsh" 
                                placeholder="ash@example.com"
                                value={emailAsh}
                                onChange={(e) => setEmailAsh(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="emailAnb" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Anb's Email</label>
                            <input 
                                type="email" 
                                id="emailAnb" 
                                placeholder="anb@example.com"
                                value={emailAnb}
                                onChange={(e) => setEmailAnb(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Reminder Time and Message Section */}
                <div className="space-y-4">
                    <div>
                        <label htmlFor="reminderTime" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Reminder Time</label>
                        <input 
                            type="time" 
                            id="reminderTime" 
                            value={reminderTime}
                            onChange={(e) => setReminderTime(e.target.value)}
                            className="mt-1 block w-full max-w-xs px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="reminderMessage" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Reminder Message</label>
                        <textarea 
                            id="reminderMessage" 
                            rows={4}
                            value={reminderMessage}
                            onChange={(e) => setReminderMessage(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        />
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                    <button 
                        onClick={handleSave} 
                        className="bg-primary-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-primary-700 disabled:bg-primary-300 transition-colors"
                    >
                        Save Settings
                    </button>
                    {saved && <span className="text-green-600 dark:text-green-400">Settings saved!</span>}
                </div>

                <div className="mt-8 p-4 bg-amber-50 dark:bg-slate-700 border-l-4 border-amber-400 text-amber-800 dark:text-amber-200 rounded-r-lg">
                    <h3 className="font-bold">Important Note</h3>
                    <p className="text-sm">
                        This application runs entirely in your browser and does not have a backend server. Therefore, it cannot send emails automatically. The settings, including recipient emails, are saved locally. You can use the button below to manually send the reminder via your default email client.
                    </p>
                </div>
                 <div className="mt-4">
                     <a 
                        href={recipients ? mailtoLink : undefined}
                        onClick={(e) => { if (!recipients) e.preventDefault(); }}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-disabled={!recipients}
                        className={`inline-block text-white px-4 py-2 rounded-lg shadow-md transition-colors ${!recipients ? 'bg-slate-400 dark:bg-slate-500 cursor-not-allowed' : 'bg-slate-600 hover:bg-slate-700'}`}
                    >
                        Send Test Email
                    </a>
                    {!recipients && <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Please enter at least one recipient email to send a test.</p>}
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
