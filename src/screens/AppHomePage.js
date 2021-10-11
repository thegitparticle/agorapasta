import React, {useState} from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import {Button} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';

function AppHomePage() {
  const navigation = useNavigation();

  const [id, setID] = useState(0);

  return (
    <View style={styles.container_view}>
      <Text style={styles.default_text}>
        welcome to barebones-yet-useful world!
      </Text>
      <TextInput
        style={styles.input}
        onChangeText={setID}
        value={id}
        keyboardType="numeric"
      />
      {/* <Button
        title="twilio screen"
        onPress={() =>
          navigation.navigate('TwilioMain', {
            id: id,
          })
        }
      /> */}
      <Button
        title="call screen"
        onPress={() =>
          navigation.navigate('CallScreen', {
            id: id,
          })
        }
      />
    </View>
  );
}

export default AppHomePage;

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  container_view: {
    flex: 1,
    backgroundColor: '#EAEAEA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  default_text: {fontSize: 17, color: '#333333'},
});
