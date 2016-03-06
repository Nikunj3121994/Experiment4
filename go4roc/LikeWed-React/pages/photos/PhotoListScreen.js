/**
 * 婚纱摄影业务功能主界面
 * 1. 婚纱摄影服务列表
 */
var React = require('react-native');

var {
    StyleSheet,
    Text,
    Image,
    View,
} = React;

var PhotoListScreen = React.createClass({
  render: function() {
    return (
      <View style={styles.container}>
        <View style={{flex:1, justifyContent: 'center', alignItems: 'center',  backgroundColor: '#FF6600'}}>
          <Text style={styles.welcome}>
            Welcome to React Native!
          </Text>
        </View>
        <View style={{flexDirection: 'row', flex:1}}>
          <View style={{flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#006666'}}>
            <Text style={styles.welcome}>
              Left
            </Text>
          </View>
          <View style={{flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#660066'}}>
            <Text style={styles.welcome}>
              right
            </Text>
          </View>
        </View>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcome: {
    textAlign: 'center',
    color: 'white',
    marginBottom: 5,
  },
});

module.exports = PhotoListScreen;
