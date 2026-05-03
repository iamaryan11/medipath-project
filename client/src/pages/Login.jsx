import React, { useState } from 'react';
import { useAuth } from '../hooks/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(name, email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div className="min-h-screen flex bg-hosp-bg text-hosp-text font-body">
      {/* Left Side: Medical Image Banner */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-hosp-primary items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-blue-900/60 z-10 mix-blend-multiply"></div>
        <img 
          src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=2070" 
          alt="Medical Dispatch" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 max-w-md text-center p-8">
           <div className="w-16 h-16 mx-auto mb-6 rounded bg-hosp-surface border-2 border-hosp-primary flex items-center justify-center shadow-md">
            <svg className="w-8 h-8 text-hosp-primary" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L4 5V11.09C4 16.14 7.41 20.85 12 22C16.59 20.85 20 16.14 20 11.09V5L12 2ZM17 13H13V17H11V13H7V11H11V7H13V11H17V13Z" />
            </svg>
          </div>
          <h2 className="text-4xl font-heading font-extrabold text-white mb-4 shadow-sm">Secure Dispatch</h2>
          <p className="text-lg text-blue-100 font-medium">
            Authorized personnel only. Access real-time routing and triage protocols.
          </p>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 relative bg-hosp-surface">
        {/* Back link */}
        <Link to="/" className="absolute top-8 left-8 text-sm font-semibold text-hosp-muted hover:text-hosp-primary flex items-center gap-2 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Return to home
        </Link>

        <div className="w-full max-w-md">
          <div className="mb-10 text-center lg:text-left">
            <h3 className="text-3xl font-heading font-extrabold text-hosp-text">
              {isLogin ? 'Operator Access' : 'Register Operator'}
            </h3>
            <p className="text-hosp-muted mt-2 font-medium">
              {isLogin ? 'Enter your credentials to securely access the system.' : 'Create a new dispatch account to begin.'}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6 text-sm flex gap-3 items-start">
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              <span className="font-semibold">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold text-hosp-muted mb-1.5 uppercase tracking-wide">Operator Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. John Doe"
                  className="w-full bg-hosp-surface border border-hosp-border rounded-lg px-4 py-3 text-hosp-text placeholder-gray-400 focus:outline-none focus:border-hosp-primary focus:ring-1 focus:ring-hosp-primary transition-all shadow-sm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}
            
            <div>
              <label className="block text-xs font-bold text-hosp-muted mb-1.5 uppercase tracking-wide">ID / Email Address</label>
              <input 
                type="email" 
                required
                placeholder="dispatcher@medipath.loc"
                className="w-full bg-hosp-surface border border-hosp-border rounded-lg px-4 py-3 text-hosp-text placeholder-gray-400 focus:outline-none focus:border-hosp-primary focus:ring-1 focus:ring-hosp-primary transition-all shadow-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-hosp-muted mb-1.5 uppercase tracking-wide">Security Phrase</label>
              <input 
                type="password" 
                required
                placeholder="••••••••"
                className="w-full bg-hosp-surface border border-hosp-border rounded-lg px-4 py-3 text-hosp-text placeholder-gray-400 focus:outline-none focus:border-hosp-primary focus:ring-1 focus:ring-hosp-primary transition-all shadow-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-hosp-primary hover:bg-hosp-primary-dark text-white font-bold py-3.5 rounded-lg transition-colors mt-8 shadow-md"
            >
              {isLogin ? 'Authenticate' : 'Initialize Account'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm font-medium text-hosp-muted">
            {isLogin ? "Require dispatch access? " : "Already an operator? "}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-hosp-primary hover:underline font-bold transition-colors"
            >
              {isLogin ? 'Register here' : 'Sign in here'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
