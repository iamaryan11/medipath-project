import React from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } }
};

const MedCard = ({ name, use, warnings }) => (
  <motion.div variants={itemVariants} className="hosp-card p-6 hover:shadow-md transition-shadow">
    <h3 className="text-xl font-heading font-bold text-hosp-primary mb-2 flex justify-between items-center">
      {name}
      <span className="text-xs px-2 py-1 bg-hosp-bg border border-hosp-border text-hosp-muted rounded-full font-body font-normal">OTC</span>
    </h3>
    <div className="mb-4">
      <span className="text-xs font-bold uppercase text-hosp-muted tracking-wider">Primary Use</span>
      <p className="text-sm font-medium text-hosp-text mt-1">{use}</p>
    </div>
    <div className="bg-hosp-surface rounded-lg p-3 border border-hosp-accent/50">
      <span className="text-xs font-bold uppercase text-hosp-accent tracking-wider">Warnings</span>
      <p className="text-xs text-hosp-text font-semibold mt-1">{warnings}</p>
    </div>
  </motion.div>
);

const Medicines = () => {
  return (
    <div className="min-h-screen flex flex-col bg-hosp-bg transition-colors duration-300">
      <Navbar showLinks={true} showAccessBtn={true} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
           <h2 className="text-4xl font-heading font-bold text-hosp-text mb-4">Emergency Medications Directory</h2>
           <p className="text-hosp-muted max-w-2xl mx-auto">
             A quick reference for common over-the-counter (OTC) medications used in pre-hospital care. 
             <strong className="text-hosp-primary block mt-2">Always consult a physician before administering any medication.</strong>
           </p>
        </motion.div>

        <motion.div 
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.08 }
            }
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <MedCard 
            name="Aspirin (325mg)" 
            use="Suspected Heart Attack (Myocardial Infarction)." 
            warnings="Do NOT use if the patient is allergic, has a bleeding disorder, or if it is a suspected stroke (unless directed by EMS)." 
          />
          <MedCard 
            name="Epinephrine Auto-Injector" 
            use="Severe Allergic Reactions (Anaphylaxis)." 
            warnings="Must be prescribed to the patient. Inject into the outer thigh. Call 112 or 108 immediately after use." 
          />
          <MedCard 
            name="Naloxone (Narcan)" 
            use="Suspected Opioid Overdose." 
            warnings="Administer nasal spray if patient is unresponsive and breathing is abnormally slow/stopped. May require multiple doses." 
          />
          <MedCard 
            name="Diphenhydramine (Benadryl)" 
            use="Mild Allergic Reactions." 
            warnings="Causes severe drowsiness. Do not use as a substitute for Epinephrine in severe anaphylaxis." 
          />
          <MedCard 
            name="Albuterol Inhaler" 
            use="Asthma Attacks / Severe Wheezing." 
            warnings="Patient should use their own prescribed inhaler. Can cause rapid heart rate." 
          />
          <MedCard 
            name="Activated Charcoal" 
            use="Certain types of poisoning / Overdose." 
            warnings="Do NOT use for corrosive poisons (acid/base). Only administer if explicitly directed by Poison Control or EMS." 
          />
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Medicines;
