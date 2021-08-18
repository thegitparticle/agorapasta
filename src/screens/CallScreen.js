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

function CallScreen({route}) {
  const navigation = useNavigation();
  const {id} = route.params;

  const appId = '3203805757c54ff4a384e53869cc1888';

  const tempToken =
    '0063203805757c54ff4a384e53869cc1888IABIzYEKRPdh2o1VZNOHy721I0qjH0oKFigcURPEkvwzCjbXzjsAAAAAEAA4tIbZqwceYQEAAQCrBx5h';

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
        // console.log('UserJoined', uid, elapsed);
        if (peerIds.indexOf(uid) === -1) {
          setPeerIds([...peerIds, uid]);
        }
      });

      engine.addListener('UserOffline', (uid, reason) => {
        // console.log('UserOffline', uid, reason);
        setPeerIds(peerIds.filter(id => id !== uid));
      });

      engine.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
        // console.log('JoinChannelSuccess', channel, uid, elapsed);
        setJoinSucceed(true);
      });
    }
  }

  useEffect(() => {
    Init();
  }, []);

  async function StartCall() {
    const engine = await RtcEngine.create(appId);

    await engine.joinChannel(tempToken, channelName, null, parseInt(id));
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

  const [showCamera, setShowCamera] = useState(true);

  async function ShutCamera() {
    const engine = await RtcEngine.create(appId);
    await engine.disableVideo().catch(err => console.log('shut camera', err));
  }

  async function TurnOnCamera() {
    const engine = await RtcEngine.create(appId);
    await engine.enableVideo().catch(err => console.log('turn on camera', err));
  }

  function ShowCameraButton() {
    if (showCamera) {
      return (
        <TouchableOpacity
          onPress={() => {
            ShutCamera();
            setShowCamera(false);
          }}
          style={styles.on_video_button}>
          <Text style={styles.buttonText}> off cam </Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          onPress={() => {
            TurnOnCamera();
            setShowCamera(true);
          }}
          style={styles.on_video_button}>
          <Text style={styles.buttonText}> on cam </Text>
        </TouchableOpacity>
      );
    }
  }

  function SwitchRender() {
    setSwitchRender(!switchRender);
  }

  function RenderRemoteVideos() {
    if (peerIds.length > 0) {
      console.log(peerIds);
      return (
        <ScrollView style={styles.remoteContainer}>
          {peerIds.map((value, index) => (
            <View style={styles.remote_max_view}>
              <RtcRemoteView.SurfaceView
                style={styles.remote_max}
                uid={value}
                channelId={channelName}
                renderMode={VideoRenderMode.Hidden}
                zOrderMediaOverlay={true}
              />
            </View>
          ))}
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
            style={styles.local_max_view}
            channelId={channelName}
            // renderMode={VideoRenderMode.Hidden}
          >
            <TouchableOpacity
              onPress={() => SwitchCamera()}
              style={styles.on_video_button}>
              <Text style={styles.buttonText}> switch cam </Text>
            </TouchableOpacity>
            <ShowCameraButton />
          </RtcLocalView.SurfaceView>
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
    flex: 1,
    backgroundColor: '#090909',
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
