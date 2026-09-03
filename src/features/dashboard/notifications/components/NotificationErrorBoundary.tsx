"use client";

import { Component, type ReactNode } from "react";
import { NotificationBell } from "./NotificationBell";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class NotificationErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <NotificationBell count={0} />;
    }
    return this.props.children;
  }
}

export { NotificationErrorBoundary };
