import React from 'react';
import { Link } from 'react-router-dom';

const sizes = {
  small: 36,
  medium: 64,
  large: 156,
};

const DiskImage = ({
  size = 'small',
  src,
  linkTo,
  onClick,
  className,
  style,
}) => {

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
  if (typeof onClick === 'function') elProps.onClick = onClick;

  const el = <div {...elProps} />;

  return linkTo ? <Link to={linkTo} className={className}>{el}</Link> : el;
};

DiskImage.sizes = sizes;

export default DiskImage;
