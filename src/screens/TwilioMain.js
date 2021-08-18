import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
  SafeAreaView,
  Platform,
} from 'react-native';
import {Button} from 'react-native-elements';
import {
  TwilioVideoLocalView,
  TwilioVideoParticipantView,
  TwilioVideo,
} from 'react-native-twilio-video-webrtc';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function TwilioMain({navigation, route}) {
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [status, setStatus] = useState('disconnected');
  const [participants, setParticipants] = useState(new Map());
  const [videoTracks, setVideoTracks] = useState(new Map());
  const [token, setToken] = useState(
    Platform.OS === 'ios'
      ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImN0eSI6InR3aWxpby1mcGE7dj0xIn0.eyJqdGkiOiJTS2RhODgwOWYyN2Y1Y2E5ZDEwNzc2ZWQ5YjQwNjExMTMwLTE2MjkyMjcwNTUiLCJncmFudHMiOnsiaWRlbnRpdHkiOiIxMiIsInZpZGVvIjp7fX0sImlhdCI6MTYyOTIyNzA1NSwiZXhwIjoxNjI5MzA4MDU1LCJpc3MiOiJTS2RhODgwOWYyN2Y1Y2E5ZDEwNzc2ZWQ5YjQwNjExMTMwIiwic3ViIjoiQUNjZmJiYmI4NDM3Zjk5YjgxMmU2ZDU4MWJkMGE2ZjhlYSJ9.GlNYLE89gXITLX1XdPruBaY27HxjySH5mINtA3ww2P0'
      : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImN0eSI6InR3aWxpby1mcGE7dj0xIn0.eyJqdGkiOiJTS2RhODgwOWYyN2Y1Y2E5ZDEwNzc2ZWQ5YjQwNjExMTMwLTE2MjkyMjcwNzMiLCJncmFudHMiOnsiaWRlbnRpdHkiOiIxNSIsInZpZGVvIjp7fX0sImlhdCI6MTYyOTIyNzA3MywiZXhwIjoxNjI5MzA4MDczLCJpc3MiOiJTS2RhODgwOWYyN2Y1Y2E5ZDEwNzc2ZWQ5YjQwNjExMTMwIiwic3ViIjoiQUNjZmJiYmI4NDM3Zjk5YjgxMmU2ZDU4MWJkMGE2ZjhlYSJ9.mlKSyrbpqXfxbRRWusJXAaD14X1WEizVC20Rs2scXJ4',
  );
  const twilioRef = useRef(null);

  const {id} = route.params;

  const _onConnectButtonPress = () => {
    twilioRef.current.connect({accessToken: token, roomName: 'den'});
    setStatus('connecting');
  };

  const _onEndButtonPress = () => {
    twilioRef.current.disconnect();
  };

  const _onMuteButtonPress = () => {
    twilioRef.current
      .setLocalAudioEnabled(!isAudioEnabled)
      .then(isEnabled => setIsAudioEnabled(isEnabled));
  };

  const _onFlipButtonPress = () => {
    twilioRef.current.flipCamera();
  };

  const _onRoomDidConnect = ({roomName, error}) => {
    console.log('onRoomDidConnect: ', roomName);

    setStatus('connected');
  };

  const _onRoomDidDisconnect = ({roomName, error}) => {
    console.log('[Disconnect]ERROR: ', error);

    setStatus('disconnected');
  };

  const _onRoomDidFailToConnect = error => {
    console.log('[FailToConnect]ERROR: ', error);

    setStatus('disconnected');
  };

  const _onParticipantAddedVideoTrack = ({participant, track}) => {
    console.log('onParticipantAddedVideoTrack: ', participant, track);

    setVideoTracks(
      new Map([
        ...videoTracks,
        [
          track.trackSid,
          {participantSid: participant.sid, videoTrackSid: track.trackSid},
        ],
      ]),
    );
  };

  const _onParticipantRemovedVideoTrack = ({participant, track}) => {
    console.log('onParticipantRemovedVideoTrack: ', participant, track);

    const videoTracksLocal = videoTracks;
    videoTracksLocal.delete(track.trackSid);

    setVideoTracks(videoTracksLocal);
  };

  const [screenOn, setScreenOn] = useState(true);

  const _shareScreen = () => {
    setScreenOn(!screenOn);
  };

  console.log(status);

  return (
    <SafeAreaView style={styles.max}>
      {status === 'disconnected' && (
        <View>
          <Text style={styles.noUserText}>start a call</Text>
          {/* <TextInput
            style={styles.input}
            autoCapitalize="none"
            value={token}
            onChangeText={text => setToken(text)}
          /> */}
          <Button
            title="Call"
            style={styles.button}
            onPress={_onConnectButtonPress}
          />
        </View>
      )}
      {(status === 'connected' || status === 'connecting') && (
        <View style={styles.max}>
          {status === 'connected' && (
            <View style={styles.remote_max_view}>
              {Array.from(videoTracks, ([trackSid, trackIdentifier]) => (
                <TwilioVideoParticipantView
                  style={styles.remote_max}
                  key={trackSid}
                  trackIdentifier={trackIdentifier}
                />
              ))}
            </View>
          )}
          <View style={styles.optionsContainer}>
            <TouchableOpacity style={styles.button} onPress={_onEndButtonPress}>
              <Text style={{fontSize: 12}}>End</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={_onMuteButtonPress}>
              <Text style={{fontSize: 12}}>
                {isAudioEnabled ? 'Mute' : 'Unmute'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={_onFlipButtonPress}>
              <Text style={{fontSize: 12}}>Flip</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={_shareScreen}>
              <Text style={{fontSize: 12}}>screen</Text>
            </TouchableOpacity>
            <TwilioVideoLocalView
              enabled={true}
              style={styles.local_max_view}
            />
          </View>
        </View>
      )}

      <TwilioVideo
        ref={twilioRef}
        onRoomDidConnect={_onRoomDidConnect}
        onRoomDidDisconnect={_onRoomDidDisconnect}
        onRoomDidFailToConnect={_onRoomDidFailToConnect}
        onParticipantAddedVideoTrack={_onParticipantAddedVideoTrack}
        onParticipantRemovedVideoTrack={_onParticipantRemovedVideoTrack}
        screenShare={true}
      />
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.button}>
        <Text style={styles.buttonText}> Go Back </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export default TwilioMain;

const styles = StyleSheet.create({
  default_text: {fontSize: 17, color: '#333333'},
  max: {
    flex: 1,
    backgroundColor: '#090909',
  },
  remote_max: {
    height: 200,
    width: 200,
    backgroundColor: 'pink',
  },
  remote_max_view: {
    height: 230,
    width: 230,
    backgroundColor: 'pink',
  },
  local_max_view: {
    height: 230,
    width: 230,
    backgroundColor: 'brown',
    alignItems: 'center',
  },
  buttonHolder: {
    height: 100,
    alignItems: 'center',
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#0093E9',
    borderRadius: 25,
    width: 100,
    alignSelf: 'center',
  },
  on_video_button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#0093E915',
    width: 100,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
  },
  fullView: {
    width: windowWidth,
    height: windowHeight - 100,
  },
  remoteContainer: {
    flex: 1,
    backgroundColor: 'tomato',
    borderRadius: 5,
    borderWidth: 10,
    borderColor: 'aliceblue',
    // position: 'absolute',
    // top: 5,
  },
  remote: {
    width: 150,
    height: 150,
    marginHorizontal: 2.5,
  },
  noUserText: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: '#0093E9',
  },
});
