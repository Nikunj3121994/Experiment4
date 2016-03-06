'use strict';

var React = require('react-native');

var {
    Text,
    View,
    Image,
    TouchableOpacity,
} = React;

var styles = require('./styles');

var HotelCard = React.createClass({
    render() { 
        var hotel = this.props.hotel;

        var capacity = hotel.capacity.start === hotel.capacity.end ? hotel.capacity.start: hotel.capacity.start +'-' + hotel.capacity.end;
        var price = hotel.price.start === hotel.price.end ? hotel.price.start : hotel.price.start +'-' + hotel.price.end;
        return (
            <TouchableOpacity onPress={() => this.props.navigator.push({id: 'Hotel', hotel: hotel}) }>
                <View key={hotel._id} style={{flexDirection: 'row', paddingTop: 12, paddingBottom:12, paddingLeft:10, paddingRight: 10, borderBottomWidth:1, borderColor: "#E1E1E1"}}>
                    <Image style={{width: 120, height: 88, resizeMode: Image.resizeMode.cover, }} source={{uri: hotel.pics[0].url+'!380x'}} />
                    <View style={{flex:1, paddingLeft: 8}}>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{color: '#343434', fontWeight: "300", fontSize: 16}}>{hotel.name}</Text>
                        </View>
                        <View style={{flexDirection: 'row', marginTop: 8}}>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={{color: '#FA7621', fontWeight: "300", fontSize: 14}}>{hotel.score}分</Text>
                                <Text style={{color: '#a7a7a7', fontWeight: "300", fontSize: 14}}>/{hotel.stats.reviews}评论</Text>
                            </View>
                            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', }} >
                                <Text style={{color: '#FA7621', fontWeight: "400", fontSize: 14}}><Text style={{color: '#FA7621', fontWeight: "300", fontSize: 9}}>¥</Text>{price}/桌</Text>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', marginTop: 8, }}>
                            <Text style={{marginRight: 8, color: '#a7a7a7', fontWeight: "300", fontSize: 13}}>{hotel.category}</Text>
                            <Text style={{marginRight: 8, color: '#a7a7a7', fontWeight: "300", fontSize: 13}}>{capacity}桌</Text>
                            <View style={{paddingTop: 2, flex:1, flexDirection: 'row', justifyContent: 'flex-end', }}>
                                <Text style={{paddingLeft:3, paddingRight: 3, borderRadius: 3, borderWidth:1, borderColor: '#FA7621', marginLeft: 8, color: '#FA7621', fontWeight: "300", fontSize: 9}}>订单返现</Text>
                                <Text style={{paddingLeft:3, paddingRight: 3, borderRadius: 3, borderWidth:1, borderColor: '#FA7621', marginLeft: 8, color: '#FA7621', fontWeight: "300", fontSize: 9}}>预约红包</Text>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', marginTop: 8, }}>
                            <View style={{flex:1}}>
                                <Text numberOfLines={1} style={{marginRight: 8, color: '#a7a7a7', fontWeight: "300", fontSize: 13}}>{hotel.location.district}・{hotel.location.description}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
});

module.exports = HotelCard;
