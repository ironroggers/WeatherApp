import 'react-native-gesture-handler';  // This must be the first import
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView, StatusBar } from 'react-native';

// Import Screens
import HomeScreen from './src/views/home.screen'
import WeatherScreen from './src/views/weather-search.screen';

// Create Stack Navigator
const Stack = createStackNavigator();

const App = () => {
  return (
      <NavigationContainer>
        <SafeAreaView style={{ flex: 1 }}>
          <StatusBar barStyle="dark-content" />
          <Stack.Navigator
              initialRouteName="Home"
              screenOptions={{
                  headerStyle: {
                      backgroundColor: '#4c669f',
                  },
                  headerTintColor: '#fff',
                  headerTitleStyle: {
                      fontWeight: 'bold',
                  },
                  headerBackTitle: 'Back',  // iOS back button text
                  // headerBackTitleVisible: false,  // Hide the back title
                  headerTitle: '',  // Remove the header title
              }}
          >
              <Stack.Screen
                  name="Home"
                  component={HomeScreen}
                  options={{ headerShown: false }}
              />
              <Stack.Screen
                  name="Weather"
                  component={WeatherScreen}
              />
          </Stack.Navigator>
        </SafeAreaView>
      </NavigationContainer>
  );
};

export default App;
