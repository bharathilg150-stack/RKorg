import React, { useState } from 'react';
import { Menu, X, LogIn, LogOut, ChevronDown, ShieldCheck, Briefcase, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Logo from './Logo';
import { UserSession } from '../types';

interface NavbarProps {
  currentRoute: string;
  setRoute: (route: string) => void;
  user: UserSession | null;
  logout: () => void;
}

export default function Navbar({ currentRoute, setRoute, user, logout }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPortalOpen, setIsPortalOpen] = useState(false);

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'About', id: 'about' },
    { name: 'Services', id: 'services' },
    { name: 'Industries', id: 'industries' },
    { name: 'Jobs', id: 'jobs' },
    { name: 'Blog', id: 'blog' },
    { name: 'Career Advice', id: 'advice' },
    { name: 'Contact', id: 'contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-24 sm:h-28 items-center py-2">
          {/* Logo Brand Link */}
          <div className="cursor-pointer flex-shrink-0 flex items-center py-1" onClick={() => setRoute('home')}>
            <Logo variant="full" />
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = currentRoute === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setRoute(link.id)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'text-[#0A2C66] bg-slate-50'
                      : 'text-slate-600 hover:text-[#0A2C66] hover:bg-slate-50/50'
                  }`}
                >
                  {link.name}
                </button>
              );
            })}
          </div>

          {/* User CTA Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                {user.role === 'admin' ? (
                  <button
                    onClick={() => setRoute('admin')}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#0A2C66] text-white rounded-lg text-xs font-bold tracking-wider uppercase hover:bg-slate-800 transition-all shadow-md shadow-blue-900/10"
                  >
                    <ShieldCheck className="h-4 w-4 text-[#F97316]" />
                    Admin Panel
                  </button>
                ) : user.role === 'candidate' ? (
                  <button
                    onClick={() => setRoute('candidate-portal')}
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 border border-slate-200 text-slate-800 rounded-lg text-xs font-bold tracking-wider uppercase hover:bg-slate-100 transition-all"
                  >
                    <User className="h-4 w-4 text-[#0A2C66]" />
                    My Dashboard
                  </button>
                ) : (
                  <button
                    onClick={() => setRoute('employer-portal')}
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 border border-slate-200 text-slate-800 rounded-lg text-xs font-bold tracking-wider uppercase hover:bg-slate-100 transition-all"
                  >
                    <Briefcase className="h-4 w-4 text-[#F97316]" />
                    Employer Portal
                  </button>
                )}

                {/* Profile Display / Log Out */}
                <div className="h-8 w-[1px] bg-slate-200"></div>
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-800 truncate max-w-[120px]">
                    {user.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    {user.role}
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-[#F97316] rounded-lg hover:bg-slate-100 transition-all"
                  title="Sign Out"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsPortalOpen(!isPortalOpen)}
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-[#0A2C66] text-white hover:bg-slate-800 transition-all rounded-lg text-sm font-bold tracking-wide shadow-md shadow-blue-950/20"
                >
                  <LogIn className="h-4 w-4 text-[#F97316]" />
                  Portals & Login
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isPortalOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isPortalOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsPortalOpen(false)}></div>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-slate-100 shadow-xl z-20 py-1"
                      >
                        <button
                          onClick={() => {
                            setRoute('candidate-portal');
                            setIsPortalOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-all flex items-center gap-3 group"
                        >
                          <div className="p-1.5 bg-orange-50 rounded-lg group-hover:bg-orange-100">
                            <User className="h-4 w-4 text-[#F97316]" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-800">Job Seeker Portal</div>
                            <div className="text-[10px] text-slate-400">Apply jobs, Parse resume</div>
                          </div>
                        </button>

                        <div className="border-t border-slate-100"></div>

                        <button
                          onClick={() => {
                            setRoute('employer-portal');
                            setIsPortalOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-all flex items-center gap-3 group"
                        >
                          <div className="p-1.5 bg-blue-50 rounded-lg group-hover:bg-blue-100">
                            <Briefcase className="h-4 w-4 text-[#0A2C66]" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-800">Employer Portal</div>
                            <div className="text-[10px] text-slate-400">Post jobs, Source candidates</div>
                          </div>
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Mobile responsive toggle button */}
          <div className="flex items-center lg:hidden gap-3">
            {user && (
              <span className="text-xs font-bold text-slate-700 max-w-[80px] truncate bg-slate-100 px-2 py-1 rounded">
                {user.name}
              </span>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-[#0A2C66] hover:bg-slate-100 transition-all"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-slate-100 shadow-inner"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    setRoute(link.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold ${
                    currentRoute === link.id
                      ? 'text-[#0A2C66] bg-slate-50'
                      : 'text-slate-600 hover:text-[#0A2C66]'
                  }`}
                >
                  {link.name}
                </button>
              ))}

              <div className="pt-4 border-t border-slate-100 space-y-2">
                {user ? (
                  <>
                    <button
                      onClick={() => {
                        setRoute(user.role === 'admin' ? 'admin' : `${user.role}-portal`);
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-[#0A2C66] text-[#0A2C66] rounded-lg text-sm font-bold uppercase tracking-wider"
                    >
                      Dashboard ({user.role})
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-bold uppercase tracking-wider transition-all"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setRoute('candidate-portal');
                        setIsOpen(false);
                      }}
                      className="flex items-center justify-center gap-1 px-3 py-2 bg-slate-50 border border-slate-200 text-slate-800 rounded-lg text-xs font-bold uppercase tracking-wider"
                    >
                      Job Seeker
                    </button>
                    <button
                      onClick={() => {
                        setRoute('employer-portal');
                        setIsOpen(false);
                      }}
                      className="flex items-center justify-center gap-1 px-3 py-2 bg-[#0A2C66] text-white rounded-lg text-xs font-bold uppercase tracking-wider"
                    >
                      Employer
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
