'use strict';

var React = require('react-native');
var Dimensions = require('Dimensions');
var Icon = require('react-native-vector-icons/Ionicons');
var NavigationBar = require('react-native-navbar');

//酒店详细介绍页面
var {
        StyleSheet,
        Text,
        View,
        ScrollView,
        Image,
        ListView,
        Navigator,
        TextInput,
        TouchableOpacity,
        Component,
        TouchableHighlight,
} = React;

var { width, height, scale } = Dimensions.get('window');

var HotelMenuScreen = React.createClass({
    getInitialState: function() {
        return {
            loaded: false,
        };
    },
    renderNavbar() {
        return (
            <NavigationBar
                title={{title: "婚宴菜单"}}
                leftButton={
                    <TouchableOpacity onPress={() => this.props.navigator.pop()}>
                                    <Icon name='ios-arrow-back'size={20} color='#e9573e' style={{ marginLeft: 10, marginRight: 10, width: 20, height: 20, }} />
                        </TouchableOpacity>
                } />
        )
    },

    renderMenuItems(type, items) {
        if (items.length === 0) {
            return (
                <View>
                    <Text>菜单内含具体菜肴，以店谈为准。</Text>
                </View>
            );
        } else {
            return (
                <View style={{flex:1}}>
                    <Text>{type}</Text>
                    <View>
                        {
                            items.map(item => {
                                return (<Text>{item}</Text>)
                            })
                        }
                    </View>
                </View>
            );
        }
    },

    renderMenuContent(menu) { 
        if (menu.list.length == 1) {
            return (
                <View style={{flex:1}}>{this.renderMenuItems(menu.list[0].type, menu.list[0].items) }</View>
            )
        } else {
            return (
                 <View style={{flexDirection: 'row'}}>
                    <View style={{flex:1}}>
                        {this.renderMenuItems(menu.list[0].type, menu.list[0].items) }
                    </View>
                    <View style={{flex:1}}>
                        {this.renderMenuItems(menu.list[1].type, menu.list[1].items) }
                    </View>
                </View>
            )
        }
    },

    renderList(menu) {
        var menuList;
        if (menu.list.length == 1) {
            menuList = menu.list.map(function(text){
                return (
                    <Text style={{lineHeight: 23, color: '#3D3D3D', fontWeight: "300", fontSize: 13, marginBottom: 8}}>{text}</Text>
                );
            });
        }
        return (
            <View style={{marginTop: 15}}>
                <View style={{paddingLeft: 15, paddingRight: 15}}>
                    <Text style={{alignItems: 'center'}} >{menu.name}</Text>
                </View>
                <View style={{paddingLeft: 15, paddingRight: 15}}>
                    { this.renderMenuContent(menu) }
                </View>
            </View>
        );
    },

    render() {
        return (
            <View style={{flex:1}}>
                { this.renderNavbar() }
                <ScrollView style={{flex:1, backgroundColor: '#F0EFF5'}}>
                    { this.renderList(this.props.menu) }
                </ScrollView>
            </View>
            );      
        }
});

module.exports = HotelMenuScreen;
