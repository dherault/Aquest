import './User.css';
import React, { Component } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';

class User extends Component {
  render() {
    const { user } = this.props;

    if (!user) return console.log('no User props') || null;

    return (
      <div className="User">
        <h1>User</h1>
        <img className="User-picture" alt="" src={user.pictureUrl} />

        <h1>{user.fisrtName} {user.lastName}</h1>

        <p className="User-intro">
          {user.intro}
        </p>

      </div>
    );
  }
}

export default createFragmentContainer(User, graphql`
  fragment User_user on Person {
    firstName
    lastName
    intro
    pictureUrl
  }
`);
