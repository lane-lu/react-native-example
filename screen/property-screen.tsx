import React from 'react';
import {Button, Text, TextInput} from 'react-native';
import PropertyEditor from '@interpro/react-native-property-editor';
import {IpBarcodeScanner} from '@interpro/react-native-barcode-scanner';

const PropertyScreen = () => {
  const [serverURL, setServerURL] = React.useState<string | undefined>(
    'https://...',
  );
  const [refreshTime, setRefreshTime] = React.useState<number | undefined>(5);

  const scannerRef = React.useRef<IpBarcodeScanner>(null);

  React.useEffect(() => {
    PropertyEditor.getString('x-server-url').then(setServerURL);
    PropertyEditor.getNumber('x-refresh-time').then(setRefreshTime);
  }, []);

  return (
    <>
      <Text>Server URL:</Text>
      <TextInput
        placeholder="Input server URL"
        onChangeText={text => setServerURL(text)}
        defaultValue={serverURL}
        keyboardType="url"
      />
      <Button
        title="Scan QR Code"
        onPress={() => scannerRef?.current?.openScanner()}
      />
      <IpBarcodeScanner
        ref={scannerRef}
        onBarcodeDetected={(data: any) => setServerURL(data)}
      />
      <Text>Refresh Time (min):</Text>
      <TextInput
        placeholder="Input refresh time in minute"
        onChangeText={num => setRefreshTime(+num)}
        defaultValue={'' + refreshTime}
        keyboardType="numeric"
      />
      <Button
        title="Save"
        onPress={() => {
          PropertyEditor.setString('x-server-url', serverURL!);
          PropertyEditor.setNumber('x-refresh-time', refreshTime!);
        }}
      />
    </>
  );
};

export default PropertyScreen;
