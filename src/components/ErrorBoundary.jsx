import React from 'react';
import clientLogger from '../utils/clientLogger';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Mettre à jour l'état pour afficher l'UI d'erreur
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Logger l'erreur React
        clientLogger.error('React Error Boundary', {
            error: error.toString(),
            stack: error.stack,
            componentStack: errorInfo.componentStack
        });

        this.setState({
            error,
            errorInfo
        });
    }

    render() {
        if (this.state.hasError) {
            // UI d'erreur personnalisée
            return (
                <div style={{
                    padding: '20px',
                    margin: '20px',
                    border: '1px solid #ff6b6b',
                    borderRadius: '5px',
                    backgroundColor: '#ffe6e6'
                }}>
                    <h2>Une erreur s'est produite</h2>
                    <p>Nous nous excusons pour la gêne occasionnée. Veuillez rafraîchir la page.</p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        Rafraîchir la page
                    </button>
                    {process.env.NODE_ENV === 'development' && (
                        <details style={{ marginTop: '20px' }}>
                            <summary>Détails de l'erreur (développement)</summary>
                            <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}>
                                {this.state.error && this.state.error.toString()}
                                <br />
                                {this.state.errorInfo.componentStack}
                            </pre>
                        </details>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;