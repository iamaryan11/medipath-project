import React, { useState } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const AccordionItem = ({ title, children, icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-hosp-border rounded-lg mb-3 bg-hosp-surface overflow-hidden shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between bg-hosp-surface hover:bg-hosp-bg transition-colors"
      >
        <div className="flex items-center gap-3 font-semibold text-hosp-text">
          <span className="text-xl">{icon}</span>
          {title}
        </div>
        <svg className={`w-5 h-5 text-hosp-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
      </button>
      {isOpen && (
        <div className="px-6 py-5 bg-hosp-bg border-t border-hosp-border text-sm text-hosp-text leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
};

const FirstAid = () => {
  return (
    <div className="min-h-screen flex flex-col bg-hosp-bg transition-colors duration-300">
      <Navbar showLinks={true} showAccessBtn={true} />

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">
        <div className="mb-10 text-center">
          <h2 className="text-4xl font-heading font-bold text-hosp-text mb-4">Emergency First Aid</h2>
          <p className="text-hosp-muted max-w-2xl mx-auto">
            Quick-reference guides for life-threatening emergencies.
            <strong className="text-hosp-accent block mt-2">If you are in an emergency, call 112 immediately. Do not delay.</strong>
          </p>
        </div>

        <div className="space-y-4">
          <AccordionItem title="CPR (Cardiopulmonary Resuscitation)" icon="❤️">
            <ol className="list-decimal pl-5 space-y-2">
              <li><strong>Check the scene</strong> for safety, then check the person. Tap their shoulder and shout, "Are you okay?"</li>
              <li><strong>Call 112</strong> immediately if they are unresponsive.</li>
              <li><strong>Open the airway.</strong> Tilt their head back slightly and lift the chin.</li>
              <li><strong>Check for breathing.</strong> Listen carefully, for no more than 10 seconds.</li>
              <li><strong>Push hard and fast.</strong> Place your hands, one on top of the other, in the middle of the chest. Push down hard at least 2 inches at a rate of 100 to 120 pushes a minute.</li>
              <li><strong>Deliver rescue breaths</strong> if you are trained. Otherwise, continue hands-only CPR until help arrives.</li>
            </ol>
          </AccordionItem>

          <AccordionItem title="Choking (Heimlich Maneuver)" icon="🤐">
            <p className="mb-3 font-semibold text-hosp-accent">If the person is coughing forcefully, let them keep coughing.</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Stand behind the person. Wrap your arms around their waist.</li>
              <li>Make a fist with one hand. Place the thumb side of your fist just above the person's navel.</li>
              <li>Grasp your fist with your other hand.</li>
              <li>Give quick, upward thrusts into the abdomen.</li>
              <li>Continue until the object is forced out or the person can breathe, cough, or talk.</li>
            </ol>
          </AccordionItem>

          <AccordionItem title="Severe Bleeding" icon="🩸">
            <ol className="list-decimal pl-5 space-y-2">
              <li><strong>Call 108.</strong></li>
              <li><strong>Apply direct pressure.</strong> Place a clean cloth or sterile dressing directly on the wound and press firmly with your hand.</li>
              <li><strong>Maintain pressure.</strong> Bind the wound tightly with a bandage. Do not remove the initial dressing if blood soaks through; add more on top.</li>
              <li><strong>Elevate the injured area</strong> above the heart if possible.</li>
              <li><strong>Use a tourniquet ONLY as a last resort</strong> for severe limb bleeding that cannot be controlled with direct pressure.</li>
            </ol>
          </AccordionItem>

          <AccordionItem title="Burns" icon="🔥">
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Stop the burning.</strong> Extinguish flames, remove the person from the source.</li>
              <li><strong>Cool the burn.</strong> Run cool (not cold) water over the burn for 10-15 minutes. Do NOT use ice.</li>
              <li><strong>Remove tight items.</strong> Rings or tight clothing from the burned area before it swells.</li>
              <li><strong>Cover the burn.</strong> Use a sterile, non-adhesive bandage or clean cloth. Do not pop blisters or apply ointments to severe burns.</li>
            </ul>
          </AccordionItem>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FirstAid;
