'use strict';

var React = require('react-native');
var NavigationBar = require('react-native-navbar');
var Icon = require('react-native-vector-icons/Ionicons');

var QUERY_HOTEL_SCHEDULE_URL = "http://api.likewed.net/V1/hotel/queryschedule";
// var QUERY_HOTEL_SCHEDULE_URL = "http://127.0.0.1:9928/V1/hotel/queryschedule";

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


var HallCard = React.createClass({
	getInitialState() {
		return {
			selected: this.props.selected,
		};
	},

	_onSelected() {
		this.props.hall.selected = !this.state.selected;
		this.setState({selected: this.props.hall.selected});
	},

	render() {
		var hall = this.props.hall;

		return (
			<TouchableOpacity onPress={ this._onSelected } style={{flex:1}}>
				<View style={{flex:1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: 5, padding:5, backgroundColor: '#FFFFFF', borderWidth:1, borderColor: this.state.selected ? '#FA7621' : '#E1E1E1'}}>
					<View style={{ padding: 5}}>
						<Icon name='ios-checkmark-outline' size={20} color={this.state.selected ? '#FA7621' : '#E1E1E1'} style={[{width: 20, height: 20, }, this.props.style]} />
					</View>
					<View style={{paddingLeft: 5, flex:1}}>
						<View style={{flexDirection: 'row'}}>
							<Text style={{color: '#343434', fontWeight: "300", fontSize: 16}}>{hall.name}</Text>
						</View>
						<View style={{marginTop: 8, flexDirection: 'row'}}>
							<Text style={{marginRight: 8, color: '#a7a7a7', fontWeight: "300", fontSize: 14}}>{hall.area}㎡</Text>
							<Text style={{marginRight: 8, color: '#a7a7a7', fontWeight: "300", fontSize: 14}}>容纳{hall.capacity}桌</Text>
						</View>
					</View>
		    	</View>
	    	</TouchableOpacity>
    	);
	}
});

var QueryHotelScheduleScreen = React.createClass({
	getDefaultProps() {
		return {
			date: new Date(new Date().setMonth(new Date().getMonth()+3)),  //可以优化为三个月后对应周的周六
			maximumDate: new Date(new Date().setYear(new Date().getFullYear()+2)),
			minimumDate: new Date()
		};
	},
	
	halls: [],

	getInitialState() {
		var halls = this.props.hotel.halls;

		if (halls && halls.length > 0)
			this.halls = halls.map(hall => Object.assign({selected: false}, hall)); 

		return {
			showDatePicker: false,
			date: this.props.date,
		};
	},

	onDateChange(date) {
    	this.setState({date: date});
 	},

	renderNavbar() {
		return (
			<NavigationBar
	            title={{title: '查询酒店档期'}}
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

	renderHallRow(hall1, hall2) {
		return (
			<View style={{flexDirection: "row", marginTop: 5}}>
				<HallCard hall={hall1} />
				{
					hall2 ? 
						<HallCard hall={hall2} selected={false} />
						: null
				}
			</View>
		);
	},

	renderHalls(hotel) {
		var halls = this.halls;

		if (halls && halls.length > 0) {
			var rows = [];
			var count = halls.length;
			for(var i = 0; i < count; i+=2) {
				rows.push(this.renderHallRow(halls[i], i+1 < count ? halls[i+1] : null));
			}

			return (
				<View>
					<View style={{marginTop: 15, backgroundColor: "#FFFFFF"}}>
		            	<View style={{alignItems: 'flex-start', padding: 15}} >
		            		<Text style={{color: '#262626', fontWeight: "300", fontSize: 16}}>选择询问档期的宴会厅（可以多选）</Text>
		            	</View>
		            </View>
					{ rows }
		        </View>
		    );
		}
	},

	renderWeddingDate(hotel) {
		return (
			<View>
				<TouchableOpacity onPress={()=> { this.setState({showDatePicker: !this.state.showDatePicker}) } }>
		    		<View style={{marginTop: 10, flexDirection: 'row', paddingTop: 15, paddingLeft: 15, paddingRight: 15, paddingBottom: 15, backgroundColor: '#FFFFFF',}}>
		            	<View style={{}} >
		            		<Text style={{color: '#262626', fontWeight: "300", fontSize: 16}}>选择查询时间</Text>
		            	</View>
		            	<View style={{flex:1, alignItems: 'flex-end'}}>
		            		<Text style={{color: '#FA7621', fontWeight: "400", fontSize: 16}}>{this.state.date.getFullYear()}年{this.state.date.getMonth()+1}月{this.state.date.getDate()}日</Text>
		            	</View>
		    		</View>
	    		</TouchableOpacity>
	    		<View>
	    			{
			    		this.state.showDatePicker ? 
			    			<DatePickerIOS
								date={this.state.date}
								mode="date"
								onDateChange={this.onDateChange} 
								maximumDate={this.props.maximumDate}
								minimumDate={this.props.minimumDate} />
							: null
	    			}
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
            		{ this.renderWeddingDate(this.props.hotel) }
            		{ this.renderHalls(this.props.hotel) }
            		<View>
            			<View style={{margin: 15}}>
            				<Text style={{color: '#262626', fontWeight: "300", fontSize: 14, lineHeight: 22}}>我们将档期查询请求发送到酒店，酒店回复后，喜结婚礼汇将推送消息进行通知，你也可在"我的"页面中的"消息"栏目中看到档期查询处理状态。</Text>
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
    		date: this.state.date,
    		halls: []
    	};

    	this.halls.forEach(hall => {
    		if (hall.selected) {
    			data.halls.push(hall._id);
    		}
    	});

    	fetch(QUERY_HOTEL_SCHEDULE_URL, {
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
    			console.error('提交请求档期查询请求失败!\n', err);
    		});
    }
});

module.exports = QueryHotelScheduleScreen;