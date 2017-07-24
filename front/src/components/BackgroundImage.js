import React from 'react';

const BackgroundImage = ({ src, children }) => (
  <div
    className="cct"
    style={{
      backgroundColor: 'LightGrey',
      backgroundImage: src ? `url(${src})` : null,
      backgroundPosition: 'center',
      backgroundSize: '100% auto',
      backgroundRepeat: 'no-repeat',
      height: '100vh',
      overflowY: 'auto',
      overflowX: 'hidden',
    }}
  >
    {children}
  </div>
);

BackgroundImage.Content = ({ children }) => (
  <div className="has-full-width" style={{ flexGrow: 1 }}>
    {children}
  </div>
);

export default BackgroundImage;
