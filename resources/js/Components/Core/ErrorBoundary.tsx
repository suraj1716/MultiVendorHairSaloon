import React from "react";
import ErrorPage from "@/Pages/ErrorPage";



interface State {
  hasError: boolean;
  error?: Error;
  componentStack?: string;
}



export class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, State> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

componentDidCatch(error: Error & { componentStack?: string }, errorInfo: React.ErrorInfo) {
  console.error("React error caught by ErrorBoundary:", error, errorInfo);

  // Grab stack from errorInfo OR error (depending on where it's available)
  const stack = errorInfo.componentStack || (error as any).componentStack || "No component stack available";

  this.setState({
    hasError: true,
    error,
    componentStack: stack,
  });
}




render() {
  if (this.state.hasError) {
    return (
      <ErrorPage
        statusCode={500}
        message={this.state.error?.message || "Something went wrong."}
        componentStack={this.state.componentStack}
      />
    );
  }

  return this.props.children;
}


}
