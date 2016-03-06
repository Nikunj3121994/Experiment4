/**
 * 提交
 */
'use strict';

var React = require('react-native');
var NavigationBar = require('react-native-navbar');
var Icon = require('react-native-vector-icons/Ionicons');

var BOOK_HOTEL_URL = "http://api.likewed.net/V1/hotel/book";
// var BOOK_HOTEL_URL = "http://127.0.0.1:9928/V1/hotel/book";

var {
	ActivityIndicatorIOS,
	Image,
	PixelRatio,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	ScrollView,
	DatePickerIOS
} = React;


/**
 * 获取预约到酒店看场的日期选择器
 * 可以预约三个时间范围
 *    1. 本周;
 *    2. 下周;
 *    3. 一月内
 *  缺省为本周
 */ 
var BookDatePicker = React.createClass({
	getInitialState() {
		return {
			bookDate: this.props.defaultBookDate || 1, // 1：本周，2：下周， 3： 一月内
		};
	},

	_onDateSelected(value) {
		this.setState({bookDate: value});

		this.props.onChange(value);
	},

	render() {
		return (
			<View style={{flexDirection: "row", paddingLeft: 7.5, paddingRight: 7.5}}>
				<TouchableOpacity onPress={ () => { this._onDateSelected(1) }} style={{flex:1}}>
					<View style={{flex:1, alignItems: 'center', justifyContent: 'center', marginLeft:7.5, marginRight: 7.5, padding:5, backgroundColor: '#FFFFFF', borderWidth:1, borderColor: this.state.bookDate === 1 ? '#FA7621' : '#E1E1E1'}}>
						<Text style={{color: this.state.bookDate === 1 ? '#FA7621' : '#343434', fontWeight: "300", fontSize: 16}}>本周</Text>
			    	</View>
		    	</TouchableOpacity>
		    	<TouchableOpacity onPress={ () => { this._onDateSelected(2) }} style={{flex:1}}>
					<View style={{flex:1, alignItems: 'center', justifyContent: 'center', marginLeft:7.5, marginRight: 7.5, padding:5, backgroundColor: '#FFFFFF', borderWidth:1, borderColor: this.state.bookDate === 2 ? '#FA7621' : '#E1E1E1'}}>
						<Text style={{color: this.state.bookDate === 2 ? '#FA7621' : '#343434', fontWeight: "300", fontSize: 16}}>下周</Text>
			    	</View>
		    	</TouchableOpacity>
		    	<TouchableOpacity onPress={ () => { this._onDateSelected(3) }} style={{flex:1}}>
					<View style={{flex:1, alignItems: 'center', justifyContent: 'center', marginLeft:7.5, marginRight: 7.5, padding:5, backgroundColor: '#FFFFFF', borderWidth:1, borderColor: this.state.bookDate === 3 ? '#FA7621' : '#E1E1E1'}}>
						<Text style={{color: this.state.bookDate === 3 ? '#FA7621' : '#343434', fontWeight: "300", fontSize: 16}}>一月内</Text>
			    	</View>
		    	</TouchableOpacity>
		    </View>
    	);
	}
});

var BookHotelScreen = React.createClass({
	bookDate: 1, // 1：本周，2：下周， 3： 一月内

	getInitialState() {
		return {
			showDatePicker: false,
			date: this.props.date,
		};
	},

	onBookDateChanged(value) {
		this.bookDate = value;
 	},

	renderNavbar() {
		return (
			<NavigationBar
	            title={{title: '预约看场地'}}
	            leftButton={
	            	<TouchableOpacity onPress={() => this.props.navigator.pop()}>
                        <Icon name='ios-arrow-back'size={20} color='#e9573e' style={[{ marginLeft: 10, marginRight: 10, width: 20, height: 20, }, this.props.style]} />
                	</TouchableOpacity>
	            } />
		)
	},


	renderHotel(hotel) {
		var hotel = this.props.hotel;
		var capacity = hotel.capacity.start === hotel.capacity.end ? hotel.capacity.start: hotel.capacity.start +'-' + hotel.capacity.end;

		return (
    		<View style={{flexDirection: 'row', paddingTop: 15, paddingLeft: 15, paddingRight: 15, paddingBottom: 15, backgroundColor: '#FFFFFF',}}>
    			<Image style={{width: 100, height: 68, resizeMode: Image.resizeMode.cover, }} source={{uri: hotel.pics[0].url+'!380x'}} />
    			<View style={{flex:1, paddingLeft: 8}}>
    				<View style={{flexDirection: 'row'}}>
    					<Text style={{color: '#343434', fontWeight: "300", fontSize: 16}}>{hotel.name}</Text>
    				</View>
    				<View style={{flexDirection: 'row', marginTop: 8}}>
    					<View style={{flexDirection: 'row'}}>
    						<Text style={{color: '#FA7621', fontWeight: "300", fontSize: 14}}>{hotel.score}分</Text>
    						<Text style={{color: '#a7a7a7', fontWeight: "300", fontSize: 14}}>/{hotel.stats.orders}预订</Text>
    					</View>
    					<View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', }} >
    						<Text style={{marginRight: 8, color: '#a7a7a7', fontWeight: "300", fontSize: 13}}>容纳{capacity}桌</Text>
    					</View>
    				</View>
    				<View style={{flexDirection: 'row', marginTop: 8, }}>
    					<Text numberOfLines={1} style={{marginRight: 8, color: '#a7a7a7', fontWeight: "300", fontSize: 13}}>{hotel.category}・{hotel.location.address}</Text>
    				</View>
    			</View>
    		</View>
		);
	},

	renderDates(hotel) {
		return (
			<View>
				<View style={{marginTop: 15, paddingBottom: 10, backgroundColor: "#FFFFFF"}}>
	            	<View style={{alignItems: 'flex-start', padding: 15}} >
	            		<Text style={{color: '#262626', fontWeight: "300", fontSize: 16}}>请选择要预约看场地的日期</Text>
	            	</View>
	            	<BookDatePicker defaultBookDate={1} onChange={this.onBookDateChanged} />
	            </View>
	        </View>
	    );
	},

	//TODO: 需要增加中午、晚上和全天， 档期的选择
    render() {
        return (
        	<View style={{flex:1}}>
            	{ this.renderNavbar() }
            	<ScrollView style={{flex:1, backgroundColor: '#F0EFF5'}}>
            		{ this.renderHotel(this.props.hotel) }
            		{ this.renderDates(this.props.hotel) }
            		<View>
            			<View style={{margin: 15}}>
            				<Text style={{color: '#262626', fontWeight: "300", fontSize: 14, lineHeight: 22}}>提交预约请求后，酒店经理会通过应用中的聊天功能或电话同您沟通，并确定具体的接待日期。你也可在"我的"页面中的"预约"栏目中看到预约的结果。</Text>
            			</View>
            			<TouchableOpacity onPress={ this.submitQuery }>
            				<View style={{margin: 15, marginTop: 0, height: 40, backgroundColor: '#FA7621', borderRadius: 5, alignItems: "center", justifyContent: "center"}}>
            					<Text style={{color: '#FFFFFF', fontWeight: "400", fontSize: 18}}>提    交</Text>
            				</View>
            			</TouchableOpacity>
            		</View>
            	</ScrollView>
	        </View>
        );
    },

    submitQuery() {
    	var data = {
    		_id: this.props.hotel._id,
    		bookdate: this.bookDate
       	};


    	fetch(BOOK_HOTEL_URL, {
	    		method: 'POST', 
	    		body: JSON.stringify(data),
	    		headers: new Headers({
					'Accept': 'application/json',
				 	'Content-Type': 'application/json'
				})
	    	})
    		.then(response => response.json())
    		.then(json => {
    			this.props.navigator.pop();
    		})
    		.catch(err => {
    			console.error('提交预约看场地请求失败!\n', err);
    		});
    }
});

module.exports = BookHotelScreen;