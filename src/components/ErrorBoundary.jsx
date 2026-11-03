import React from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("PRANAYFLIX Error Boundary caught an error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.href = window.location.pathname;
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0b0b0f] text-white flex flex-col items-center justify-center p-6 text-center select-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-pranay-red/15 via-transparent to-black pointer-events-none" />

          <div className="relative z-10 max-w-md w-full p-8 rounded-2xl bg-[#14141e] border border-white/10 shadow-2xl">
            <span className="pranayflix-logo text-3xl font-display tracking-widest block mb-4">
              PRANAYFLIX
            </span>

            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-4 text-amber-400">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h2 className="text-xl font-display uppercase tracking-wider text-white mb-2">
              Minor Glitch in Season 20
            </h2>

            <p className="text-xs text-gray-300 leading-relaxed mb-6">
              Even high-budget original productions hit a bump. Don't worry, your progress and birthday surprises are completely safe.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={this.handleReload}
                className="w-full py-3 px-4 rounded-xl bg-pranay-red hover:bg-pranay-redDark text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow-red transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Resume Playback (Reload)</span>
              </button>

              <button
                onClick={this.handleReset}
                className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Back to Homepage</span>
              </button>
            </div>

            {this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-[10px] text-gray-400 cursor-pointer hover:text-gray-300">
                  Technical Diagnostic Details
                </summary>
                <pre className="mt-2 p-3 rounded-lg bg-black/60 text-[10px] font-mono text-red-300/80 overflow-x-auto whitespace-pre-wrap">
                  {String(this.state.error.message || this.state.error)}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

