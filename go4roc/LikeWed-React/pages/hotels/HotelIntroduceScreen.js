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

var HotelIntroduceScreen = React.createClass({
	getInitialState: function() {
		return {
			loaded: false,
		};
	},
	renderNavbar() {
		return (
			<NavigationBar
	            title={{title: "酒店详情"}}
	            leftButton={
	            	<TouchableOpacity onPress={() => this.props.navigator.pop()}>
                        <Icon name='ios-arrow-back'size={20} color='#e9573e' style={{ marginLeft: 10, marginRight: 10, width: 20, height: 20, }} />
                	</TouchableOpacity>
	            } />
		)
	},

	renderIntroduce(hotel) {
		return (
			<View style={{marginTop: 15}}>
       			<View style={{paddingLeft: 15, paddingRight: 15}}>
       				{
       					this.props.hotel.description.split('\n').map((text) => {
       						return (
       							<Text style={{lineHeight: 23, color: '#3D3D3D', fontWeight: "300", fontSize: 13, marginBottom: 8}}>{text}</Text>
       						)
       					})
       				}
       			</View>
       		</View>
		);
	},

    render() {
		return (
            <View style={{flex:1}}>
            	{ this.renderNavbar() }
            	<ScrollView style={{flex:1, backgroundColor: '#F0EFF5'}}>
            		{ this.renderIntroduce(this.props.hotel) }
	            </ScrollView>
            </View>
        );		
    }
});

module.exports = HotelIntroduceScreen;
