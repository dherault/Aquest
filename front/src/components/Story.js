import React from 'react';
import moment from 'moment';
import { createFragmentContainer, graphql } from 'react-relay';

import DiskImage from './DiskImage';

const sLayout = {
  backgroundColor: 'white',
  width: '40vw',
  // maxWidth: '100vw',
  padding: '1rem',
  boxShadow: '0px 3px 10px 0px rgba(0,0,0,0.50)',
};

const Layout = ({ children }) => (
  <article className="rlt" style={sLayout}>
    {children}
  </article>
);

const sLayoutLeft = {
  marginRight: '1rem',
};

const LayoutLeft = ({ children }) => (
  <div style={sLayoutLeft}>
    {children}
  </div>
);

const sLayoutRight = {
  flexGrow: 1,
  // marginTop: '-0.5rem',
  // marginBottom: '-0.6rem',
};

const LayoutRight = ({ children }) => (
  <div style={sLayoutRight}>
    {children}
  </div>
);

const sLayoutHeader = {
  marginBottom: '0.5rem',
};

const LayoutHeader = ({ children }) => (
  <div style={sLayoutHeader} className="has-black-color">
    {children}
  </div>
);

const sLayoutContent = {
  flexGrow: 1,
};

const LayoutContent = ({ children }) => (
  <div style={sLayoutContent} className="has-full-width has-black-color">
    {children}
  </div>
);

const Story = ({ story }) => (
  <Layout>

    <LayoutLeft>
      <DiskImage />
    </LayoutLeft>

    <LayoutRight>

      <LayoutHeader>
        <strong>{story.vocation.label}</strong>
        <em className="has-grey-color" style={{ margin: '0 1rem' }}>
          <small>
            {moment(story.createdAt).fromNow()}
          </small>
        </em>
        {story.hasLeveledUp && (
          <small className="has-grey-color">
            lvl {story.vocationInstanceLevel} → {story.vocationInstanceLevel + 1} 🎉
          </small>
        )}

      </LayoutHeader>

      <LayoutContent>
        {story.label}
      </LayoutContent>

    </LayoutRight>
  </Layout>
);

const StoryContainer = createFragmentContainer(Story, graphql`
  fragment Story_story on Story {
    id
    label
    hasLeveledUp
    vocationInstanceLevel
    createdAt
    sourceUser {
      id
      pseudo
    }
    vocation {
      id
      label
    }
  }
`);

Object.assign(StoryContainer, {
  Layout,
  LayoutLeft,
  LayoutRight,
  LayoutHeader,
  LayoutContent,
});

export default StoryContainer;
