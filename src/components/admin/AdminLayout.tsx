import React from 'react';
import { Link } from 'react-router-dom';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
        </div>
        <nav className="mt-4">
          <Link
            to="/admin/players"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
          >
            Players
          </Link>
          <Link
            to="/admin/matches"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
          >
            Matches
          </Link>
          <Link
            to="/admin/news"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
          >
            News
          </Link>
          <Link
            to="/admin/trainings"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
          >
            Trainings
          </Link>
          <Link
            to="/admin/media"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
          >
            Media
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
}; 