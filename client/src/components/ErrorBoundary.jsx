import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>
          <h2 style={{ color: '#e94560' }}>Something went wrong.</h2>
          <button
            style={{ marginTop: '1rem', padding: '0.6rem 1.2rem', background: '#e94560', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
            onClick={() => this.setState({ hasError: false })}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
