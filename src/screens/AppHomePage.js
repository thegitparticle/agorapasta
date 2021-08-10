import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Button} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';

function AppHomePage() {
  const navigation = useNavigation();

  return (
    <View style={styles.container_view}>
      <Text style={styles.default_text}>
        welcome to barebones-yet-useful world!
      </Text>
      <Button
        title="call screen"
        onPress={() => navigation.navigate('CallScreen')}
      />
    </View>
  );
}

export default AppHomePage;

const styles = StyleSheet.create({
  container_view: {
    flex: 1,
    backgroundColor: '#EAEAEA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  default_text: {fontSize: 17, color: '#333333'},
});
