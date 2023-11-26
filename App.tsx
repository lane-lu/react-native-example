/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {Button} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import PropertyScreen from './screen/property-screen';
import NetworkScreen from './screen/network-screen';
import FileListScreen from './screen/file-list-screen';
import UpdateScreen from './screen/update-screen';
import WorkOrderListScreen from './screen/work-order-list-screen';
import SyncScreen from './screen/sync-screen';

type RootStackParamList = {
  Home: undefined;
  'Application Property': undefined;
  'Work Orders': undefined;
  Network: undefined;
  'Sync with Server': undefined;
  'File List': undefined;
  Update: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList>;

const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{title: 'Welcome'}}
        />
        <Stack.Screen name="Application Property" component={PropertyScreen} />
        <Stack.Screen name="Network" component={NetworkScreen} />
        <Stack.Screen name="Work Orders" component={WorkOrderListScreen} />
        <Stack.Screen name="Sync with Server" component={SyncScreen} />
        <Stack.Screen name="File List" component={FileListScreen} />
        <Stack.Screen name="Update" component={UpdateScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const HomeScreen = ({navigation}: Props) => {
  return (
    <>
      <Button
        title="Application Property"
        onPress={() => navigation.navigate('Application Property')}
      />
      <Button title="Network" onPress={() => navigation.navigate('Network')} />
      <Button
        title="Work Orders"
        onPress={() => navigation.navigate('Work Orders')}
      />
      <Button
        title="Sync with Server"
        onPress={() => navigation.navigate('Sync with Server')}
      />
      <Button
        title="File List"
        onPress={() => navigation.navigate('File List')}
      />
      <Button title="Update" onPress={() => navigation.navigate('Update')} />
    </>
  );
};

export default App;
