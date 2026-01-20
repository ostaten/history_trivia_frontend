import { Component, type ReactNode } from 'react';
import { Link } from '@tanstack/react-router';

type ErrorBoundaryProps = {
  children: ReactNode;
  fallback?: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
          <div className="max-w-2xl w-full text-center space-y-6">
            <h1 className="text-4xl font-bold text-primary mb-4">
              Something went wrong
            </h1>
            <div className="bg-surface border border-border rounded-lg p-6 space-y-4">
              <p className="text-text-secondary">
                An unexpected error occurred. Please try refreshing the page or
                return to the home page.
              </p>
              {this.state.error && (
                <details className="text-left">
                  <summary className="cursor-pointer text-text-secondary hover:text-text-primary mb-2">
                    Error details
                  </summary>
                  <pre className="bg-off-dark p-4 rounded text-sm text-text-muted overflow-auto">
                    {this.state.error.toString()}
                    {this.state.error.stack && (
                      <div className="mt-2 text-xs">
                        {this.state.error.stack}
                      </div>
                    )}
                  </pre>
                </details>
              )}
              <div className="flex gap-4 justify-center pt-4">
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 bg-primary text-off-dark font-semibold rounded-lg hover:bg-primary-bright transition-all duration-200 cursor-pointer"
                >
                  Refresh Page
                </button>
                <Link
                  to="/"
                  className="px-6 py-2 bg-surface-elevated border border-border text-text-primary font-semibold rounded-lg hover:bg-surface transition-all duration-200 cursor-pointer"
                >
                  Go Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
