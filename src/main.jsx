import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

// Redux
import store from "./app/store.js";
import { Provider } from "react-redux";

// React Query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Créer le client React Query
const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </Provider>
    </ErrorBoundary>
  </StrictMode>
);
