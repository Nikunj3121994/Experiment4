'use strict';

var React = require('react-native');

var {
    StyleSheet
} = React;


var styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#F0EFF5'
    },
    navbarCenter: {
        flex:1,
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 4.5,
        paddingBottom: 4.5
    },
    navbarTitle: {
        fontSize: 16,
        fontWeight: "400",
        color: "#696C75"
    },
    navbarSubTitle: {
        marginTop: 1.5,
        fontSize: 10,
        fontWeight: "200",
        color: "#A9B3BC"
    },
    filterbar: {
        flexDirection: 'row',
        backgroundColor: "#FFFFFF",
        height: 40,
        padding: 10,
        borderBottomWidth: 1,
        borderColor: "#D4D4D4"
    },
    filterbarItem: {
        flex: 1, 
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    filterbarLabel: {
        fontSize: 14,
        fontWeight: "300",
        color: "#727272"
    },
    listContainer: {
        flex:1,
        backgroundColor: '#FFFFFF'
    },
    listItems: {

    },
    listLoading: {

    },

    listFooter: {

    },
    separatorColor: {
        backgroundColor: "#D4D4D4"
    },
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
    filterPicker: {
        flex: 1,
        backgroundColor: "#E6E2E3",
        alignSelf: "flex-end"
    },
    filterPickerHeader: {
        flexDirection: "row",
        paddingTop: 20,
        borderBottomWidth: 1,
        borderColor: "#CECECE",
        backgroundColor: "#F9F9F9",
    },
    filterPickerTitleWrapper: {
        flex:1,
        alignItems: 'center',
    },
    filterPickerTitle: {
        color: "#444444",
        fontSize: 18,
        fontWeight: "300",
        padding:10,
    },
    filterPickerClose: {
        position: 'absolute',
        right: 0,
    },
    filterPickerCloseIcon: {
        paddingTop: 2,
        width: 36, 
        height: 36, 
        color: "#E9573E",
    },
    filterPickerFooter: {
        flexDirection: 'row',
        height: 38,
    },
    filterPickerClear: {
        flex: 33,
        alignItems: 'center',
        backgroundColor: "#27384C",
    },
    filterPickerSubmit: {
        flex: 67,
        alignItems: 'center',
        backgroundColor: "#E9573E",
    },
    filterPickerFooterText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "300",
        padding:12,
    },
    filterPickerBody: {
        flex:1,
        flexDirection: 'row'
    },
    filterPickerCategoryWraper: {
        flex: 33,
        backgroundColor: "#F3F3F3",
    },
    filterPickerList: {
        flex:1,
    },
    filterPickerOptionWraper: {
        flex: 67,
        backgroundColor: "#FFFFFF",
        paddingLeft: 10,
        paddingRight: 10,
    },
    filterPickerItemRow: {
        flexDirection: "row",
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: "#D7D5D8"
    },
    filterPickerItemRowSelected: {
        backgroundColor: "#FFFFFF",
    },
    filterPickerCheckIcon: {
        paddingTop: 8,
        width: 36, 
        height: 36, 
        color: "#FFFFFF",
    },
    filterPickerCheckIconSelected: {
        color: "#E9573E",
    },
    filterPickerItem: {
        justifyContent: 'center', 
        alignItems: 'center',
    },
    filterPickerRow: {
        justifyContent: 'center', 
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: "#D7D5D8"
    },
    filterPickerText: {
        color: "#75787F",
        fontSize: 16,
        fontWeight: "300",
        padding:15,
    },
});

module.exports = styles;