import React from 'react';
import { Link } from 'react-router-dom';

const sizes = {
  small: 40,
  medium: 80,
  large: 160,
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
      minWidth: sizePx,
      minHeight: sizePx,
      borderRadius: sizePx / 2,
      cursor: onClick ? 'pointer' : 'inherit',
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
