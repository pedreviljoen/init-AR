import React, { Component } from 'react'
import { View, StyleSheet, Text, WebView, AsyncStorage } from 'react-native'
import { Button, Title } from 'react-native-paper'
//config
import colors from '../config/colors'
import asyncStrKeys from '../config/asyncStrKeys'

export default class Recipe extends Component {

  constructor(props){
    super(props)
    this.state = {
      basket: [],
      checkedOut: false
    }
  }

  async componentDidMount(){
    await this._fetchBasket()
  }

  render() {

    return (
      <View style={localStyles.outer}>
        <View style={{height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: 5}}>
          <Title>Your Basket</Title>
        </View>
        <View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
          <Text>Your Basket Currently Contains:</Text>
          <Text>{this.state.basket.toString()}  </Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: 5}}>
        
          <Button 
            raised 
            onPress={() => {this._checkoutBasket()}}
            color={colors.modalBackground}>
            Find Recipes
          </Button>
          <Button 
            raised 
            onPress={() => {this._clearbasket()}}
            color={colors.modalBackground}>
            Clear Basket
          </Button>
        
        </View>
        <View style={{flex: 1, paddingTop: 7}}>
        {this.state.checkedOut ? 
        (
          <WebView
            source={{uri: 'https://www.myrecipes.com/search?f[0]=tm_ingredient_name%3A' + this.state.basket.reduce((acc, curVal) => {return acc + `${curVal}%7C`},'')}}
          />
        ) : 
        (null)}
        </View>
      </View>
    )
  }

  _checkoutBasket = async () => {
    this._fetchBasket()
    this.setState({checkedOut: true})
  }

  _clearbasket = async () => {
    try{
      //async clear
      await AsyncStorage.setItem(asyncStrKeys.asncBasket, '')
    } catch (err) {
      console.log("basket async-clear error on _clearBasket()", err)
    }
    //state basket clear & change button
    this.setState({checkedOut: false, basket: []})
  }

  _fetchBasket = async () => {
    let basketIn = ['no basket retrieved...']
    let raw = ''
    try{
      raw = await AsyncStorage.getItem(asyncStrKeys.asncBasket)
      basketIn  = JSON.parse(raw)
      if(!Array.isArray(basketIn)){
        basketIn = ['basket empty']
      }
    } catch (err) {
      basketIn = ['no basket retrieved...']
      console.log('basket fetch error on compDidMount', err)
    }
    this.setState({basket: basketIn})
  }

}

var localStyles = StyleSheet.create({
  outer : {
    flex : 1,
    flexDirection: 'column',
  },
})