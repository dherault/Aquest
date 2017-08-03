import React from 'react';
import { Link } from 'react-router-dom';

const Button = ({
  disabled = false,
  linkTo,
  label = 'ok',
  onClick = null,
}) => {

  const handleClick = e => {
    if (!onClick || disabled) return;

    onClick(e);
  };

  const button = (
    <button
      disabled={disabled}
      onClick={handleClick}
    >
      {label}
    </button>
  );

  return linkTo && !disabled ? <Link to={linkTo}>{button}</Link> : button;
};

export default Button;
