import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from './BaseComponents';
import { LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Sidebar = ({ links, title = "Dashboard" }) => {
  const { logout, user } = useAuth();

  return (
    <div className="w-64 flex-shrink-0 hidden lg:flex flex-col h-[calc(100vh-5rem)] sticky top-20 border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-dark-bg p-4 overflow-y-auto hide-scrollbar">
      <div className="mb-8 px-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
          {title}
        </h2>
        <p className="text-xl font-bold text-slate-900 dark:text-white truncate">
          Welcome, {user?.name?.split(' ')[0]}
        </p>
      </div>

      <nav className="flex-1 space-y-1.5">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => cn(
                "group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-primary text-white shadow-md shadow-primary/20" 
                  : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/50 dark:hover:text-white"
              )}
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={isActive ? "text-white" : "text-slate-400 group-hover:text-primary"} />
                    <span>{link.name}</span>
                  </div>
                  {isActive && (
                    <motion.div layoutId="sidebar-indicator">
                      <ChevronRight size={16} />
                    </motion.div>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/20 transition-all"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
};
