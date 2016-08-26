"use strict";
var react_1 = require('react');
var propTypes = {
    defaultValue: react_1.PropTypes.string,
    name: react_1.PropTypes.string,
    onChange: react_1.PropTypes.func.isRequired,
    placeholder: react_1.PropTypes.string
};
var Input = function (_a) {
    var defaultValue = _a.defaultValue, name = _a.name, onChange = _a.onChange, placeholder = _a.placeholder;
    var debounce;
    var onChangeWithDebounce = function (e) {
        clearTimeout(debounce);
        debounce = setTimeout(function () {
            onChange(e.target.value);
        }, 500);
    };
    return (' ');
};
Input.propTypes = propTypes;
exports.__esModule = true;
exports["default"] = Input;
