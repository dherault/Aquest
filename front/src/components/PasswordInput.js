import React, { Component } from 'react';

class PasswordInput extends Component {

  state = { visible: false }

  render() {
    const { visible } = this.state;

    return (
      <div className="x4 has-flex-grow">
        <input
          type={visible ? 'text' : 'password'}
          className="has-flex-grow"
          {...this.props}
        />
        {!!this.props.value && (
          <i
            className={`has-left-margin has-cursor-pointer fa fa-eye${visible ? '-slash' : ''}`}
            role="button"
            tabIndex={0}
            onClick={() => this.setState({ visible: !visible })}
          />
        )}
      </div>
    );
  }
}

export default PasswordInput;
