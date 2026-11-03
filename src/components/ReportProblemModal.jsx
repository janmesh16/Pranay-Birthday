import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, CheckCircle2 } from 'lucide-react';
import { playClickSound } from '../utils/audio';

export function ReportProblemModal({ onClose }) {
  const [selectedIssue, setSelectedIssue] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const issues = [
    "Pranay is reaching in '5 minutes' for the past 2 hours",
    "Left on seen on WhatsApp after asking an important question",
    "Extreme ego detected in Season 20 trailer",
    "Refuses to split the Zomato delivery charges",
    "Borrowed clothes in 2022 and claims they are now his",
    "Audio error: He keeps giving unsolicited gym advice"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedIssue) return;
    playClickSound();
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-md rounded-2xl bg-[#14141e] border border-white/10 p-6 text-white shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {!submitted ? (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-display uppercase tracking-wider text-white">
                  Report a Problem
                </h3>
                <p className="text-xs text-gray-400">Technical Diagnostic & Roast Helpdesk</p>
              </div>
            </div>

            <p className="text-xs text-gray-300 mb-4">
              Select the primary bug encountered while streaming Pranay: Season 20:
            </p>

            <form onSubmit={handleSubmit} className="space-y-2.5">
              {issues.map((issue, idx) => (
                <label
                  key={idx}
                  onClick={() => setSelectedIssue(issue)}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer text-xs transition-colors ${
                    selectedIssue === issue 
                      ? 'bg-pranay-red/10 border-pranay-red text-white' 
                      : 'bg-white/[0.03] border-white/5 text-gray-300 hover:bg-white/[0.06]'
                  }`}
                >
                  <input
                    type="radio"
                    name="problem"
                    checked={selectedIssue === issue}
                    onChange={() => setSelectedIssue(issue)}
                    className="mt-0.5 accent-pranay-red"
                  />
                  <span>{issue}</span>
                </label>
              ))}

              <button
                type="submit"
                disabled={!selectedIssue}
                className="w-full mt-4 py-3 rounded-xl bg-pranay-red disabled:opacity-40 hover:bg-pranay-redDark text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
              >
                Submit Bug Ticket
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-6">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3 animate-bounce" />
            <h4 className="text-lg font-display uppercase tracking-wider text-white">
              Ticket #404-ROAST Logged
            </h4>
            <p className="text-xs text-gray-300 mt-2 leading-relaxed">
              Your grievance has been safely routed to <strong>Janmesh Roida</strong>.
            </p>
            <p className="text-[11px] text-gray-500 mt-2 italic">
              Estimated resolution time: Next reincarnation.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

