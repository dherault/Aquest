import React, { Component } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';

import DiskImage from './DiskImage';

class VocationInstanceShowcase extends Component {

  render() {
    const { isLeft, vocationInstance: { level, vocation: { userLabel, label } } } = this.props;

    return (
      <div className={isLeft ? 'rxrc' : 'rlc'} style={{ margin: '1rem 0px' }}>
        <DiskImage size="medium" style={{ [`margin${isLeft ? 'Left' : 'Right'}`]: '1rem' }} />
        <strong>{userLabel || label} level {level}</strong>
      </div>
    );
  }
}

export default createFragmentContainer(VocationInstanceShowcase, graphql`
  fragment VocationInstanceShowcase_vocationInstance on VocationInstance {
    id
    level
    vocation {
      id
      label
      userLabel
    }
  }
`);
