'use strict';

var React = require('react-native');

var {
    StyleSheet
} = React;

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#E6E2E3",
    },
    
    header: {
        flexDirection: "row",
        paddingTop: 20,
        borderBottomWidth: 0.5,
        borderColor: "#CECECE",
        backgroundColor: "#F9F9F9",
    },
    titleWrapper: {
        flex:1,
        alignItems: 'center',
    },
    titleText: {
        color: "#444444",
        fontSize: 18,
        fontWeight: "300",
        padding:10,
    },
    closeButton: {
        position: 'absolute',
        right: 0,
    },
    closeIcon: {
        paddingTop: 2,
        width: 36, 
        height: 36, 
    },

    footer: {
        flexDirection: 'row',
        height: 40,
    },
    reset: {
        flex: 33,
        alignItems: 'center',
        backgroundColor: "#27384C",
    },
    submit: {
        flex: 67,
        alignItems: 'center',
        backgroundColor: "#E9573E",
    },
    footerText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "300",
        padding:12,
    },

    body: {
        flex:1,
        flexDirection: 'row'
    },
    categoryWraper: {
        flex: 33,
        backgroundColor: "#F3F3F3",
    },
    optionWrapper: {
        flex: 67,
        backgroundColor: "#FFFFFF",
    },
    itemWrapper: {
        flex:1,
    },

    item: {
        height: 37,
        borderBottomWidth: 1,
        borderColor: "#D7D5D8"
    },
    categoryItem: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    optionItem: {
        marginLeft:13,
        marginRight: 13,
        alignItems: 'center',
        flexDirection: 'row'
    },

    itemTextWraper: {
        flex:1,
        alignItems: 'center'
    },

    itemText: {
        color: "#75787F",
        fontSize: 16,
        fontWeight: "300",
    },

    checkIcon: {
        paddingRight: 5,
        color: "#FFFFFF"
    },
    categorySelected: {
        backgroundColor: "#FFFFFF",
    },

    optionSelected: {
        color: "#E9573E",
    },
    filterPickerItem: {
        justifyContent: 'center', 
        alignItems: 'center',
    },
    
});

module.exports = styles;
