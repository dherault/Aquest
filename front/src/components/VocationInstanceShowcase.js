import React, { Component } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';

import DiskImage from './DiskImage';

class VocationInstanceShowcase extends Component {

  render() {
    const { isLeft, vocationInstance: { level, vocation: { userLabel, label } } } = this.props;

    return (
      <div className={isLeft ? 'rxrc' : 'rlc'} style={{ margin: '1.5rem 0px' }}>
        <DiskImage size="medium" />
        {userLabel || label} level {level}
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