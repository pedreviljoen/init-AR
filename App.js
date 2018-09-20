import React, { Component } from 'react'
import { StyleSheet, StatusBar, Platform, View } from 'react-native'
import {
  ViroARSceneNavigator
} from 'react-viro'

//import constant from './config/constant'
import {obtainResults} from './services/network'

// Navigation
import Navigation from './Navigation'

//
let sharedProps = {
  //apiKey: constant.API_KEY_AR
  apiKey:"EF33E0FF-4715-4D91-B854-0DD546CA7E8F"
}
let InitialARScene = require('./js/HelloWorldSceneAR')
const isAndroid = Platform.OS === 'android' ? true : false

export default class ViroSample extends Component {

  render() {
    return (
      <View style={styles.main}>
        <StatusBar
          hidden={true}
        />
        <Navigation />
      </View>
      )
  }
  
}

var styles = StyleSheet.create({
  main: {
    flex: 1
  },
  arView: {
    flex: 1
  },

});

module.exports = ViroSample
