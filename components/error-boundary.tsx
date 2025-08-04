'use client';

import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error }>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Check if it's a MobX error - if so, don't set error state
    if (this.isMobXError(error)) {
      return { hasError: false };
    }
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  private static isMobXError(error: Error): boolean {
    const message = error.message || '';
    return message.includes('mobx-state-tree') || 
           message.includes('AnonymousModel') ||
           message.includes('tabStates') ||
           message.includes('injectionLifecycle') ||
           message.includes('sw.js');
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Don't log MobX errors at all
    if (ErrorBoundary.isMobXError(error)) {
      return;
    }
    
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Check if it's a MobX error
      if (this.state.error && ErrorBoundary.isMobXError(this.state.error)) {
        // For MobX errors, just render children normally
        return this.props.children;
      }

      // For other errors, show fallback
      if (this.props.fallback) {
        return <this.props.fallback error={this.state.error!} />;
      }

      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <h2 className="text-red-800 font-semibold">Something went wrong</h2>
          <p className="text-red-600 mt-2">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 