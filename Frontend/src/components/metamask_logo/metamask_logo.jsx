import React, { Component } from "react";
import ModelViewer from "@metamask/logo";

class MetamaskLogo extends Component {
  componentDidMount() {
    this.initModelViewer();
  }

  componentDidUpdate() {
    // If component re-renders, destroy and reinitialize the viewer
    this.destroyModelViewer();
    this.initModelViewer();
  }

  componentWillUnmount() {
    this.destroyModelViewer();
  }

  initModelViewer() {
    this.viewer = ModelViewer({
      pxNotRatio: true,
      width: 200,
      height: 200,
      followMouse: true,
    });

    this.el.appendChild(this.viewer.container);
    this.viewer.startAnimation();
  }

  destroyModelViewer() {
    if (this.viewer) {
      this.viewer.stopAnimation();
      this.el.removeChild(this.viewer.container);
    }
  }

  render() {
    return (
      <div
        className="flex justify-center mx-auto h-52 w-72"
        ref={(el) => (this.el = el)}
      />
    );
  }
}

export default MetamaskLogo;
