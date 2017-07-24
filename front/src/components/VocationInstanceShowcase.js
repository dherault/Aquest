import React, { Component } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';

import DiskImage from './DiskImage';

class VocationInstanceShowcase extends Component {

  render() {
    const { isLeft, vocationInstance: { level, vocation: { label } } } = this.props;

    return (
      <div className={isLeft ? 'rxrc' : 'rlc'}>
        <DiskImage size="medium" />
        {label} {level}
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
    }
  }
`);
