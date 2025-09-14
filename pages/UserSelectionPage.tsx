
import React from 'react';
import { useUser } from '../hooks/useUser';
import { USERS } from '../constants';
import { User } from '../types';

const UserSelectionPage: React.FC = () => {
  const { setUser } = useUser();

  const handleUserSelect = (user: User) => {
    setUser(user);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-4">
       <div className="flex items-center mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-primary-400">
                <path d="M12.378 1.602a.75.75 0 00-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03zM21.75 7.93l-9 5.25v9l8.628-5.032a.75.75 0 00.372-.648V7.93zM11.25 22.18v-9l-9-5.25v8.57a.75.75 0 00.372.648l8.628 5.032z" />
            </svg>
            <h1 className="text-5xl font-bold ml-4">Nexus</h1>
        </div>
      <h2 className="text-2xl md:text-3xl font-light mb-12 text-slate-300">Who are you?</h2>
      <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-8">
        {USERS.map((user) => (
          <button
            key={user.id}
            onClick={() => handleUserSelect(user)}
            className="group flex flex-col items-center justify-center p-8 bg-slate-800 rounded-2xl shadow-lg hover:bg-primary-600 hover:shadow-primary-500/30 transition-all duration-300 transform hover:-translate-y-2"
          >
            <div className="w-24 h-24 rounded-full bg-slate-700 group-hover:bg-primary-500 flex items-center justify-center text-4xl font-bold text-white mb-4 transition-colors">
              {user.username.charAt(0)}
            </div>
            <span className="text-2xl font-semibold">{user.username}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserSelectionPage;
