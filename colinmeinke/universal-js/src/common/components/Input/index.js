/* @flow */

import React, { PropTypes } from 'react';

import baseStyles from './base.css';
import themeStyles from './oaxaca-theme.css';

const propTypes = {
  defaultValue: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

interface t {
target:?s;
}

interface s {
    value:string;
}

const Input = ({ defaultValue, name, onChange, placeholder }) => {
  let debounce;

  const onChangeWithDebounce = (e:t) => {
    clearTimeout( debounce );
    debounce = setTimeout(() => {
      onChange( e.target.value );
    }, 500 );
  };

  return (
    <input
      className={[
        baseStyles.regular,
        themeStyles.regular,
      ].join( ' ' )}
      defaultValue={ defaultValue }
      name={ name }
      onChange={ onChangeWithDebounce }
      placeholder={ placeholder }
    />
  );
};

Input.propTypes = propTypes;

export default Input;
