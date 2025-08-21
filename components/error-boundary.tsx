'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Check if it's a "Client has been destroyed" error
    if (error.message.includes('Client has been destroyed') || 
        error.message.includes('WrappedError')) {
      console.log('Detected client destruction error, attempting recovery...');
      
      // Try to recover by clearing any stale state
      try {
        if (typeof window !== 'undefined') {
          // Clear any problematic state
          localStorage.removeItem('problematic_state');
          sessionStorage.clear();
        }
      } catch (e) {
        console.error('Error during recovery attempt:', e);
      }
    }
    
    this.setState({
      error,
      errorInfo
    });
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleGoHome = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  public render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isClientDestroyedError = this.state.error?.message.includes('Client has been destroyed') ||
                                   this.state.error?.message.includes('WrappedError');

      return (
        <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full"
          >
            <div className="glass-enhanced rounded-2xl p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-16 h-16 bg-gradient-error rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <AlertTriangle className="w-8 h-8 text-white" />
              </motion.div>
              
              <h1 className="text-2xl font-bold text-white mb-4">
                {isClientDestroyedError ? 'Session Error' : 'Something went wrong'}
              </h1>
              
              <p className="text-gray-300 mb-6">
                {isClientDestroyedError 
                  ? 'Your session has expired or encountered an error. Please try again.'
                  : 'An unexpected error occurred. Please try refreshing the page.'
                }
              </p>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mb-6 text-left">
                  <summary className="text-sm text-gray-400 cursor-pointer mb-2">
                    Error Details (Development)
                  </summary>
                  <div className="bg-black/20 rounded-lg p-4 text-xs text-gray-300 font-mono overflow-auto max-h-32">
                    <div className="mb-2">
                      <strong>Error:</strong> {this.state.error.message}
                    </div>
                    {this.state.errorInfo && (
                      <div>
                        <strong>Stack:</strong>
                        <pre className="whitespace-pre-wrap mt-1">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={this.handleRetry}
                  className="flex-1 bg-gradient-button text-white px-6 py-3 rounded-xl font-medium hover-glow transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Try Again</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={this.handleGoHome}
                  className="flex-1 glass-button text-white px-6 py-3 rounded-xl font-medium hover-glow transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Home className="w-4 h-4" />
                  <span>Go Home</span>
                </motion.button>
              </div>

              {isClientDestroyedError && (
                <div className="mt-6 p-4 bg-gradient-warning/20 rounded-lg">
                  <p className="text-sm text-yellow-300">
                    💡 <strong>Tip:</strong> If this error persists, try clearing your browser cache and cookies.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook for functional components
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Global error caught:', event.error);
      
      // Check if it's a client destruction error
      if (event.error?.message?.includes('Client has been destroyed') ||
          event.error?.message?.includes('WrappedError')) {
        console.log('Detected client destruction error in global handler');
        
        // Try to recover
        try {
          if (typeof window !== 'undefined') {
            // Clear problematic state
            localStorage.removeItem('problematic_state');
            sessionStorage.clear();
            
            // Reload the page after a short delay
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }
        } catch (e) {
          console.error('Error during global recovery:', e);
        }
      }
      
      setError(event.error);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      
      if (event.reason?.message?.includes('Client has been destroyed') ||
          event.reason?.message?.includes('WrappedError')) {
        console.log('Detected client destruction error in promise rejection');
        
        // Try to recover
        try {
          if (typeof window !== 'undefined') {
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }
        } catch (e) {
          console.error('Error during promise rejection recovery:', e);
        }
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return error;
} 