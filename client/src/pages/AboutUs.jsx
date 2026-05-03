import React from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';

const AboutUs = () => {
  return (
    <div className="min-h-screen flex flex-col bg-hosp-bg transition-colors duration-300">
      <Navbar showLinks={true} showAccessBtn={true} />

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-16">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-heading font-black text-hosp-text tracking-tight mb-4">
            Next-Gen Emergency Dispatch
          </h2>
          <p className="text-xl text-hosp-muted font-medium max-w-2xl mx-auto">
            MediPath was built to solve the latency in emergency routing, ensuring rapid response when seconds matter the most.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-heading font-bold text-hosp-primary border-l-4 border-hosp-primary pl-4">
              Our Mission
            </h3>
            <p className="text-hosp-text leading-relaxed">
              In high-stakes medical emergencies, traffic conditions and hospital ER availability change by the minute. MediPath is a centralized router that ingests real-time metrics to plot the absolute fastest path to definitive care.
            </p>
            <p className="text-hosp-text leading-relaxed">
              By combining machine learning algorithms with live telemetry and voice-activated dispatch commands, we aim to give first responders the tools they need to operate at peak efficiency across India.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-heading font-bold text-hosp-primary border-l-4 border-hosp-primary pl-4">
              Technology Stack
            </h3>
            <ul className="space-y-4 text-hosp-text">
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                <span><strong>React & TailwindCSS:</strong> For a lightweight, ultra-responsive operator dashboard.</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                <span><strong>Leaflet & OSRM:</strong> Providing sub-second geographic routing across complex traffic networks.</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                <span><strong>Python ML Microservice:</strong> Calculating shortest paths and generating live road hazards.</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                <span><strong>Google Gemini AI:</strong> Processing instant first-aid protocols via conversational queries.</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutUs;
