import React, { Component } from 'react'
import { AsyncStorage, View, StyleSheet } from 'react-native'
import { ViroARSceneNavigator, ViroText } from 'react-viro'
import { Button } from 'react-native-paper'
import { encode64 } from '../encode/encode-base'
import colors from '../config/colors'
import asyncStrKeys from '../config/asyncStrKeys'
//import the two scenes required by the ViroARSceneNavigator
var BasketView = require('../scenes/BasketView')
var AddItem = require('../scenes/AddItem')

export default class BasketCreate extends Component {
  constructor(props) {
    super(props)

    this.state = {
      viroAppProps: {
        f_takePhoto: this._takePhoto, 
        f_pauseAddition: this._pauseAddition, 
        f_confirmItem: this._confirmItem , 
        displayObjs: []
      },
      myBasket: [],
      curScene: BasketView,
      addingItem: false,
      takenPhotos: 0
    }
  }

  render() {
    return (
      <View style={localStyles.outer} >
      {/* The ViroARSceneNavigator acts as a switch to render either the "AddItem" or the "BasketView" scenes into the BasketView screen. */}
        <ViroARSceneNavigator
          style={localStyles.arView}
          apiKey="EF33E0FF-4715-4D91-B854-0DD546CA7E8F"
          initialScene={{ scene: this.state.curScene }}
          viroAppProps={this.state.viroAppProps}
          ref={this._setARNavigatorRef}
        />

        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 50, backgroundColor: colors.FFgrey}}>
          {!this.state.addingItem ? 
          (<View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <Button 
              raised 
              onPress={() => {this._addItem()}}
              color={colors.green}>
              Add New Product
            </Button>
            <Button 
              raised 
              onPress={() => {this._checkoutBasket()}}
              color={colors.green}>
              Checkout Basket
            </Button>
          </View>) :
          (<Button 
            raised 
            onPress={() => this._pauseAddition()}
            color={colors.red}>
            Pause Addition
          </Button>)
          }
        </View>
      </View>
    );
  }

  //Functions used by .THIS screen//
  // This function creates a reffernece handle for the AR Navigator to be used by other functions
  _setARNavigatorRef = (ARNavigator) => {
    this._arNavigator = ARNavigator
  }

  // Called by the "Add Item" button. Transitions to the "AddItem" scene which starts the photo capture and product confirmation flow
  _addItem = () => {
    this._arNavigator.jump("AddItem", {scene:AddItem})
    this.setState({addingItem: true})
  }

  // Called by the "Pause Addition" button. Pauses the AddItem flow and retruns to the "BasketView" scene
  _pauseAddition = () => {
    this._arNavigator.jump("BasketView", {scene:BasketView})
    this.setState({addingItem: false})
  }

  // Called at the end of the item-capture flow. This stores the current array of basket-items in the async storage, and navigates the user to the "Recipies" page. 
  _checkoutBasket = async () => {
    /* 
    * TODO: 
    * Add the functionality for _checkoutBasket() so that the current basket is saved to the Async Storage, in order for the "Recipe" screen to access it. The 
    * basket is called up in the "Recipe" screen, so use the same key-value to store it in this function, as that is used in the "Recipe" screen to extract it. 
    * For documentation on async storage see: 
    *   Async Storage: https://facebook.github.io/react-native/docs/asyncstorage
    * 
    */ 

    //save basket to AS storage
    try{
      await AsyncStorage.setItem(asyncStrKeys.asncBasket, JSON.stringify(this.state.myBasket))
    } catch (err) {
      console.log('error checking out basket to AsyncStorage', err)
    }
    //clears the current basket
    this.setState(prevState => ({viroAppProps: {...prevState.viroAppProps, displayObjs: []}}))
    //navigate to the "Recipies" screen
    this.props.navigation.navigate('Recipe')
  }

  // Called when an item was correclty identified, and the users wants to add the product to the basket. The function is passed to the "AddItem" scene
  _confirmItem = (item = '', position) => {
    let newItem = this.state.viroAppProps.displayObjs.concat(
      [<ViroText 
        text={item} 
        scale={[.12, .12, .12]} 
        style={{fontFamily:"Arial", fontSize:70, fontWeight:'400', color: colors.white, textAlignVertical: 'center', textAlign: 'center',}} 
        extrusionDepth={5} 
        width={15} height={2}
        position={position}/>]
    )
    let newBasket = this.state.myBasket.concat([item])
    this.setState(prevState => ({viroAppProps: {...prevState.viroAppProps, displayObjs: newItem}}))
    this.setState({ myBasket: newBasket})
  }

  _takePhoto = async () => {
    const { takenPhotos } = this.state
    return new Promise((resolve, reject) => {
      this._arNavigator._takeScreenshot("figment_still_" + takenPhotos, false).then(async (rectDict) => {
        if (!rectDict.success) {
          if (rectDict.errorCode === ViroConstants.RECORD_ERROR_NO_PERMISSION) {
            console.log("Screenshot Error", "Please allow camera permissions!" + errorCode)
          }
          this.setState({ msg: 'Error' })
        }
        // retrieve the screenshot url
        const uri = rectDict.url
        const base64 = await encode64(uri)
        resolve(base64)
      }, reject)
    })
  }
}

var localStyles = StyleSheet.create({
  outer: {
    flex: 1,
  },
  arView: {
    flex: 1,
  }
})

module.exports = BasketCreate