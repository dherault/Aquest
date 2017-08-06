import React, { Component } from 'react';

function castActor(Actor) {
  let that;

  class CastActor extends Component {
    constructor() {
      super();
      that = this;

      this.state = {
        style: {
          opacity: 0,
          transition: 'opacity 1s linear',
        },
        mounted: false,
        props: null,
      };
    }

    render() {
      const { mounted, style, props } = this.state;

      if (!mounted) return null;

      return (
        <div style={style}>
          <Actor {...props} />
        </div>
      );
    }
  }

  return {
    element: <CastActor />,
    mount: () => new Promise(_ => that.setState({ mounted: true }, _)),
    unmount: () => new Promise(_ => that.setState({ mounted: false }, _)),
    setStyle: style => new Promise(_ => that.setState({ style: { ...that.state.style, ...style } }, _)),
    show: () => that.setStyle({ opacity: 1 }),
  };
}

export default castActor;
