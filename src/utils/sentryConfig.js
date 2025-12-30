// Configuration Sentry (optionnel)
let Sentry = null;

// Simuler Sentry si pas installé
const mockSentry = {
  init: () => {},
  captureException: (error) => console.error("Sentry Mock:", error),
  captureMessage: (message) => console.info("Sentry Mock:", message),
  addBreadcrumb: (breadcrumb) => console.log("Sentry Breadcrumb:", breadcrumb),
  setUser: (user) => console.log("Sentry User:", user),
  setTag: (key, value) => console.log("Sentry Tag:", key, value),
};

// Essayer d'importer Sentry
try {
  // Si Sentry est installé : npm install @sentry/react
  // Sentry = require('@sentry/react');

  // Pour l'instant, utiliser le mock
  Sentry = mockSentry;

  // Configuration Sentry
  if (Sentry.init) {
    Sentry.init({
      /* eslint-disable no-undef */
      dsn: process.env.REACT_APP_SENTRY_DSN || "mock-dsn",
      environment: process.env.NODE_ENV || "development",
      tracesSampleRate: 0.1,
      beforeSend: (event) => {
        // Filtrer les erreurs en développement
        if (process.env.NODE_ENV === "development") {
          console.log("Sentry Event:", event);
        }
        return event;
      },
      /* eslint-enable no-undef */
    });
  }
  // eslint-disable-next-line no-unused-vars
} catch (error) {
  // Fallback sur mock si Sentry pas disponible
  Sentry = mockSentry;
  console.log("Sentry not available, using mock");
}

export default Sentry;
