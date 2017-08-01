import React, { Component } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';

import DiskImage from './DiskImage';

class VocationInstanceShowcase extends Component {

  render() {
    const { isLeft, isDimmed, onDiskImageClick, vocationInstance: { level, vocation: { userLabel, label } } } = this.props;

    return (
      <div className={isLeft ? 'x69' : 'x4'} style={{ margin: '1rem 0px' }}>
        <DiskImage
          size="medium"
          onClick={onDiskImageClick}
          style={{ [`margin${isLeft ? 'Left' : 'Right'}`]: '1rem' }}
        />
      <strong style={{ color: isDimmed ? 'LightGrey' : 'inherit' }}>{userLabel || label} level {level}</strong>
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
