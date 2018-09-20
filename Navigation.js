import { createStackNavigator } from 'react-navigation'
import {createMaterialTopTabNavigator} from 'react-navigation'
// screens
import Home from './screens/Home'
import BasketCreate from './screens/BasketCreate'
import Recipe from './screens/Recipe'
// config
import colors from './config/colors'

// Tab navigator configuration object, specifying the config for the navigator created above //
const tabNavConfig = {
  initialRouteName: 'Home',
  tabBarOptions:{
    style: {
      backgroundColor: colors.FFblack
    },
    indicatorStyle: {
      backgroundColor: colors.FFred
    }
  }
}

// Tab Navigator Component - created using React Native's "createNavigator" //
const TabNavigator = createMaterialTopTabNavigator(
  { Home: { screen: Home, path: '/screens/Home'},
    Basket: { screen: BasketCreate, path: '/screens/BasketCreate'},
    Recipe: { screen: Recipe, path: '/screens/Recipe'},
  }, 
  tabNavConfig)

// Export the Tab Navigator Component in order to use in your App.json entry point
export default TabNavigator