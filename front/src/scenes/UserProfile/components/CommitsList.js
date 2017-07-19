import React, { Component } from 'react';
import { createPaginationContainer, graphql } from 'react-relay';
import moment from 'moment';

class CommitsList extends Component {

  loadMore() {
    if (!this.props.relay.hasMore() || this.props.relay.isLoading()) return;

    this.props.relay.loadMore(
      10, // Fetch the next 10 feed items
      e => {
        console.log(e);
      },
    );
  }

  renderCommit(node) {
    return (
      <div className="box" key={node.id}>
        <article className="media">
          <div className="media-content">
            <div className="content">
              <p>
                <strong>{node.skill.label}</strong> <small>{moment(node.createdAt).fromNow()}</small>
                <br />
                {node.label}
              </p>
            </div>
          </div>
        </article>
      </div>
    );
  }

  render() {
    const { user } = this.props;

    if (!user) return null;
    
    return (
      <div className="container">
        {user.commits.edges.map(e => this.renderCommit(e.node))}
        <button onClick={() => this.loadMore()}>Load more</button>
      </div>
    );
  }
}

export default createPaginationContainer(
  CommitsList,
  {
    user: graphql`
      fragment CommitsList_user on Person {
        id
        commits(
          first: $count
          after: $cursor
        ) @connection(key: "user_commits") {
          edges {
            node {
              id
              label
              createdAt
              skill {
                id
                label
              }
            }
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    `,
  },
  {
    direction: 'forward',
    getConnectionFromProps(props) {
      return props.user && props.user.commits;
    },
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount,
      };
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        // in most cases, for variables other than connection filters like
        // `first`, `after`, etc. you may want to use the previous values.
        // orderBy: fragmentVariables.orderBy,
      };
    },
    query: graphql`
      query CommitsListPaginationQuery(
        $count: Int!
        $cursor: String
      ) {
        user {
          ...CommitsList_user
        }
      }
    `,
  }
);
