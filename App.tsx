import React, {useEffect} from 'react';
import {
  View,
  NativeModules,
  PermissionsAndroid,
  Alert,
  DeviceEventEmitter,
} from 'react-native';

//navigation
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import RootStackNavigation from './src/navigation/rootStackNavigation';
import {RecoilRoot} from 'recoil';

function App(): JSX.Element {
  return (
    <RecoilRoot>
      <SafeAreaProvider>
        <NavigationContainer>
          <RootStackNavigation />
        </NavigationContainer>
      </SafeAreaProvider>
    </RecoilRoot>
  );
}

export default App;
