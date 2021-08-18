//
//  AgoraAudioProcessing.h
//  agorapasta
//
//  Created by SAN on 8/18/21.
//

#import <CoreMedia/CoreMedia.h>
#import <AgoraRtcKit/AgoraRtcEngineKit.h>

@interface AgoraAudioProcessing : NSObject
+ (void)registerAudioPreprocessing:(AgoraRtcEngineKit*) kit;
+ (void)deregisterAudioPreprocessing:(AgoraRtcEngineKit*) kit;
+ (void)pushAudioFrame:(unsigned char *)inAudioFrame withFrameSize:(int64_t)frameSize;
@end
