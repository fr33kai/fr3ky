import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: '',
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.state.errorMessage.includes("Symbol() could not be cloned")) {
        return (
          <div className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Oops, something went wrong</h1>
            <p>We encountered an error while processing data. This might be due to unsupported data types. Please try refreshing the page or using different input.</p>
          </div>
        );
      }
      return (
        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Oops, something went wrong</h1>
          <p>We're sorry, but an error occurred. Please try refreshing the page or contact support if the problem persists.</p>
          <p className="mt-4 text-red-600">{this.state.errorMessage}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;