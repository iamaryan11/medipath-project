import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-hosp-surface border-t border-hosp-border py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded border border-hosp-primary flex items-center justify-center bg-hosp-surface">
              <svg className="w-5 h-5 text-hosp-primary" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L4 5V11.09C4 16.14 7.41 20.85 12 22C16.59 20.85 20 16.14 20 11.09V5L12 2ZM17 13H13V17H11V13H7V11H11V7H13V11H17V13Z" />
              </svg>
            </div>
            <span className="text-xl font-heading font-black text-hosp-text tracking-widest uppercase">
              MediPath
            </span>
          </div>
          <p className="text-sm text-hosp-muted leading-relaxed">
            Intelligent emergency routing and medical dispatch system. Built for speed, reliability, and saving lives.
          </p>
        </div>
        
        <div>
          <h4 className="font-bold text-hosp-text mb-4 uppercase tracking-wider text-xs">Knowledge Base</h4>
          <ul className="space-y-2 text-sm text-hosp-muted">
            <li><Link to="/first-aid" className="hover:text-hosp-primary transition-colors">First Aid Guide</Link></li>
            <li><Link to="/medicines" className="hover:text-hosp-primary transition-colors">Emergency Medicines</Link></li>
            <li><Link to="/" className="hover:text-hosp-primary transition-colors">Platform Home</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-hosp-accent mb-4 uppercase tracking-wider text-xs">Emergency Hotlines</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2 text-hosp-text font-semibold">
              <span className="w-8 h-8 rounded-full bg-hosp-surface border border-hosp-accent text-hosp-accent flex items-center justify-center shadow-sm">📞</span>
              National Emergency: 112
            </li>
            <li className="flex items-center gap-2 text-hosp-text font-semibold">
              <span className="w-8 h-8 rounded-full bg-hosp-surface border border-hosp-primary text-hosp-primary flex items-center justify-center shadow-sm">🚑</span>
              Ambulance / Health: 108
            </li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-10 pt-6 border-t border-hosp-border text-xs text-center text-hosp-muted">
        &copy; {new Date().getFullYear()} MediPath Tri-City. For educational and demonstrational purposes only.
      </div>
    </footer>
  );
};

export default Footer;
