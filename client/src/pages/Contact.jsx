import React, { useState } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Your message has been securely transmitted to the administration team.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-hosp-bg transition-colors duration-300">
      <Navbar showLinks={true} showAccessBtn={true} />

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-16 flex flex-col lg:flex-row gap-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:w-1/3 space-y-8"
        >
          <div>
            <h2 className="text-3xl font-heading font-bold text-hosp-text mb-4">Contact Admin</h2>
            <p className="text-hosp-muted text-sm leading-relaxed">
              For hospital partnership inquiries, technical support, or API access to the routing service, please fill out the secure form.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-hosp-surface border border-hosp-border flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-hosp-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              </div>
              <div>
                <h4 className="text-sm font-bold text-hosp-text">Emergency Call Center</h4>
                <p className="text-hosp-muted text-sm">112 / 108 (India)</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-hosp-surface border border-hosp-border flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-hosp-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <div>
                <h4 className="text-sm font-bold text-hosp-text">System Admin</h4>
                <p className="text-hosp-muted text-sm">admin@medipath.loc</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:w-2/3 bg-hosp-surface border border-hosp-border rounded-2xl p-8 shadow-sm"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-hosp-muted uppercase tracking-wider mb-2">Facility / Sender Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-hosp-bg border border-hosp-border rounded-lg px-4 py-3 text-hosp-text focus:outline-none focus:border-hosp-primary focus:ring-1 focus:ring-hosp-primary transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-hosp-muted uppercase tracking-wider mb-2">Email Address</label>
                <input 
                  type="email" 
                  required
                  className="w-full bg-hosp-bg border border-hosp-border rounded-lg px-4 py-3 text-hosp-text focus:outline-none focus:border-hosp-primary focus:ring-1 focus:ring-hosp-primary transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-hosp-muted uppercase tracking-wider mb-2">Subject</label>
              <input 
                type="text" 
                required
                className="w-full bg-hosp-bg border border-hosp-border rounded-lg px-4 py-3 text-hosp-text focus:outline-none focus:border-hosp-primary focus:ring-1 focus:ring-hosp-primary transition-all"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-hosp-muted uppercase tracking-wider mb-2">Message Payload</label>
              <textarea 
                required
                rows={4}
                className="w-full bg-hosp-bg border border-hosp-border rounded-lg px-4 py-3 text-hosp-text focus:outline-none focus:border-hosp-primary focus:ring-1 focus:ring-hosp-primary transition-all resize-none"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              ></textarea>
            </div>
            
            <button 
              type="submit"
              className="bg-hosp-primary hover:bg-hosp-primary-dark text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-sm flex items-center gap-2"
            >
              Transmit Protocol
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </form>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
