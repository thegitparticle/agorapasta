import React, {useEffect, useState} from 'react';
import {
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import RtcEngine, {
  RtcLocalView,
  RtcRemoteView,
  VideoRenderMode,
  ChannelProfile,
  ClientRole,
} from 'react-native-agora';
import {useNavigation} from '@react-navigation/native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function CallScreen() {
  const navigation = useNavigation();

  const appId = '3203805757c54ff4a384e53869cc1888';

  const tempToken =
    '0063203805757c54ff4a384e53869cc1888IADLBmvk+CbsfXy73zXRbz+XFL9uIRxE0obC9XcSW5xrvDbXzjsAAAAAEACZZ/CeyMETYQEAAQDIwRNh';

  const channelName = 'chan_1';

  const [joinSucceed, setJoinSucceed] = useState(false);

  const [peerIds, setPeerIds] = useState([]);

  const [switchCamera, setSwitchCamera] = useState(true);

  const [switchRender, setSwitchRender] = useState(true);

  async function Init() {
    const engine = await RtcEngine.create(appId);

    if (engine) {
      engine.enableVideo();
      engine.startPreview();

      engine.addListener('Warning', warn => {
        console.log('Warning', warn);
      });

      engine.addListener('Error', err => {
        console.log('Error', err);
      });

      engine.addListener('UserJoined', (uid, elapsed) => {
        console.log('UserJoined', uid, elapsed);
        if (peerIds.indexOf(uid) === -1) {
          setPeerIds([...peerIds, uid]);
        }
      });

      engine.addListener('UserOffline', (uid, reason) => {
        console.log('UserOffline', uid, reason);
        setPeerIds(peerIds.filter(id => id !== uid));
      });

      engine.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
        console.log('JoinChannelSuccess', channel, uid, elapsed);
        setJoinSucceed(true);
      });
    }
  }

  useEffect(() => {
    Init();
  }, []);

  async function StartCall() {
    const engine = await RtcEngine.create(appId);

    await engine.joinChannel(tempToken, channelName, null, 0);
    console.log('start call calling');
  }

  async function EndCall() {
    const engine = await RtcEngine.create(appId);
    await engine.leaveChannel();
    setJoinSucceed(false);
    setPeerIds([]);
  }

  async function SwitchCamera() {
    const engine = await RtcEngine.create(appId);
    await engine
      .switchCamera()
      .then(() => {
        setSwitchCamera(!switchCamera);
      })
      .catch(err => console.log('switchCamera', err));
  }

  function SwitchRender() {
    setSwitchRender(!switchRender);
  }

  function RenderRemoteVideos() {
    if (peerIds.length > 0) {
      return (
        <ScrollView
          style={styles.remoteContainer}
          contentContainerStyle={{paddingHorizontal: 2.5}}
          horizontal={true}>
          {peerIds.map(value => {
            <RtcRemoteView.SurfaceView
              style={styles.remote}
              uid={value}
              channelId={channelName}
              renderMode={VideoRenderMode.Hidden}
              zOrderMediaOverlay={true}
            />;
          })}
        </ScrollView>
      );
    } else {
      console.log(peerIds);
      return <View />;
    }
  }

  function RenderVideos() {
    if (joinSucceed) {
      return (
        <View style={styles.fullView}>
          <RtcLocalView.SurfaceView
            style={styles.max}
            channelId={channelName}
            // renderMode={VideoRenderMode.Hidden}
          />
          <RenderRemoteVideos />
        </View>
      );
    } else {
      return <View />;
    }
  }

  return (
    <View style={styles.max}>
      <View style={styles.max}>
        <View style={styles.buttonHolder}>
          <TouchableOpacity onPress={() => StartCall()} style={styles.button}>
            <Text style={styles.buttonText}> Start Call </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => EndCall()} style={styles.button}>
            <Text style={styles.buttonText}> End Call </Text>
          </TouchableOpacity>
        </View>
        <RenderVideos />
      </View>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.button}>
        <Text style={styles.buttonText}> Go Back </Text>
      </TouchableOpacity>
    </View>
  );
}

export default CallScreen;

const styles = StyleSheet.create({
  container_view: {
    flex: 1,
    backgroundColor: '#EAEAEA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  default_text: {fontSize: 17, color: '#333333'},
  max: {
    flex: 1,
  },
  buttonHolder: {
    height: 100,
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#0093E9',
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
    width: '100%',
    height: 150,
    position: 'absolute',
    top: 5,
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
