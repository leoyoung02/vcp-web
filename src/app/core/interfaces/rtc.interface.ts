import AgoraRTC, { IMicrophoneAudioTrack, IAgoraRTCClient } from 'agora-rtc-sdk-ng';

export interface RTC {
    client: IAgoraRTCClient | null,
    localAudioTrack: IMicrophoneAudioTrack | null,
}