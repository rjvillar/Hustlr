import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#f7f6fb] flex items-center justify-center px-4">
          <div className="max-w-md mx-auto text-center">
            <h2 className="text-2xl font-bold text-[#193948] mb-4">
              Something went wrong
            </h2>
            <p className="text-[#193948]/70 mb-6">
              We encountered an error. Please refresh the page to try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-[#FCDC73] text-[#193948] font-medium rounded-2xl hover:bg-[#f4d861] transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
