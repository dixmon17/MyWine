/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import Navigation from './src/navigation/navigation'
// import Store from './src/orm/store'
import { StatusBar } from 'react-native'
import BackupContainer from './src/Components/User/BackupContainer'
import GlobalFont from 'react-native-global-font'
import AwesomeIcon from 'react-native-vector-icons/FontAwesome5'
import { TouchableRipple, Provider as PaperProvider } from 'react-native-paper'
import { mytheme } from './src/navigation/mytheme'
import changeNavigationBarColor, { hideNavigationBar, showNavigationBar } from 'react-native-navigation-bar-color';
import { LogBox } from 'react-native'
// LogBox.ignoreLogs([
//   'Cannot update a component from inside the function body of a different component.', // TODO: Remove when fixed
// ])

// 'Can\'t perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in the componentWillUnmount method.', // TODO: Remove when fixed

import { Provider } from 'react-redux'
import Store from './src/orm/store'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import firestore from '@react-native-firebase/firestore';

// async function bootstrap() {
//   await firestore().settings({
//     persistence: false, // disable offline persistence
//   });
// }

const App: () => React$Node = () => {
  // bootstrap()
  
  let persistor = persistStore(Store)

  GlobalFont.applyGlobal('OpenSans-Regular')

  changeNavigationBarColor('#053C5C', true)

  //Disable Ripple on Android
  TouchableRipple.supported = false

  return (
    <Provider store={Store}>
      <PaperProvider
        settings={{
          icon: props => <AwesomeIcon {...props} size={17}/>,
        }}
        theme={mytheme}
        style={{flex:1}}
      >
        <PersistGate persistor={persistor}>
          <StatusBar barStyle="light-content" backgroundColor="#DB5460" />
          <BackupContainer />
          <Navigation/>
        </PersistGate>
      </PaperProvider>
    </Provider>
  );
};

export default App
