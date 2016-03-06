/**
 * 喜结婚礼汇酒店功能入口
 */

'use strict';

var React = require('react-native');

var HotelListScreen = require('./HotelListScreen');
var HotelScreen = require('./HotelScreen');
var QueryHotelScheduleScreen = require('./QueryHotelScheduleScreen');
var BookHotelScreen = require('./BookHotelScreen');
var HotelIntroduceScreen = require('./HotelIntroduceScreen');
var HotelMenuScreen = require('./HotelMenuScreen');
var HotelHallScreen = require('./HotelHallScreen');

var {
    AppRegistry,
    Navigator,
} = React;

var Hotels = React.createClass({
    componentDidMount() {
        console.info(this.props);
    },

    /**
     * launchMode -- 1：从nativeView启动； 0 or 不存在： 从React中调用
     */
    renderRouter(route, navigator) {
        console.info('route ...');
        console.info(route);

        switch(route.id) {
            case 'HotelList':
                return <HotelListScreen navigator={navigator} launchMode={this.props.launchView === "HotelList" ? 1 : 0 } sort={route.sort} filter={route.filter} />
            case 'Hotel': 
                return <HotelScreen navigator={navigator} launchMode={this.props.launchView === "Hotel" ? 1 : 0 }  hotel={route.hotel || this.props.hotel} />;
            case 'QueryHotelSchedule':
                return <QueryHotelScheduleScreen navigator={navigator} hotel={route.hotel} />
            case 'BookHotel':
                return <BookHotelScreen navigator={navigator} hotel={route.hotel} />
            case 'HotelIntroduce':
                return <HotelIntroduceScreen navigator={navigator} hotel={route.hotel} />
            case 'HotelMenu':
                return <HotelMenuScreen navigator={navigator} hotel={route.hotel} menu={route.menu}/>
            case 'HotelHall':
                return <HotelHallScreen navigator={navigator} hotel={route.hotel} hall={route.hall}/>
        }
    },

    render() {
        return (
            <Navigator
                ref="navigator"
                renderScene={this.renderRouter}
                initialRoute={{id: this.props.launchView}}
                configureScene={(route) => {
                    return Navigator.SceneConfigs.FloatFromRight
                }} />
        );
    }
});

module.exports = Hotels;
