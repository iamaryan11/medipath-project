import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Lightweight Custom Typing Hook
const useTypingEffect = (words, typingSpeed = 100, deletingSpeed = 50, pauseTime = 1500) => {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);

  useEffect(() => {
    let timer;
    const currentWord = words[loopNum % words.length];

    if (isDeleting) {
      timer = setTimeout(() => {
        setText(currentWord.substring(0, text.length - 1));
      }, deletingSpeed);
    } else {
      timer = setTimeout(() => {
        setText(currentWord.substring(0, text.length + 1));
      }, typingSpeed);
    }

    if (!isDeleting && text === currentWord) {
      timer = setTimeout(() => setIsDeleting(true), pauseTime);
    } else if (isDeleting && text === '') {
      setIsDeleting(false);
      setLoopNum(loopNum + 1);
    }

    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, words, typingSpeed, deletingSpeed, pauseTime]);

  return text;
};

const Landing = () => {
  const typeText = useTypingEffect(["Precision Routing", "Instant Dispatch", "Rapid Triage", "Saving Lives"]);

  return (
    <div className="min-h-screen flex flex-col bg-hosp-bg transition-colors duration-300">
      <Navbar />

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center relative overflow-hidden bg-hosp-surface border-b border-hosp-border">
        {/* Subtle Grid Background for Enterprise feel */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CgkJPHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPgoJCTxwYXRoIGQ9Ik0wIDAuNWg0ME0wLjUgMHY0MCIgc3Ryb2tlPSJyZ2JhKDIwMCwgMjAwLCAyMDAsIDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPgoJPC9zdmc+')] opacity-50 z-0"></div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24 lg:py-32 grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="flex flex-col gap-6">
            <div className="inline-block px-3 py-1.5 rounded bg-hosp-primary/10 border border-hosp-primary/20 text-hosp-primary text-xs font-bold tracking-widest uppercase w-max">
              Mission Critical Systems
            </div>
            <h2 className="text-5xl lg:text-7xl font-heading font-black text-hosp-text leading-[1.1] tracking-tight">
              Rapid Response.<br/>
              <span className="text-hosp-primary min-h-[1.2em] inline-block relative">
                {typeText}
                <span className="w-1 h-12 bg-hosp-primary inline-block ml-1 animate-pulse align-middle"></span>
              </span>
            </h2>
            <p className="text-lg text-hosp-muted max-w-lg leading-relaxed font-medium">
              MediPath enterprise dispatch system utilizes live OSRM geometric routing and facility proximity models to direct critical patients exactly where they belong.
            </p>
            <div className="flex gap-4 mt-6">
              <Link to="/login" className="px-8 py-4 bg-hosp-primary hover:bg-hosp-primary-dark text-white font-bold rounded shadow-md transition-all flex items-center gap-2 uppercase tracking-wide text-sm">
                Initialize Terminal
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </Link>
            </div>
            
            <div className="mt-8 flex items-center gap-6 pt-8 border-t border-hosp-border">
              <div className="flex flex-col">
                <span className="text-3xl font-heading font-black text-hosp-text">99.9%</span>
                <span className="text-[10px] font-bold text-hosp-muted uppercase tracking-widest">Uptime Guarantee</span>
              </div>
              <div className="w-px h-10 bg-hosp-border"></div>
              <div className="flex flex-col">
                <span className="text-3xl font-heading font-black text-hosp-text mono">15ms</span>
                <span className="text-[10px] font-bold text-hosp-muted uppercase tracking-widest">Query Latency</span>
              </div>
            </div>
          </div>

          {/* Rigid Data Graphic */}
          <div className="relative hidden lg:block">
            <div className="hosp-card p-4 shadow-xl border-2 border-hosp-border bg-hosp-surface relative">
               <div className="absolute top-0 left-0 w-full h-1 bg-hosp-primary"></div>
               <div className="flex justify-between items-center mb-4 pb-2 border-b border-hosp-border">
                 <div className="text-xs font-bold text-hosp-muted uppercase tracking-wider">Live Telemetry</div>
                 <div className="w-2 h-2 rounded-full bg-hosp-accent animate-pulse"></div>
               </div>
               <img 
                 src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000" 
                 alt="Data Dashboard" 
                 className="w-full h-auto object-cover rounded opacity-90 grayscale-[30%]"
               />
            </div>
          </div>
        </div>
      </main>

      {/* Expanded Capabilities Section */}
      <section className="py-24 bg-hosp-bg">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h3 className="text-sm font-bold text-hosp-primary tracking-widest uppercase mb-2">System Architecture</h3>
            <h2 className="text-3xl lg:text-4xl font-heading font-black text-hosp-text">Core Dispatch Capabilities</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="hosp-card p-8 hover:border-hosp-primary transition-colors">
              <div className="w-12 h-12 rounded bg-blue-100 flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-hosp-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
              </div>
              <h4 className="text-xl font-bold text-hosp-text mb-3">Geometric OSRM Routing</h4>
              <p className="text-sm text-hosp-muted leading-relaxed">
                We utilize the Open Source Routing Machine to calculate exact street-level driving distances and polylines, completely bypassing inaccurate "as the crow flies" estimations.
              </p>
            </div>
            
            <div className="hosp-card p-8 hover:border-hosp-accent transition-colors">
              <div className="w-12 h-12 rounded bg-red-100 flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-hosp-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h4 className="text-xl font-bold text-hosp-text mb-3">One-Touch SOS Override</h4>
              <p className="text-sm text-hosp-muted leading-relaxed">
                In absolute emergencies, our SOS override bypasses standard filters to immediately deploy units to the nearest 24/7 Trauma Center with a single click.
              </p>
            </div>

            <div className="hosp-card p-8 hover:border-hosp-primary transition-colors">
              <div className="w-12 h-12 rounded bg-blue-100 flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-hosp-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
              </div>
              <h4 className="text-xl font-bold text-hosp-text mb-3">NoSQL GeoSpatial Queries</h4>
              <p className="text-sm text-hosp-muted leading-relaxed">
                Powered by a highly optimized MongoDB backend, the system executes lightning-fast `$near` proximity queries against thousands of facility index points.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Protocol Flowchart Section */}
      <section className="py-20 bg-hosp-surface border-y border-hosp-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/3">
              <h3 className="text-2xl font-heading font-black text-hosp-text mb-4">Standardized Dispatch Protocol</h3>
              <p className="text-sm text-hosp-muted leading-relaxed mb-6">
                All routing decisions follow strict deterministic parameters set by the operator.
              </p>
              <Link to="/first-aid" className="text-sm font-bold text-hosp-primary hover:underline">View Medical Protocols &rarr;</Link>
            </div>
            
            <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-3 gap-4">
               <div className="bg-hosp-bg border border-hosp-border p-4 rounded text-center shadow-sm">
                 <div className="font-mono text-hosp-primary font-bold text-xl mb-1">01</div>
                 <div className="text-xs font-bold uppercase tracking-wide text-hosp-text">Acquire GPS Telemetry</div>
               </div>
               <div className="bg-hosp-bg border border-hosp-border p-4 rounded text-center shadow-sm">
                 <div className="font-mono text-hosp-primary font-bold text-xl mb-1">02</div>
                 <div className="text-xs font-bold uppercase tracking-wide text-hosp-text">Filter Proximity Index</div>
               </div>
               <div className="bg-hosp-bg border border-hosp-border p-4 rounded text-center shadow-sm">
                 <div className="font-mono text-hosp-primary font-bold text-xl mb-1">03</div>
                 <div className="text-xs font-bold uppercase tracking-wide text-hosp-text">Execute Vector Path</div>
               </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
