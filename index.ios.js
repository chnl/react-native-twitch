'use strict';

var React = require('react-native');
var Dimensions = require('Dimensions');
var Drawer = require('react-native-drawer');

var DrawerScreen = require('./components_screens/DrawerScreen'),
  CurrentStream = require('./components/CurrentStream'),
  GamesScreen = require('./components_screens/GamesScreen');

var applicationActions = require('./actions/applicationActions');

var SCREEN_WIDTH = Dimensions.get('window').width;
var openDrawerOffset = 75;

var isDrawer = false;

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  NavigatorIOS,
  TouchableHighlight,
  StatusBarIOS,
} = React;

StatusBarIOS.setStyle('light-content');

var MainView = React.createClass({
  getInitialState: function() {
    return {
      currentStream: null,
    };
  },

  emitCurrentStream: function(stream) {
    applicationActions.changeCurrentStreamStatus(!!stream);
    this.setState({ currentStream: stream });
  },

  renderCurrentStream: function() {
    if (!this.state.currentStream) {
      return null;
    }
    return (
      <CurrentStream stream={this.state.currentStream} setCurrentStream={this.emitCurrentStream}/>
    );
  },

  render: function() {

    return (
      <View style={{ flex: 1 }}>
        <NavigatorIOS
          style={{flex: 1}}
          barTintColor='#6441A5'
          titleTextColor='#fff'
          tintColor='#fff'
          ref="nav"
          initialRoute={{
            component: GamesScreen,
            title: 'Games',
            leftButtonIcon: require('image!tabnav_list'),
            onLeftButtonPress: () => {
              if (isDrawer) {
                this.props.closeDrawer();
              } else {
                this.props.openDrawer();
              }
            },
            passProps: {
              closeDrawer: this.props.closeDrawer,
              emitCurrentStream: this.emitCurrentStream,
            },
          }}
        />
        {this.renderCurrentStream()}
      </View>
    );
  }
});

var App = React.createClass({
  closeDrawer: function(){
    isDrawer = false;
    this.refs.drawer.close();
  },
  openDrawer: function(){
    isDrawer = true;
    this.refs.drawer.open();
  },
  render: function() {
    return (
      <Drawer
        ref="drawer"
        type="static"
        openDrawerOffset={openDrawerOffset}
        panOpenMask={.5}
        onOpen={() => isDrawer = true}
        onClose={() => isDrawer = false}
        content={<DrawerScreen closeDrawer={this.closeDrawer}/>}
        >
          <MainView
            closeDrawer={this.closeDrawer}
            openDrawer={this.openDrawer}
          />
      </Drawer>
    );
  }
});

var imgRatio = 202 / 145,
  imgMargin = 15,
  perRow = 2,
  imgWidth = (SCREEN_WIDTH - imgMargin * (perRow + 1)) / perRow,
  imgHeight = imgRatio * imgWidth;

var styles = StyleSheet.create({
  header: {
    backgroundColor: '#6441A5',
  },

  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  gameView: {
    marginLeft: imgMargin,
    marginTop: imgMargin,
    backgroundColor: 'grey', 
  },

  gameContainer: {
    flexDirection: 'row',
  },

  gameImg: {
    width: imgWidth,
    height: imgHeight,
  },

  gameText: {
    fontWeight: '200',
    fontSize: 28,
  },

  gameTextDesc: {
    color: '#aaa',
    lineHeight: 20,
  },
});

AppRegistry.registerComponent('twitch', () => App);