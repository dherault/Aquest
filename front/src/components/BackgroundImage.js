import React from 'react';

const BackgroundImage = ({ src, children }) => (
  <div style={{
    backgroundColor: 'LightGrey',
    backgroundImage: src ? `url(${src})` : null,
    backgroundPosition: 'center',
    backgroundSize: '100% auto',
    backgroundRepeat: 'no-repeat',
    height: '100vh',
    overflowY: 'auto',
    overflowX: 'hidden',
  }}>
      {children}
  </div>
);

export default BackgroundImage;
