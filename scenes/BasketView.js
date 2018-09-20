// Library Imports
'use strict'
import React, { Component } from 'react'
import { ViroARScene } from 'react-viro'

export default class BasketView extends Component {

  constructor() {
    super();
    this.state = { 
    }
  }

  render() {

    return (
      <ViroARScene>
        {this.props.arSceneNavigator.viroAppProps.displayObjs}
      </ViroARScene>
    )
  }

}

module.exports = BasketView