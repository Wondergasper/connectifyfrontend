import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error | null; reset: () => void }>;
  name?: string; // For better logging
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: undefined };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`[ErrorBoundary:${this.props.name || 'Global'}] caught error:`, error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error || null} reset={this.reset} />;
    }

    return this.props.children;
  }
}

const DefaultErrorFallback: React.ComponentType<{ error: Error | null; reset: () => void }> = ({ error, reset }) => {
  const isFullPage = !window.location.pathname.includes('/widget'); // Simple heuristic

  if (isFullPage) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6 animate-in fade-in duration-500">
        <div className="text-center max-w-md w-full bg-card p-8 rounded-[2rem] border border-border shadow-strong">
          <div className="mx-auto w-20 h-20 bg-destructive/10 rounded-2xl flex items-center justify-center text-destructive mb-6 shadow-soft">
            <AlertTriangle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">Something went wrong</h2>
          <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
            {error?.message || 'An unexpected application error occurred. We have been notified and are looking into it.'}
          </p>
          <div className="flex flex-col gap-3">
            <Button
              onClick={reset}
              className="h-12 w-full gradient-primary border-0 font-bold shadow-glow"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button
              variant="ghost"
              onClick={() => window.location.href = '/'}
              className="h-12 w-full font-bold"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 border-2 border-dashed border-destructive/30 rounded-2xl bg-destructive/5 text-center space-y-3">
      <AlertTriangle className="w-6 h-6 text-destructive mx-auto" />
      <p className="text-xs font-bold text-destructive uppercase tracking-widest">Component Error</p>
      <p className="text-sm text-muted-foreground px-4">{error?.message || 'Load failed'}</p>
      <Button variant="outline" size="sm" onClick={reset} className="h-8 border-destructive/20 text-destructive hover:bg-destructive/10">
        Retry
      </Button>
    </div>
  );
};

export default ErrorBoundary;