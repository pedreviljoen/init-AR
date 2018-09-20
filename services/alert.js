import React from 'react'
import { Alert } from 'react-native'

const notif = (message) =>
    Alert.alert(
      'init Alert',
      message,
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ],
      { cancelable: false }
    )

export default notif