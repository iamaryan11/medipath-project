import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../hooks/ThemeContext';

const Navbar = ({ showLinks = true, showAccessBtn = true }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="flex justify-between items-center p-4 lg:px-8 bg-hosp-surface border-b border-hosp-border z-50 sticky top-0 shadow-sm transition-colors duration-300">
      <Link to="/" className="flex items-center gap-3">
        {/* Classic Medical Shield Logo */}
        <div className="w-10 h-10 rounded border-2 border-hosp-primary flex items-center justify-center bg-hosp-surface relative">
           <svg className="w-6 h-6 text-hosp-primary" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L4 5V11.09C4 16.14 7.41 20.85 12 22C16.59 20.85 20 16.14 20 11.09V5L12 2ZM17 13H13V17H11V13H7V11H11V7H13V11H17V13Z" />
           </svg>
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-heading font-black text-hosp-text uppercase tracking-widest leading-none">
            MediPath
          </h1>
          <span className="text-[10px] font-bold text-hosp-primary tracking-widest uppercase mt-1">Global Router</span>
        </div>
      </Link>
      
      <div className="flex items-center gap-6">
        {showLinks && (
          <div className="hidden md:flex items-center gap-6">
            <Link to="/first-aid" className="text-sm font-bold text-hosp-muted hover:text-hosp-text uppercase tracking-wide transition-colors">Protocols</Link>
            <Link to="/medicines" className="text-sm font-bold text-hosp-muted hover:text-hosp-text uppercase tracking-wide transition-colors">Formulary</Link>
            <Link to="/about" className="text-sm font-bold text-hosp-muted hover:text-hosp-text uppercase tracking-wide transition-colors">About Us</Link>
            <Link to="/contact" className="text-sm font-bold text-hosp-muted hover:text-hosp-text uppercase tracking-wide transition-colors">Contact</Link>
            <div className="w-px h-5 bg-hosp-border"></div>
          </div>
        )}
        
        {/* Theme Toggle Switch */}
        <button 
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-hosp-bg text-hosp-muted hover:text-hosp-primary transition-colors border border-transparent hover:border-hosp-border z-50 cursor-pointer"
          aria-label="Toggle Dark Mode"
        >
          {theme === 'light' ? (
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
          ) : (
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          )}
        </button>

        {showAccessBtn && (
          <Link 
            to="/login"
            className="px-5 py-2.5 rounded text-xs font-bold uppercase tracking-widest bg-hosp-primary text-white hover:bg-hosp-primary-dark transition-all shadow-sm"
          >
            Terminal Access
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
