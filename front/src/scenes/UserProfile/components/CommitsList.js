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
    const { viewer } = this.props;

    if (!viewer) return null;

    return (
      <div className="container">
        {viewer.commits.edges.map(e => this.renderCommit(e.node))}
        <button onClick={() => this.loadMore()}>Load more</button>
      </div>
    );
  }
}

export default createPaginationContainer(
  CommitsList,
  {
    viewer: graphql`
      fragment CommitsList_viewer on User {
        id
        commits(
          first: $count
          after: $cursor
        ) @connection(key: "viewer_commits") {
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
      return props.viewer && props.viewer.commits;
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
        viewer {
          ...CommitsList_viewer
        }
      }
    `,
  }
);
