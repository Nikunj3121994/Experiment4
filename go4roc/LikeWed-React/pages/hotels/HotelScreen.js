'use strict';

var React = require('react-native');
var Dimensions = require('Dimensions');
var Swiper = require('react-native-swiper');
var Icon = require('react-native-vector-icons/Ionicons');
var NavigationBar = require('react-native-navbar');

//酒店详细页面
var {
    AppRegistry,
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
    ActivityIndicatorIOS,
} = React;

var { width, height, scale } = Dimensions.get('window');

var MAP_URL = "http://restapi.amap.com/v3/staticmap?location=104.07002091,30.66349276&zoom=14&size=665*259&markers=mid,,A:104.07002091,30.66349276&key=81885d006dd6a782ba83c4a2f2e67088&scale=2";

var HOTEL_EXTRA_API = "http://api.likewed.net/V1/hotel/";
// var HOTEL_EXTRA_API = "http://localhost:9928/V1/hotel/";

var HotelServices = React.createClass({
	renderRow(service1, service2) {
		return (
			<View style={{flexDirection: 'row', marginLeft: 15, marginRight: 15, marginBottom: 10}}>
				<View style={{flex:1}}>
					<Text style={{color: '#343434', fontWeight: "300", fontSize: 14}}>{service1.name}：{service1.value}</Text>
				</View>
				{
					service2 ? 
						<View style={{flex:1}}>
							<Text style={{color: '#343434', fontWeight: "300", fontSize: 14}}>{service2.name}：{service2.value}</Text>
						</View>
						: null
 				}
			</View>
		);
	},

	render() {
		var services = this.props.services;

		if (services && services.length > 0) {
			var rows = [];
			var count = services.length;
			for(var i = 0; i < count; i+=2) {
				rows.push(this.renderRow(services[i], i+1 < count ? services[i+1] : null));
			}

			return (
				<View style={{marginTop: 15, backgroundColor: "#FFFFFF"}}>
		   			<View style={{alignItems: 'center', padding: 15}} >
		        		<Text style={{color: '#A9A9A9', fontWeight: "300", fontSize: 16}}>规则和配套</Text>
		        	</View>
		        	<View style={{}}>
						{ rows }
		        	</View>
		        </View>
		    );
		}
	},
});

var HotelScreen = React.createClass({
	getDefaultProps: function() {
		return {
			launchMode: 0 // launchMode -- 1：从nativeView启动； 0 or 不存在： 从React中调用
		};
	},
	getInitialState: function() {
		return {
			hotel: this.props.hotel,
			loaded: false,
		};
	},

	componentDidMount() {
		console.info('Hotel launchMode ', this.props.launchMode);
        this.fetchHotelExtraData(this.state.hotel._id);
    },

    fetchHotelExtraData(id) {
    	fetch(HOTEL_EXTRA_API+id)
    		.then(res => res.json())
    		.then(json => {
    			this.setState({loaded: true, hotel: json});
    		})
    		.catch(err => {
    			console.error('获取酒店信息失败:\n', err);
    		});
    },

    _goBack() {
    	if (this.props.launchMode === 1) {
    		let ReactViewController = require('NativeModules').ReactViewController;
    		ReactViewController.closeViewController();
    	} else {
    		this.props.navigator.pop();
    	}
    },

	renderNavbar() {
		return (
			<NavigationBar
	            title={{title: this.state.hotel.name}}
	            leftButton={
	            	<TouchableOpacity onPress={ this._goBack }>
                        <Icon name='ios-arrow-back'size={20} color='#e9573e' style={{ marginLeft: 10, marginRight: 10, width: 20, height: 20, }} />
                	</TouchableOpacity>
	            }
	            rightButton={
	                <TouchableOpacity onPress={() => this.props.navigator.push({id: 'ShareHotel', hotel: this.state.hotel})}>
                        <Icon name='ios-upload-outline' size={20} color='#e9573e' style={{ marginLeft: 10, marginRight: 10, width: 20, height: 20, }} />
                	</TouchableOpacity>
                } />
		)
	},

	renderHeader(hotel) {
		return (
			<View style={{backgroundColor: "#FFFFFF"}}>
                <Swiper showsButtons={false} autoplay={false} height={203} showsPagination={false}>
                	{
                		hotel.pics.map((pic, index) => {
                			return (
                				<Image style={{height:203, resizeMode: Image.resizeMode.cover, }} source={{uri: pic.url+'!wechat'}}>
                					<View style={{flex:1, justifyContent: 'flex-end', alignItems: 'flex-start'}}>
                						<Text style={{margin:10, color: "#FFFFFF"}}>{index+1}/{hotel.pics.length}</Text>
                					</View>
                				</Image>
                			);
                		})
                	}
                </Swiper>
                <View style={{paddingTop: 20, paddingLeft: 20, paddingRight:20, backgroundColor: "#FFFFFF"}}>
            		<View style={{marginBottom: 15}}>
            			<Text style={{color: "#383838", fontWeight: "300", fontSize: 16}}>{hotel.name}</Text>
            		</View>
            		<View style={{marginBottom: 10, flexDirection: 'row'}}>
            			<View style={{}}>
            				<Text style={{color: '#B2B2B2', fontWeight: "300", fontSize: 13}}>{hotel.category}・{hotel.location.district}・容纳{ hotel.capacity.start === hotel.capacity.end ? hotel.capacity.start : hotel.capacity.start+"-"+hotel.capacity.end}桌</Text>
            			</View>
            			<View style={{flex: 1, alignItems: 'flex-end'}}>
            				<Text style={{color: '#FA7621', fontWeight: "300", fontSize: 16}}>¥{hotel.price.start}-{hotel.price.end}/桌</Text>
            			</View>
            		</View>
            		<View style={{marginBottom: 10}}>
            			<Text style={{color: '#B2B2B2', fontWeight: "300", fontSize: 13}}>{hotel.location.description}</Text>
            		</View>
            		<View style={{flexDirection: "row", marginBottom: 15}}>
            			{ 
	           				hotel.recommends.map(tag => {
	           					return (
	           						<View style={{marginRight: 10, paddingLeft:10, paddingRight: 10, paddingTop:5, paddingBottom:5, borderRadius: 12, backgroundColor: "#F8B684"}}>
			            				<Text style={{color: '#FFFFFF', fontWeight: "300", fontSize: 13}}>{tag}</Text>
			            			</View>
	           					);
	           				})
	           			}
            		</View>
                </View>
           		<View style={{height: 1, backgroundColor: '#E1E1E1'}}/>
           		<View style={{flexDirection: 'row', justifyContent: 'center', margin: 15}}>
           			<View style={{alignItems: 'center', paddingLeft:15, paddingRight: 15}}>
           				<Text style={{color: '#8F8F8F', fontWeight: "100", fontSize: 26}}>{hotel.stats.clicks}</Text>
           				<Text style={{color: '#979797', fontWeight: "300", fontSize: 13}}>浏览</Text>
           			</View>
           			<View style={{height: 32, width: 1, backgroundColor: '#E9E9E9'}}/>
           			<View style={{alignItems: 'center', paddingLeft:15, paddingRight: 15}}>
           				<Text style={{color: '#8F8F8F', fontWeight: "100", fontSize: 26}}>{hotel.stats.favorites}</Text>
           				<Text style={{color: '#979797', fontWeight: "300", fontSize: 13}}>收藏</Text>
           			</View>
           			<View style={{height: 32, width: 1, backgroundColor: '#E9E9E9'}}/>
           			<View style={{alignItems: 'center', paddingLeft:15, paddingRight: 15}}>
           				<Text style={{color: '#8F8F8F', fontWeight: "100", fontSize: 26}}>{hotel.stats.orders}</Text>
           				<Text style={{color: '#979797', fontWeight: "300", fontSize: 13}}>预订</Text>
           			</View>
           			<View style={{height: 32, width: 1, backgroundColor: '#E9E9E9'}}/>
           			<View style={{alignItems: 'center', paddingLeft:15, paddingRight: 15}}>
           				<Text style={{color: '#8F8F8F', fontWeight: "100", fontSize: 26}}>{hotel.score}</Text>
           				<Text style={{color: '#979797', fontWeight: "300", fontSize: 13}}>评分</Text>
           			</View>
           		</View>
            </View>
		);
	},

	renderInfo(hotel) {
		var map_url = `http://restapi.amap.com/v3/staticmap?location=${hotel.location.longitude},${hotel.location.latitude}&zoom=14&size=665*259&markers=mid,,A:${hotel.location.longitude},${hotel.location.latitude}&key=81885d006dd6a782ba83c4a2f2e67088&scale=2`;
		var description = hotel.description.split('\n')[0];

		return (
			<View style={{marginTop: 15, backgroundColor: "#FFFFFF"}}>
            	<View style={{alignItems: 'center', padding: 15}} >
            		<Text style={{color: '#262626', fontWeight: "300", fontSize: 16}}>{hotel.location.address}</Text>
            	</View>
       			<Image style={{width: width, height: 259, resizeMode: Image.resizeMode.cover, }} source={{uri: map_url}} />
       			<View>
       				<View style={{alignItems: 'center', padding:15}}>
       					<Text style={{color: '#B1B1B1', fontWeight: "300", fontSize: 16}}>酒店介绍与周边信息</Text>
       				</View>
       			</View>
       			<View style={{paddingLeft: 15, paddingRight: 15}}>
       				<Text numberOfLines={5}  style={{lineHeight: 23, color: '#3D3D3D', fontWeight: "300", fontSize: 13}}>{description}</Text>
       			</View>
       			<View style={{padding: 15, alignItems: 'center'}}>
       				<TouchableOpacity onPress={() => this.props.navigator.push({id: 'HotelIntroduce', hotel: hotel}) }>
       					<Text style={{borderRadius: 5, paddingTop: 5, paddingBottom: 5, color: '#EBB199', fontWeight: "300", fontSize: 15, borderWidth:1, borderColor: '#F6CDB1', paddingLeft: 20, paddingRight: 20}}>详情</Text>
       				</TouchableOpacity>
       			</View>
       		</View>
		);
	},

	renderHall(hotel, hall) {
		return (
			<TouchableOpacity onPress={() => this.props.navigator.push({id: 'HotelHall', hotel: hotel, hall: hall})} style={{flexDirection: 'row', paddingTop: 15, paddingLeft: 15, paddingRight: 15, paddingBottom: 15,}}>
				<Image style={{width: 100, height: 68, resizeMode: Image.resizeMode.cover, }} source={{uri: hall.pics[0]+'!380x'}} />
				<View style={{paddingLeft: 8}}>
					<View style={{flexDirection: 'row'}}>
						<Text style={{color: '#343434', fontWeight: "300", fontSize: 16}}>{hall.name}</Text>
					</View>
					<View style={{marginTop: 8, flexDirection: 'row'}}>
						<Text style={{marginRight: 8, color: '#a7a7a7', fontWeight: "300", fontSize: 14}}>{hall.area}平米</Text>
						<Text style={{marginRight: 8, color: '#a7a7a7', fontWeight: "300", fontSize: 14}}>容纳{hall.capacity}桌</Text>
						<Text style={{marginRight: 8, color: '#a7a7a7', fontWeight: "300", fontSize: 14}}>层高{hall.height}米</Text>
						<Text style={{marginRight: 8, color: '#a7a7a7', fontWeight: "300", fontSize: 14}}>{hall.pillars > 0 ? "柱子"+hall.pillars: "无柱"}</Text>
					</View>
					<View style={{marginTop: 8, flexDirection: 'row'}}>
						<Text style={{marginRight: 8, color: '#FA7621', fontWeight: "300", fontSize: 13}}>¥{hall.start.price}/桌</Text>
						<Text style={{marginRight: 8, color: '#a7a7a7', fontWeight: "300", fontSize: 13}}>{hall.start.count}桌起订</Text>
						<View style={{paddingTop: 2, flex:1, flexDirection: 'row', alignItems: 'flex-end', justifyContent:'center'}}>
	    					<Text style={{paddingLeft:3, paddingRight: 3, borderRadius: 3, borderWidth:1, borderColor: '#FA7621', marginRight: 8, color: '#FA7621', fontWeight: "300", fontSize: 9}}>立减300/桌</Text>
	    					<Text style={{paddingLeft:3, paddingRight: 3, borderRadius: 3, borderWidth:1, borderColor: '#FA7621', marginRight: 8, color: '#FA7621', fontWeight: "300", fontSize: 9}}>预约红包</Text>
						</View>
					</View>
				</View>
			</TouchableOpacity>
		);
	},

	renderHalls(hotel) {
		if (hotel.halls && hotel.halls.length > 0) {
			return (
				<View style={{marginTop: 15, backgroundColor: "#FFFFFF"}}>
		   			<View style={{alignItems: 'center', padding: 15}} >
		        		<Text style={{color: '#A9A9A9', fontWeight: "300", fontSize: 16}}>婚宴大厅</Text>
		        	</View>
		        	<View style={{}}>
		        		{
		        			hotel.halls.map((hall, index) => {
		        				if (index === 0) {
		        					return this.renderHall(hotel, hall)
		        				} else {
		        					return (
		        						<View>
		        							<View style={{height: 1, backgroundColor: '#E1E1E1'}}/>
		        							{this.renderHall(hotel, hall)}
		        						</View>
		        					)
		        				}
		        			})
		        		}
		        	</View>
		   		</View>
		   	);
		}
	},

	renderMenu(hotel, menu) {
		return (
			<TouchableOpacity onPress={() => this.props.navigator.push({id: 'HotelMenu', hotel: hotel, menu: menu})} style={{flexDirection: 'row', paddingTop: 15, paddingLeft: 15, paddingRight: 15, paddingBottom: 15,}}>
				<View style={{flexDirection: 'row'}}>
					<Text style={{color: '#343434', fontWeight: "300", fontSize: 16}}>{menu.name}</Text>
				</View>
				<View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent:'flex-end'}}>
					<Text style={{marginRight: 8, color: '#FA7621', fontWeight: "300", fontSize: 14}}>¥{menu.price}/桌</Text>
					<Icon name='ios-arrow-right' size={16} color='#FA7621'/>
				</View>
    		</TouchableOpacity>
		)
	},

	renderMenus(hotel) {
		if (hotel.menus && hotel.menus.length > 0) {
			return (
				<View style={{marginTop: 15, backgroundColor: "#FFFFFF"}}>
	       			<View style={{alignItems: 'center', padding: 15}} >
	            		<Text style={{color: '#A9A9A9', fontWeight: "300", fontSize: 16}}>婚宴菜单</Text>
	            	</View>
	            	<View style={{}}>
	            		<View style={{}}>
			        		{
			        			hotel.menus.map((menu, index) => {
			        				if (index === 0) {
			        					return this.renderMenu(hotel, menu)
			        				} else {
			        					return (
			        						<View>
			        							<View style={{height: 1, backgroundColor: '#E1E1E1'}}/>
			        							{this.renderMenu(hotel, menu)}
			        						</View>
			        					)
			        				}
			        			})
			        		}
			        	</View>
			        </View>
	            </View>
			);
		}
	},

	renderReview(hotel, review) {
		return (
			<View style={{flexDirection: 'row', marginTop: 15, marginLeft: 15, marginRight: 15, marginBottom: 10, paddingBottom: 15}}>
        		<View style={{width: 45}}>
        			<Image style={{borderRadius: 20, height:40, width: 40, resizeMode: Image.resizeMode.cover, }} source={{uri: review.user.logo_url}} />
        		</View>
        		<View style={{flex:1, marginLeft: 10}}>
        			<View style={{flexDirection: 'row'}}>
        				<View style={{marginTop: 5}}>
        					<Text style={{color: '#797979', fontWeight: "300", fontSize: 14}}>{review.user.name}</Text>
        				</View>
        				<View style={{flex: 1, flexDirection: 'row', alignItems:'center', justifyContent: 'flex-end'}}>
        					<Icon name='ios-star' size={16} color='#FA7621' style={{width: 16, height: 16, }} />
        					<Icon name='ios-star' size={16} color='#FA7621' style={{width: 16, height: 16, }} />
        					<Icon name='ios-star' size={16} color='#FA7621' style={{width: 16, height: 16, }} />
        					<Icon name='ios-star' size={16} color='#FA7621' style={{width: 16, height: 16, }} />
        					<Icon name='ios-star' size={16} color='#FA7621' style={{width: 16, height: 16, }} />
        				</View>
        			</View>
        			<View style={{marginTop: 5}}>
        				<Text numberOfLines={4}  style={{lineHeight: 23, color: '#3D3D3D', fontWeight: "300", fontSize: 13}}>{review.content}</Text>
        			</View>
        		</View>
			</View>
		);
	},

	renderReviews(hotel) {
		if (hotel.reviews && hotel.reviews.length > 0) {
			return (
				<View style={{marginTop: 15, backgroundColor: "#FFFFFF"}}>
		   			<View style={{alignItems: 'flex-start', padding: 15}} >
		        		<Text style={{color: '#A9A9A9', fontWeight: "300", fontSize: 16}}>{hotel.stats.reviews}条评论</Text>
		        	</View>
		        	{
	        			hotel.reviews.map((review, index) => {
	        				if (index === 0) {
	        					return this.renderReview(hotel, review)
	        				} else {
	        					return (
	        						<View>
	        							<View style={{height: 1, backgroundColor: '#E1E1E1'}}/>
	        							{this.renderReview(hotel, review)}
	        						</View>
	        					)
	        				}
	        			})
		        	}
					<View style={{height: 1, backgroundColor: '#E1E1E1'}}/>
					<View style={{flexDirection: 'row', marginTop: 15, marginLeft: 15, marginRight: 15, marginBottom: 15}}>
		        		<View style={{}}>
		        			<Text style={{color: '#343434', fontWeight: "300", fontSize: 14}}>查看全部</Text>
		        		</View>
		        		<View style={{flex:1, alignItems:'flex-end'}}>
		        			<Icon name='ios-arrow-right' size={16} color='#FA7621' />
		        		</View>
					</View>
		        </View>
	    	);
		} else {
			return (
				<View style={{marginTop: 15, backgroundColor: "#FFFFFF"}}>
		   			<View style={{alignItems: 'flex-start', padding: 15}} >
		        		<Text style={{color: '#A9A9A9', fontWeight: "300", fontSize: 16}}>发表您的评论</Text>
		        	</View>
		        </View>
			);
		}
	},

	renderSimilarHotel(hotel, similarHotel) {
		return (
			<View style={{flexDirection: 'row', paddingTop: 15, paddingLeft: 15, paddingRight: 15, paddingBottom: 15,}}>
				<Image style={{width: 100, height: 68, resizeMode: Image.resizeMode.cover, }} source={{uri: similarHotel.cover.url}} />
				<View style={{flex:1, paddingLeft: 8}}>
					<View style={{flexDirection: 'row'}}>
						<Text style={{color: '#343434', fontWeight: "300", fontSize: 16}}>{similarHotel.name}</Text>
					</View>
					<View style={{flexDirection: 'row', marginTop: 8}}>
						<View style={{flexDirection: 'row'}}>
							<Text style={{color: '#FA7621', fontWeight: "300", fontSize: 14}}>{similarHotel.score}分</Text>
							<Text style={{color: '#a7a7a7', fontWeight: "300", fontSize: 14}}>/{similarHotel.order_count}预订</Text>
						</View>
						<View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', }} >
							<Text style={{color: '#FA7621', fontWeight: "400", fontSize: 14}}>¥{similarHotel.price.start}-{similarHotel.price.end}/桌</Text>
						</View>
					</View>
					<View style={{flexDirection: 'row', marginTop: 8, }}>
						<Text style={{marginRight: 8, color: '#a7a7a7', fontWeight: "300", fontSize: 13}}>{similarHotel.category}</Text>
						<Text style={{marginRight: 8, color: '#a7a7a7', fontWeight: "300", fontSize: 13}}>{similarHotel.location.business_circle}</Text>
						<View style={{paddingTop: 2, flex:1, flexDirection: 'row', justifyContent: 'flex-end', }}>
	    					<Text style={{paddingLeft:3, paddingRight: 3, borderRadius: 3, borderWidth:1, borderColor: '#FA7621', marginLeft: 8, color: '#FA7621', fontWeight: "300", fontSize: 9}}>订单返现</Text>
							<Text style={{paddingLeft:3, paddingRight: 3, borderRadius: 3, borderWidth:1, borderColor: '#FA7621', marginLeft: 8, color: '#FA7621', fontWeight: "300", fontSize: 9}}>预约红包</Text>
						</View>
					</View>
				</View>
			</View>
		);
	},

	renderSimilarHotels(hotel) {
		if (hotel.related && hotel.related.length > 0) {
			return (
				<View style={{marginTop: 15, backgroundColor: "#FFFFFF"}}>
	       			<View style={{alignItems: 'center', padding: 15}} >
	            		<Text style={{color: '#A9A9A9', fontWeight: "300", fontSize: 16}}>周边或相似的酒店</Text>
	            	</View>
	            	<View style={{}}>
	            		{
	            			hotel.similar_hotels.map((similarHotel, index) => {
	            				if (index === 0) {
		        					return this.renderSimilarHotel(hotel, similarHotel)
		        				} else {
		        					return (
		        						<View>
		        							<View style={{height: 1, backgroundColor: '#E1E1E1'}}/>
		        							{ this.renderSimilarHotel(hotel, similarHotel) }
		        						</View>
		        					)
		        				}
	            			})
	            		}
	            	</View>
	       		</View>
			)
		}
	},

	renderFooter() {
		return (
			<View style={{height: 44, flexDirection: 'row', borderTopWidth: 1, borderColor: '#DBDBDB'}}>
				<View style={{alignItems: 'center', justifyContent: 'center', width: 58}}>
					<Icon name='ios-star-outline' size={20} color='#989898' style={{ width: 20, height: 20, }} />
					<Text style={{color: '#989898', fontWeight: "300", fontSize: 13}}>收藏</Text>
				</View>
				<View style={{height: 44, width:1, backgroundColor: '#DBDBDB'}}/>
				<View style={{alignItems: 'center', justifyContent: 'center', width: 58}}>
					<Icon name='ios-chatbubble-outline' size={20} color='#989898' style={{width: 20, height: 20, }} />
					<Text style={{color: '#989898', fontWeight: "300", fontSize: 13}}>咨询</Text>
				</View>
				<View style={{flex:1}}>
					<TouchableOpacity style={{flex:1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFB964'}} onPress={() => this.props.navigator.push({id: 'BookHotel', hotel: this.state.hotel})}>
						<Text style={{color: '#FFFFFF', fontWeight: "300", fontSize: 16}}>预约看场地</Text>
					</TouchableOpacity>
				</View>
				<View style={{flex:1}}>
					<TouchableOpacity style={{flex:1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FF6600'}} onPress={() => this.props.navigator.push({id: 'QueryHotelSchedule', hotel: this.state.hotel})}>
						<Text style={{color: '#FFFFFF', fontWeight: "300", fontSize: 16}}>档期查询</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	},

	renderLoadding() {
		return (
			<View style={{flexDirection:'row', alignItems: 'center', justifyContent: 'center', marginTop: 15, marginBottom: 15, }}>
				<ActivityIndicatorIOS />
	        	<Text style={{color: '#A9A9A9', fontWeight: "300", fontSize: 14}}>正在更多数据...</Text>
	        </View>
	    )
	},

    render() {
    	console.info('Hotel launchMode ', this.props.launchMode);

    	if (this.state.loaded) {
    		return (
	            <View style={{flex:1}}>
	            	{ this.renderNavbar() }
	            	<ScrollView style={{flex:1, backgroundColor: '#F0EFF5'}}>
	            		{ this.renderHeader(this.state.hotel) }
	            		{ this.renderInfo(this.state.hotel) }
		                { this.renderHalls(this.state.hotel) }
		                { this.renderMenus(this.state.hotel) }
		                <HotelServices services={this.state.hotel.services} />
	               		{ this.renderReviews(this.state.hotel) }
	               		{ this.renderSimilarHotels(this.state.hotel) }  
		            </ScrollView>
		            { this.renderFooter() }
	            </View>
	        );		
    	} else {
    		if (this.props.launchMode === 1) {
	    		return (
		            <View style={{flex:1}}>
		            	{ this.renderNavbar() }
		            	<ScrollView style={{flex:1, backgroundColor: '#F0EFF5'}}>
		            		{ this.renderLoadding() }
			            </ScrollView>
			            { this.renderFooter() }
		            </View>
		        );

		    } else {
	    		return (
		            <View style={{flex:1}}>
		            	{ this.renderNavbar() }
		            	<ScrollView style={{flex:1, backgroundColor: '#F0EFF5'}}>
		            		{ this.renderHeader(this.state.hotel) }
		            		{ this.renderInfo(this.state.hotel) }
		            		{ this.renderLoadding() }
			            </ScrollView>
			            { this.renderFooter() }
		            </View>
		        );	
		    }	
    	}
    }
});

module.exports = HotelScreen;
