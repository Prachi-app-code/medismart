import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Calendar, PlusCircle, History, Users } from 'lucide-react';
import { useCaregiverContext } from '../../context/CaregiverContext';

export default function BottomNav() {
  const { alerts } = useCaregiverContext();
  const unreadAlerts = alerts.filter(a => !a.actionTaken).length;

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/schedule', label: 'Schedule', icon: Calendar },
    { to: '/add', label: 'Add Med', icon: PlusCircle, isSpecial: true },
    { to: '/history', label: 'History', icon: History },
    { to: '/caregiver', label: 'Caregiver', icon: Users, badge: unreadAlerts }
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1.5 safe-area-pb"
    >
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          
          if (item.isSpecial) {
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center -mt-5 group`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 ${
                      isActive 
                        ? 'bg-primary-600 ring-4 ring-primary-100 text-white' 
                        : 'bg-primary-500 hover:bg-primary-600 text-white'
                    }`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <span className={`text-xs font-bold mt-1 ${isActive ? 'text-primary-600' : 'text-slate-600'}`}>
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            );
          }

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl min-h-[48px] min-w-[56px] transition-all relative ${
                  isActive
                    ? 'text-primary-600 font-bold bg-primary-50/80'
                    : 'text-slate-500 hover:text-text font-medium'
                }`
              }
            >
              <div className="relative">
                <Icon className="w-6 h-6 mb-0.5" />
                {item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 bg-danger text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-[16px] text-center shadow-sm animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] leading-tight">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
