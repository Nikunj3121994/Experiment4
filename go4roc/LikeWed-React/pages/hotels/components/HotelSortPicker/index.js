'use strict';

var React = require('react-native');
var Modal   = require('react-native-modalbox');

var styles = require('./styles');

var {
    Text,
    View,
    TouchableOpacity,
} = React;

var HotelSortPicker = React.createClass({
    _onPress(id) {
        this.refs.picker.close();
        this.props.onSelected(id);
    },

    open() {
        this.refs.picker.open();
    },

    render() { 
        var items = [
            { id: 1, title: "婚礼汇推荐排序" },
            { id: 2, title: "桌数：从高到低" },
            { id: 3, title: "桌数：从低到高" },
            { id: 4, title: "价格：从高到低" },
            { id: 5, title: "价格：从低到高" }
        ];

        return (
            <Modal style={[styles.sortPicker]} position={"bottom"} ref={"picker"}>
                 <View style={[styles.sortPickerRow]}>
                    <Text style={[styles.sortPickerTitle]}>选择排序方式</Text>
                </View>
                {
                    items.map(item => {
                        return (
                            <TouchableOpacity key={item.id} onPress={ () => { this._onPress(item.id); }} style={[styles.sortPickerRow]}>
                                <Text style={[styles.sortPickerText]}>{item.title}</Text>
                            </TouchableOpacity>
                        );
                    })
                }
            </Modal>
        );
    }
});

module.exports = HotelSortPicker;
