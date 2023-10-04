/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {Button, Text, TextInput} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import PropertyEditor from '@interpro/react-native-property-editor';
import {IpBarcodeScanner} from '@interpro/react-native-barcode-scanner';

type RootStackParamList = {
  Home: undefined;
  'Set Server URL': undefined;
  'Get Server URL': undefined;
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
        <Stack.Screen name="Set Server URL" component={SetPropertyScreen} />
        <Stack.Screen name="Get Server URL" component={GetPropertyScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const HomeScreen = ({navigation}: Props) => {
  return (
    <>
      <Button
        title="Set Server URL"
        onPress={() => navigation.navigate('Set Server URL')}
      />
      <Button
        title="Get Server URL"
        onPress={() => navigation.navigate('Get Server URL')}
      />
    </>
  );
};

const SetPropertyScreen = () => {
  const [serverURL, setServerURL] = React.useState<string | undefined>(
    'https://',
  );

  const scannerRef = React.useRef<IpBarcodeScanner>(null);

  React.useEffect(() => {
    PropertyEditor.getString('x-server-url').then(setServerURL);
  }, []);

  return (
    <>
      <Text>Input Server URL:</Text>
      <TextInput
        placeholder="Type server URL here"
        onChangeText={text => setServerURL(text)}
        defaultValue={serverURL}
        keyboardType="url"
      />
      <Button
        title="Save"
        onPress={() => PropertyEditor.setString('x-server-url', serverURL!)}
      />
      <Button
        title="Scan QR Code"
        onPress={() => scannerRef?.current?.openScanner()}
      />
      <IpBarcodeScanner
        ref={scannerRef}
        onBarcodeDetected={(data: any) => setServerURL(data)}
      />
    </>
  );
};

const GetPropertyScreen = () => {
  const [serverURL, setServerURL] = React.useState<string | undefined>(
    'https://',
  );

  React.useEffect(() => {
    PropertyEditor.getString('x-server-url').then(setServerURL);
  }, []);

  return (
    <>
      <Text>Server URL:</Text>
      <Text>{serverURL}</Text>
    </>
  );
};

export default App;
