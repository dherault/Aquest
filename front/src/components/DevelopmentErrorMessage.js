import React from 'react';

const DevelopmentErrorMessage = ({ error }) => {
  if (process.env.NODE_ENV === 'production' || !error) return null;

  return (
    <pre>
      {error.stack}
      {!!error.source && (
        <span>
          <br />Source:<br />
          {JSON.stringify(error.source, null, 2)}
        </span>
      )}
    </pre>
  );
};

export default DevelopmentErrorMessage;
