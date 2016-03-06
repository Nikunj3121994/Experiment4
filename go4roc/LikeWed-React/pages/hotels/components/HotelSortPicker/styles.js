'use strict';

var React = require('react-native');

var {
    StyleSheet
} = React;

var styles = StyleSheet.create({
    sortPicker: {
        height: 282,
        backgroundColor: "#E6E2E3",
        alignSelf: "flex-end"
    },
    sortPickerRow: {
        justifyContent: 'center', 
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: "#D7D5D8"
    },
    sortPickerTitle: {
        color: "#9C9DA1",
        fontSize: 16,
        fontWeight: "300",
        padding:15,
    },
    sortPickerText: {
        color: "#75787F",
        fontSize: 16,
        fontWeight: "300",
        padding:15,
    },
});

module.exports = styles;
