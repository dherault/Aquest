import React, { Component } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import './User.css';

class User extends Component {
  render() {
    const { user } = this.props;

    if (!user) return console.log('no User props') || null;

    return (
      <div className="User">
        <img className="User-picture" alt="" src={user.pictureUrl} />

        <h1>{user.fisrtName} {user.lastName}</h1>

        <p className="User-intro">
          {user.intro}
        </p>

        <h2>Skill list</h2>
        <ul>
          {user.acquiredSkills.edges.map(({ node }) => node.label)}
        </ul>
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
    acquiredSkills(
      first: 2147483647  # max GraphQLInt
    ) @connection(key: "User_acquiredSkills") {
      edges {
        node {
          id
          label
        }
      }
    }
  }
`);
