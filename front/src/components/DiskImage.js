import React from 'react';
import { Link } from 'react-router-dom';

const sizes = {
  small: 36,
  medium: 48,
  large: 156,
};

const DiskImage = ({ size = 'small', src, linkTo, className, style = {} }) => {

  const sizePx = sizes[size];

  const elProps = {
    style: {
      width: sizePx,
      height: sizePx,
      borderRadius: sizePx / 2,
      backgroundColor: 'LightGrey',
      backgroundImage: src ? `url(${src})` : null,
      backgroundPosition: 'center',
      backgroundSize: '100% auto',
      backgroundRepeat: 'no-repeat',
      ...style,
    },
  };

  if (!linkTo) elProps.className = className;

  const el = <div {...elProps} />;

  return linkTo ? <Link to={linkTo} className={className}>{el}</Link> : el;
};

export default DiskImage;
