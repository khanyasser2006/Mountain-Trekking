import React from 'react';
import { ShieldAlert, RefreshCw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ZENITH Error Boundary caught an unhandled error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#00222C] text-[#E0E5E9] flex flex-col items-center justify-center p-6 select-none font-sans">
          <div className="bg-[#002B38] border border-mist/20 p-10 sm:p-14 max-w-lg w-full text-center shadow-2xl">
            <ShieldAlert className="w-14 h-14 text-amber-400 mx-auto mb-4" />
            <span className="font-display text-xs text-mist font-bold tracking-widest uppercase block mb-1">
              SYSTEM RECOVERY
            </span>
            <h1 className="font-cursive text-6xl text-mist-pure mb-4 leading-none">
              Interface Restored
            </h1>
            <p className="font-sans text-xs text-mist-muted leading-relaxed mb-6 font-light">
              An unexpected render issue was safely caught. You can reload the current view or return to the main expedition home page.
            </p>
            {this.state.error?.message && (
              <div className="bg-[#00171F] p-4 border border-mist/10 text-xs font-mono text-amber-300/80 text-left mb-6 overflow-x-auto max-h-32">
                {this.state.error.message}
              </div>
            )}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={this.handleReload}
                className="flex-1 py-3.5 bg-[#004E64] hover:bg-[#003646] text-[#F4F7F9] font-sans font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Page</span>
              </button>
              <button
                type="button"
                onClick={this.handleGoHome}
                className="flex-1 py-3.5 border border-mist/20 hover:border-mist text-mist hover:text-mist-pure font-sans font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Home className="w-4 h-4" />
                <span>Home Page</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
