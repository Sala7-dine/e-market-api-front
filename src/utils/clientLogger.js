import Sentry from './sentryConfig';

// Format commun pour tous les logs
const createLogEntry = (level, message, data = null) => ({
  timestamp: new Date().toISOString(),
  level: level.toUpperCase(),
  message,
  data,
  url: window.location.href,
  userAgent: navigator.userAgent.substring(0, 100)
});

class ClientLogger {
  constructor() {
    this.logs = [];
    this.maxLogs = 100;
    this.setupErrorCapture();
  }

  // Logger les erreurs front
  error(message, data) {
    const logEntry = createLogEntry('error', message, data);
    this.addLog(logEntry);
    console.error(`[ERROR] ${message}`, data);
    
    // Envoyer à Sentry
    if (data && data.stack) {
      Sentry.captureException(new Error(message));
    } else {
      Sentry.captureMessage(message, 'error');
    }
  }

  warn(message, data) {
    const logEntry = createLogEntry('warn', message, data);
    this.addLog(logEntry);
    console.warn(`[WARN] ${message}`, data);
  }

  info(message, data) {
    const logEntry = createLogEntry('info', message, data);
    this.addLog(logEntry);
    console.info(`[INFO] ${message}`, data);
  }

  addLog(logEntry) {
    this.logs.unshift(logEntry);
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }
  }

  // Capture automatique des erreurs
  setupErrorCapture() {
    // Erreurs JavaScript globales
    window.addEventListener('error', (event) => {
      const errorData = {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      };
      
      this.error('JavaScript Error', errorData);
      
      // Sentry breadcrumb
      Sentry.addBreadcrumb({
        message: 'JavaScript Error',
        level: 'error',
        data: errorData
      });
    });

    // Promesses rejetées
    window.addEventListener('unhandledrejection', (event) => {
      const errorData = {
        reason: event.reason?.toString() || 'Unknown',
        stack: event.reason?.stack
      };
      
      this.error('Unhandled Promise Rejection', errorData);
      
      // Sentry
      Sentry.captureException(event.reason);
    });
  }

  getLogs() {
    return this.logs;
  }

  clearLogs() {
    this.logs = [];
  }
}

export default new ClientLogger();