import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Application error boundary caught an error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="app-error-shell">
          <div className="app-error-card glass-card">
            <h1>Something went wrong</h1>
            <p>The app hit an unexpected error. Reload to try again.</p>
            <button type="button" className="ghost-btn" onClick={this.handleReload}>
              Reload App
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
