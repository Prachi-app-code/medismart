import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Calendar, PlusCircle, History, Users, Cpu, HeartPulse } from 'lucide-react';
import { useCaregiverContext } from '../../context/CaregiverContext';
import { useMedicationContext } from '../../context/MedicationContext';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ onOpenSimulator }) {
  const { alerts } = useCaregiverContext();
  const { adherence } = useMedicationContext();
  const { user, profile } = useAuth();
  const unreadAlerts = alerts.filter(a => !a.actionTaken).length;

  const links = [
    { to: '/', label: 'Hero Dashboard', icon: Home },
    { to: '/schedule', label: 'Medication Schedule', icon: Calendar },
    { to: '/add', label: 'Add Medication (QR)', icon: PlusCircle },
    { to: '/history', label: 'Dose History & Stats', icon: History },
    { to: '/caregiver', label: 'Caregiver Portal', icon: Users, badge: unreadAlerts }
  ];

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <aside aria-label="Desktop Sidebar" className="hidden md:flex flex-col w-64 lg:w-72 bg-white border-r border-slate-200/80 min-h-[calc(100vh-80px)] p-5 justify-between">
      <div className="space-y-6">
        
        {/* Active User Card Badge */}
        {profile && (
          <div className="bg-gradient-to-br from-primary-50 to-blue-50/50 p-4 rounded-2xl border border-primary-100 flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary-600 text-white font-bold text-base flex items-center justify-center shadow-xs flex-shrink-0">
              {getInitials(profile.full_name)}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-text text-sm truncate">{profile.full_name}</h3>
              <p className="text-xs text-slate-500 capitalize">{profile.role} Account</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-[11px] font-semibold text-emerald-700">Adherence: {adherence.percentage}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Nav Links */}
        <nav className="space-y-1.5">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-3 rounded-2xl font-semibold text-base transition-all min-h-[48px] ${
                    isActive
                      ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-text'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{link.label}</span>
                    </div>
                    {link.badge > 0 && (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-white text-danger' : 'bg-danger text-white'
                      }`}>
                        {link.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Hardware Simulator Trigger Card */}
      <div className="pt-4 border-t border-slate-100 space-y-3">
        <button
          onClick={onOpenSimulator}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white p-3.5 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2.5 text-sm font-bold"
        >
          <Cpu className="w-5 h-5 text-emerald-400" />
          <span>Test Smart Pillbox</span>
        </button>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center gap-2.5 text-xs text-slate-500">
          <HeartPulse className="w-4 h-4 text-primary-500 flex-shrink-0" />
          <span>WCAG 2.1 AA Compliant</span>
        </div>
      </div>
    </aside>
  );
}
