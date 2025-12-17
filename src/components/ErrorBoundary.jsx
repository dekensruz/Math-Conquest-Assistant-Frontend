import React from 'react'

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, error: null, errorInfo: null }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true }
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo)
        this.setState({ error, errorInfo })
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                    <div className="bg-white p-8 rounded-xl shadow-xl max-w-lg w-full border border-red-100">
                        <div className="flex items-center gap-3 mb-4 text-red-600">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <h2 className="text-2xl font-bold">Une erreur est survenue</h2>
                        </div>

                        <p className="text-gray-600 mb-6">
                            L'application a rencontré un problème inattendu. Veuillez rafraîchir la page.
                        </p>

                        {this.state.error && (
                            <div className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-40 mb-6 border border-gray-200">
                                <code className="text-xs text-red-500 font-mono block mb-2">
                                    {this.state.error.toString()}
                                </code>
                                <details className="text-xs text-gray-500">
                                    <summary className="cursor-pointer hover:text-gray-700">Détails techniques</summary>
                                    <pre className="mt-2 whitespace-pre-wrap">
                                        {this.state.errorInfo && this.state.errorInfo.componentStack}
                                    </pre>
                                </details>
                            </div>
                        )}

                        <button
                            onClick={() => window.location.reload()}
                            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors shadow-lg shadow-red-500/30"
                        >
                            Rafraîchir l'application
                        </button>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary
