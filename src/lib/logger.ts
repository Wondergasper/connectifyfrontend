// src/lib/logger.ts
interface LogData {
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  timestamp: string;
  context?: string;
  meta?: Record<string, unknown>;
}

class Logger {
  private readonly isProduction: boolean;

  constructor() {
    this.isProduction = import.meta.env.PROD || false;
  }

  private formatMessage(data: LogData): string {
    const { level, message, timestamp, context, meta } = data;
    const formatted = `[${timestamp}] ${level.toUpperCase()} ${context ? `[${context}] ` : ''}${message}`;

    if (meta && Object.keys(meta).length > 0) {
      return `${formatted} ${JSON.stringify(meta)}`;
    }

    return formatted;
  }

  private log(data: LogData): void {
    if (!this.isProduction) {
      // In development, use console with colors
      const colorMap = {
        debug: '\x1b[36m', // Cyan
        info: '\x1b[32m',  // Green
        warn: '\x1b[33m',  // Yellow
        error: '\x1b[31m'  // Red
      };

      const resetColor = '\x1b[0m';
      const coloredMessage = `${colorMap[data.level]}${this.formatMessage(data)}${resetColor}`;

      switch (data.level) {
        case 'debug':
        case 'info':
          console.log(coloredMessage);
          break;
        case 'warn':
          console.warn(coloredMessage);
          break;
        case 'error':
          console.error(coloredMessage);
          break;
      }
    } else {
      // In production, send logs to external service or save to a file
      // For now, we'll just log to console, but in a real application you would
      // send to a service like Sentry, LogRocket, etc.
      console.log(this.formatMessage(data));

      // Example of sending to an external service:
      // this.sendToExternalService(data);
    }
  }

  private sendToExternalService(data: LogData): void {
    // In a real application, you would send logs to an external service
    // Example with fetch:
    /*
    fetch('/api/logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).catch(err => {
      console.error('Failed to send log to external service:', err);
    });
    */
  }

  debug(message: string, context?: string, meta?: Record<string, unknown>): void {
    this.log({
      level: 'debug',
      message,
      timestamp: new Date().toISOString(),
      context,
      meta,
    });
  }

  info(message: string, context?: string, meta?: Record<string, unknown>): void {
    this.log({
      level: 'info',
      message,
      timestamp: new Date().toISOString(),
      context,
      meta,
    });
  }

  warn(message: string, context?: string, meta?: Record<string, unknown>): void {
    this.log({
      level: 'warn',
      message,
      timestamp: new Date().toISOString(),
      context,
      meta,
    });
  }

  error(error: Error | string, context?: string, meta?: Record<string, unknown>): void {
    const message = typeof error === 'string' ? error : error.message;
    const stack = typeof error !== 'string' ? error.stack : undefined;

    this.log({
      level: 'error',
      message,
      timestamp: new Date().toISOString(),
      context,
      meta: {
        ...meta,
        stack,
      },
    });
  }
}

export const logger = new Logger();