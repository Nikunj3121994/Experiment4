'use strict';

var React = require('react-native');
var NavigationBar = require('./components/NavigationBar');
var Icon = require('react-native-vector-icons/Ionicons');
var RefreshableListView = require('react-native-refreshable-listview');
var Modal   = require('react-native-modalbox');
var UserDefaults = require('react-native-userdefaults-ios');

var ReactViewController = require('NativeModules').ReactViewController;

var {
    StyleSheet,
    Text,
    Image,
    View,
    ScrollView,
    ListView,
    ActivityIndicatorIOS,
    TouchableOpacity
} = React;

var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');

var HotelSortPicker = require('./components/HotelSortPicker');
var HotelFilterPicker = require('./components/HotelFilterPicker');
var HotelCard = require('./components/HotelCard');

var styles = require('../../styles/HotelStyles');
var indicatorStyles = require('../../styles/IndicatorStyles');

// var HOTEL_LIST_API = "http://api.likewed.net/V1/hotels";
var HOTEL_LIST_API = "http://localhost:9928/V1/hotels";

var PAGE_SIZE = 10;

var DefaultFilters = {
    category: "不限",
    district: "不限",
    price: "不限",
    capacity: "不限",
    features: ["不限"]
};

var HotelListScreen = React.createClass({
    resultsCache: {
        items: [],
        total: 0,
        nextPage: 1
    },

    city: '-1_-1', //缺省的位置：全国

    getInitialState() {
        return {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2
            }),
            sortId: 1,
            filters: DefaultFilters,
            loaded: false
        };
    },

    componentDidMount() {
        UserDefaults.stringForKey('HLH_CUR_CITYID')
            .then(value => {
                if (value) this.city = value;
                this.fetchTopicsData();
            });
    },

    _loadMore() {
        this.fetchTopicsData();
    },

    _reload() {
        this.fetchTopicsData(true);
    },

    fetchTopicsData(reload) {
        var queryItems = ["city="+encodeURIComponent(this.city)];
        var filters = this.state.filters;

        for (var key in filters) {
            let value = filters[key];
            if (value !== "") {
                queryItems.push(key+"="+encodeURIComponent(value));
            }
        }

        queryItems.push('sort='+this.state.sortId);

        if (!reload) {
            queryItems.push('page='+this.resultsCache.nextPage);
        }

        fetch(HOTEL_LIST_API+"?"+queryItems.join('&'))
            .then(res => res.json())
            .then(data => {
                if (reload) this.resultsCache = { items: [], total: 0, nextPage: 1 };

                this.resultsCache.items.push(...data.items);
                this.resultsCache.total = data.total;
                this.resultsCache.nextPage += 1; 

                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(this.resultsCache.items),
                    loaded: true
                });
             })
            .catch(err => {
                console.info(err);
                alert('获取酒店数据错误');
            });
    },  

    renderNavbar() {
        return (
            <NavigationBar
                title={
                    <View style={styles.navbarCenter}>
                        <Text style={styles.navbarTitle}>婚宴酒店</Text>
                        <Text style={styles.navbarSubTitle}>{this.resultsCache.total}家酒店</Text>
                    </View>
                }
                leftButton={
                    <TouchableOpacity onPress={() => { ReactViewController.closeViewController(); } }>
                        <Icon name='ios-arrow-back' size={24} color='#e9573e' style={[{ marginLeft: 10, marginRight: 10, width: 24, height: 24, }, this.props.style]} />
                    </TouchableOpacity>
                }
                rightButton={
                    <TouchableOpacity onPress={() => this.props.navigator.push({id: 'ShareHotel', hotel: this.props.hotel})}>
                        <Icon name='ios-search' size={24} color='#e9573e' style={[{ marginLeft: 10, marginRight: 10, width: 24, height: 24, }, this.props.style]} />
                    </TouchableOpacity>
                } />
        )
    },

    renderFilterBar() {
        return (
            <View style={styles.filterbar}>
                <TouchableOpacity style={styles.filterbarItem} onPress={this.openSortPicker} >
                    <Icon name='ios-shuffle' size={24} color='#e9573e' style={[{ marginLeft: 10, marginRight: 10, width: 20, height: 20, }, this.props.style]} />
                    <Text style={styles.filterbarLabel}>排序</Text>
                </TouchableOpacity>
                <View style={[styles.separatorColor, {width: 1, height: 20}]} />
                <TouchableOpacity style={styles.filterbarItem} onPress={this.openFilterPicker} >
                    <Icon name='ios-settings' size={20} color='#e9573e' style={[{ marginLeft: 10, marginRight: 10, width: 20, height: 20, }, this.props.style]} />
                    <Text style={styles.filterbarLabel}>筛选</Text>
                </TouchableOpacity>
            </View>
        );
    },

    openSortPicker(id) {
        this.refs.sortPicker.open();
    },

    openFilterPicker(id) {
        this.refs.filterPicker.open();
    },

    onSortSelected(id) {
        this.setState({loaded: false, sortId: id});

        this.fetchTopicsData(true);
    },

    onFilterChanged(selectedFilters) {
        this.setState({filters: selectedFilters, loaded: false});

        this.fetchTopicsData(true);
    },

    render() {
        if (this.state.loaded) {
            return (
                <View style={styles.screen}>
                    { this.renderNavbar() }
                    { this.renderFilterBar() }
                    <RefreshableListView
                        initialListSize={8}
                        pageSize={8}
                        onEndReached={this._loadMore}
                        dataSource={ this.state.dataSource }
                        renderRow={ hotel => <HotelCard hotel={hotel} currentCity={this.city} navigator={this.props.navigator} /> }
                        style={styles.listContainer }
                        removeClippedSubviews={true}
                        onEndReachedThreshold={0}
                        loadData={this._reload}
                        refreshDescription='正在刷新...'
                        refreshingIndictatorComponent={
                            <RefreshableListView.RefreshingIndicator stylesheet={ indicatorStyles } />
                        }
                        minDisplayTime={500}
                        minPulldownDistance={80}
                        minBetweenTime={2000} />
                    <HotelSortPicker ref="sortPicker" onSelected={ this.onSortSelected } sortId={ this.state.sortId } />
                    <HotelFilterPicker ref="filterPicker" onFilterChanged={ this.onFilterChanged } filters={this.state.filters}/>
                </View>
            );
        } else {
            return (
                <View style={styles.screen}>
                    { this.renderNavbar() } 
                    <View style={{flex:1, alignItems: 'center', justifyContent: 'center'}}>
                        <ActivityIndicatorIOS size="large"/>
                    </View>
                </View>
            );
        }
    },
});

module.exports = HotelListScreen;
