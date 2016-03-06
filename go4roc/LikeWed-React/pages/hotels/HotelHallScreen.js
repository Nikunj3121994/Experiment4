'use strict';

var React = require('react-native');
var Dimensions = require('Dimensions');
var Swiper = require('react-native-swiper');
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

var HotelHallScreen = React.createClass({
    renderNavbar() {
        return (
            <NavigationBar
                title={{title: "婚宴大厅详情"}}
                leftButton={
                    <TouchableOpacity onPress={() => this.props.navigator.pop()}>
                        <Icon name='ios-arrow-back'size={20} color='#e9573e' style={{ marginLeft: 10, marginRight: 10, width: 20, height: 20, }} />
                    </TouchableOpacity>
                } />
        )
    },

    renderHeader(hall) {
        return (
            <View style={{backgroundColor: "#FFFFFF"}}>
                <Swiper showsButtons={false} autoplay={false} height={203} showsPagination={false}>
                    {
                        hall.pics.map((pic, index) => {
                            return (
                                <Image style={{height:203, resizeMode: Image.resizeMode.cover, }} source={{uri: pic+'!wechat'}}>
                                    <View style={{flex:1, justifyContent: 'flex-end', alignItems: 'flex-start'}}>
                                        <Text style={{margin:10, color: "#FFFFFF"}}>{index+1}/{hall.pics.length}</Text>
                                    </View>
                                </Image>
                            );
                        })
                    }
                </Swiper>
            </View>
        );
    },

    renderInfo(hall) {
        return (
            <View style={{marginTop: 15, backgroundColor: "#FFFFFF"}}>
                <View style={{alignItems: 'center', padding: 15}} >
                    <Text style={{color: '#A9A9A9', fontWeight: "300", fontSize: 16}}>环境</Text>
                </View>
                <View style={{}}>
                    <View style={{flexDirection: 'row', paddingTop: 15, paddingLeft: 15, paddingRight: 15, paddingBottom: 15,}}>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{color: '#343434', fontWeight: "300", fontSize: 16}}>场地名称</Text>
                        </View>
                        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent:'flex-end'}}>
                            <Text style={{marginRight: 8, color: '#FA7621', fontWeight: "300", fontSize: 14}}>{hall.name}</Text>
                        </View>
                    </View>
                    <View style={{height: 1, backgroundColor: '#E1E1E1'}}/>
                    <View style={{flexDirection: 'row', paddingTop: 15, paddingLeft: 15, paddingRight: 15, paddingBottom: 15,}}>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{color: '#343434', fontWeight: "300", fontSize: 16}}>层高</Text>
                        </View>
                        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent:'flex-end'}}>
                            <Text style={{marginRight: 8, color: '#FA7621', fontWeight: "300", fontSize: 14}}>{hall.height}</Text>
                        </View>
                    </View>
                    <View style={{height: 1, backgroundColor: '#E1E1E1'}}/>
                    <View style={{flexDirection: 'row', paddingTop: 15, paddingLeft: 15, paddingRight: 15, paddingBottom: 15,}}>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{color: '#343434', fontWeight: "300", fontSize: 16}}>面积</Text>
                        </View>
                        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent:'flex-end'}}>
                            <Text style={{marginRight: 8, color: '#FA7621', fontWeight: "300", fontSize: 14}}>{hall.area}平米</Text>
                        </View>
                    </View>
                    <View style={{height: 1, backgroundColor: '#E1E1E1'}}/>
                    <View style={{flexDirection: 'row', paddingTop: 15, paddingLeft: 15, paddingRight: 15, paddingBottom: 15,}}>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{color: '#343434', fontWeight: "300", fontSize: 16}}>形状</Text>
                        </View>
                        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent:'flex-end'}}>
                            <Text style={{marginRight: 8, color: '#FA7621', fontWeight: "300", fontSize: 14}}>{hall.shape}</Text>
                        </View>
                    </View>
                    <View style={{height: 1, backgroundColor: '#E1E1E1'}}/>
                    <View style={{flexDirection: 'row', paddingTop: 15, paddingLeft: 15, paddingRight: 15, paddingBottom: 15,}}>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{color: '#343434', fontWeight: "300", fontSize: 16}}>立柱</Text>
                        </View>
                        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent:'flex-end'}}>
                            <Text style={{marginRight: 8, color: '#FA7621', fontWeight: "300", fontSize: 14}}>{hall.pillars}根</Text>
                        </View>
                    </View>
                    <View style={{height: 1, backgroundColor: '#E1E1E1'}}/>
                    <View style={{flexDirection: 'row', paddingTop: 15, paddingLeft: 15, paddingRight: 15, paddingBottom: 15,}}>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{color: '#343434', fontWeight: "300", fontSize: 16}}>最大容纳桌数</Text>
                        </View>
                        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent:'flex-end'}}>
                            <Text style={{marginRight: 8, color: '#FA7621', fontWeight: "300", fontSize: 14}}>{hall.capacity}桌</Text>
                        </View>
                    </View>
                    <View style={{height: 1, backgroundColor: '#E1E1E1'}}/>
                    <View style={{flexDirection: 'row', paddingTop: 15, paddingLeft: 15, paddingRight: 15, paddingBottom: 15,}}>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{color: '#343434', fontWeight: "300", fontSize: 16}}>起订桌数</Text>
                        </View>
                        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent:'flex-end'}}>
                            <Text style={{marginRight: 8, color: '#FA7621', fontWeight: "300", fontSize: 14}}>{hall.start.count}桌</Text>
                        </View>
                    </View>
                    <View style={{height: 1, backgroundColor: '#E1E1E1'}}/>
                    <View style={{flexDirection: 'row', paddingTop: 15, paddingLeft: 15, paddingRight: 15, paddingBottom: 15,}}>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{color: '#343434', fontWeight: "300", fontSize: 16}}>婚宴价格</Text>
                        </View>
                        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent:'flex-end'}}>
                            <Text style={{marginRight: 8, color: '#FA7621', fontWeight: "300", fontSize: 14}}>¥{hall.start.price}桌起</Text>
                        </View>
                    </View>
                    <View style={{height: 1, backgroundColor: '#E1E1E1'}}/>
                    <View style={{flexDirection: 'row', paddingTop: 15, paddingLeft: 15, paddingRight: 15, paddingBottom: 15,}}>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{color: '#343434', fontWeight: "300", fontSize: 16}}>其他</Text>
                        </View>
                        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent:'flex-end'}}>
                            <Text style={{marginRight: 8, color: '#FA7621', fontWeight: "300", fontSize: 14}}>{hall.other}</Text>
                        </View>
                    </View>
                    <View style={{height: 1, backgroundColor: '#E1E1E1'}}/>
                </View>
            </View>
        );
    },

    renderSupport(hall) {
        return (
            <View style={{marginTop: 15, backgroundColor: "#FFFFFF"}}>
                <View style={{alignItems: 'center', padding: 15}} >
                    <Text style={{color: '#A9A9A9', fontWeight: "300", fontSize: 16}}>配套和服务</Text>
                </View>
                <View style={{}}>
                    <View style={{flexDirection: 'row', paddingTop: 15, paddingLeft: 15, paddingRight: 15, paddingBottom: 15,}}>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{color: '#343434', fontWeight: "300", fontSize: 16}}>LED屏幕</Text>
                        </View>
                        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent:'flex-end'}}>
                            <Text style={{marginRight: 8, color: '#FA7621', fontWeight: "300", fontSize: 14}}>有</Text>
                        </View>
                    </View>
                    <View style={{height: 1, backgroundColor: '#E1E1E1'}}/>
                    <View style={{flexDirection: 'row', paddingTop: 15, paddingLeft: 15, paddingRight: 15, paddingBottom: 15,}}>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{color: '#343434', fontWeight: "300", fontSize: 16}}>舞台</Text>
                        </View>
                        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent:'flex-end'}}>
                            <Text style={{marginRight: 8, color: '#FA7621', fontWeight: "300", fontSize: 14}}>有</Text>
                        </View>
                    </View>
                    <View style={{height: 1, backgroundColor: '#E1E1E1'}}/>
                    <View style={{flexDirection: 'row', paddingTop: 15, paddingLeft: 15, paddingRight: 15, paddingBottom: 15,}}>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{color: '#343434', fontWeight: "300", fontSize: 16}}>T台</Text>
                        </View>
                        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent:'flex-end'}}>
                            <Text style={{marginRight: 8, color: '#FA7621', fontWeight: "300", fontSize: 14}}>有</Text>
                        </View>
                    </View>
                    <View style={{height: 1, backgroundColor: '#E1E1E1'}}/>
                    <View style={{flexDirection: 'row', paddingTop: 15, paddingLeft: 15, paddingRight: 15, paddingBottom: 15,}}>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{color: '#343434', fontWeight: "300", fontSize: 16}}>灯光音响</Text>
                        </View>
                        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent:'flex-end'}}>
                            <Text style={{marginRight: 8, color: '#FA7621', fontWeight: "300", fontSize: 14}}>有</Text>
                        </View>
                    </View>
                    <View style={{height: 1, backgroundColor: '#E1E1E1'}}/>
                </View>
            </View>
        );
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
                <View style={{flex:1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFB964'}}>
                    <Text style={{color: '#FFFFFF', fontWeight: "300", fontSize: 16}}>预约看场地</Text>
                </View>
                <View style={{flex:1}}>
                    <TouchableOpacity style={{flex:1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FF6600'}} onPress={() => this.props.navigator.push({id: 'QueryHotelSchedule', hotel: this.props.hotel})}>
                        <Text style={{color: '#FFFFFF', fontWeight: "300", fontSize: 16}}>档期查询</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    },

    render() {
        return (
            <View style={{flex:1}}>
                { this.renderNavbar() }
                <ScrollView style={{flex:1, backgroundColor: '#F0EFF5'}}>
                    { this.renderHeader(this.props.hall) }
                    { this.renderInfo(this.props.hall) }
                    { this.renderSupport(this.props.hall) }
                </ScrollView>
                { this.renderFooter() }
            </View>
                    
        );    
    }
});

module.exports = HotelHallScreen;
