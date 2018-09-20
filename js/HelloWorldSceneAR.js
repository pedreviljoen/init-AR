'use strict';

import React, { Component } from 'react';

import {StyleSheet, View} from 'react-native';

import {
  ViroARScene,
  ViroText,
  ViroConstants,
} from 'react-viro';

export default class HelloWorldSceneAR extends Component {

  constructor() {
    super();

    this.state = {
      text : "Initializing AR..."
    }
  }

  render() {
    //TODO: confirm is function is passed correctly
    //TODO: returns [string], most likely matches to identity of object
    const {takePhoto} = this.props.action
    return (
        <ViroARScene onTrackingUpdated={this._onInitialized}>
          {/*
            TODO: add render and adding of scenes
          */}
          <ViroText text={this.state.text} scale={[.5, .5, .5]} position={[0, 0, -1]} style={styles.helloWorldTextStyle} />
        </ViroARScene>
    );
  }

  _onInitialized = (state, reason) => {
    if (state == ViroConstants.TRACKING_NORMAL) {
      this.setState({
        text : "Hello Pedre!"
      });
    } else if (state == ViroConstants.TRACKING_NONE) {
      console.log('Tracking lost')
    }
  }
}

var styles = StyleSheet.create({
  helloWorldTextStyle: {
    fontFamily: 'Arial',
    fontSize: 30,
    color: '#ffffff',
    textAlignVertical: 'center',
    textAlign: 'center',  
  },
});

module.exports = HelloWorldSceneAR;
