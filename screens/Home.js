import React, { Component } from 'react'
import { View, StyleSheet, Image, Text } from 'react-native'
import { Button, Title } from 'react-native-paper'

//miport config
import colors from '../config/colors'
import images from '../config/images'

export default class Home extends Component {

  render() {
    return (
      <View style={localStyles.outer} >
        <View style={{flex: 4, justifyContent: 'center', alignItems: 'center'}}>
          <Image
          source={images.ff_logo}
          style={{width: '100%', height: '100%', resizeMode: 'contain'}}
          />
        </View>

        <View style={{flex: 3, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 27, color: colors.FFblack}}>Welcome to the INIT.ws</Text>
          <Text style={{fontSize: 27, color: colors.FFblack}}>recipe builder app</Text>
        </View>
        
        <View style={{flex: 3, justifyContent: 'center', alignItems: 'center'}}>
        {/* 
        * TODO: Add a button that allows you to navigate the the 'Basket' screen by pressing the button. Make use of a react-native-paper Button element (imported
        *  above). For documentation on the Button and navigating between pages, see:
        * - react-native-paper: https://callstack.github.io/react-native-paper/button.html 
        * - navigation: https://facebook.github.io/react-native/docs/navigation
        * 
        */ }
            <Button 
              raised
              onPress={() => this.props.navigation.navigate('Basket')}
              color={colors.FFred}>
              Create Your Basket
            </Button>
        </View>

      </View>
    )
  }
}

var localStyles = StyleSheet.create({
  outer : {
    flex : 1,
    flexDirection: 'column',
  },

  arView: {
    flex:1,
  },
});

