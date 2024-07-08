import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject, map } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { LocalService } from "@share/services/storage/local.service";
import { environment } from "@env/environment";
import { GENERATE_RTC_TOKEN_URL, NOTIFY_PROFESSIONAL_PUSHER_URL, VALIDATE_VOICE_CALL_PASSCODE_URL, VOICE_CALL_URL } from "@lib/api-constants";
import { RTC, RTCUser } from "@lib/interfaces";
import AgoraRTC from 'agora-rtc-sdk-ng';
import Pusher from 'pusher-js';

@Injectable({
  providedIn: "root",
})
export class ProfessionalsService {
  private headers: HttpHeaders;

  rtc: RTC = {
    client: null,
    localAudioTrack: null,
    remoteAudioTracks: {},
    micMuted: true,
  };

  token = '007eJxTYAhoi77dpbj7jsqGqSuFHlVaXPjMmBi14fKC11NnPlPa03lDgcHI0Cw5ydLIwizNPMkkxdgiMc3IKM3IJCnRNMk01SDFJL+tNa0hkJEhUHQbAyMUgvgsDLmJmXkMDADw2iFf'
  rtcUid =  Math.floor(Math.random() * 2032)
  rtmUid =  String(Math.floor(Math.random() * 2032))

  options = {
    appId: "216cb9286f7b4d38af22f24ba5b5e0d4",
  };

  remoteUsers: RTCUser[] = [];
  updateUserInfo = new BehaviorSubject<any>(null);

  subject: Subject<any> = new Subject<any>();
  userId: any;
  companyId: any;

  roomId = "main"

  rtcClient;
  rtmClient;
  channel;

  constructor(
    private _http: HttpClient, 
    private _localService: LocalService
) {
    this.headers = new HttpHeaders({
      "Content-Type": "application/json",
    });

    this.userId = this._localService.getLocalStorage(environment.lsuserId);
    this.companyId = this._localService.getLocalStorage(environment.lscompanyId);
    
    const client = new Pusher('d15683105c5d696cddc7', { cluster: 'eu' });
    // console.log('channel: ' + `pusher-vcp-${this.userId}`)
    
    let sub = 'pusher-vcp-astroideal' // `pusher-vcp-${this.userId}`;
    const pusherChannel = client.subscribe(sub);
    console.log('sub channel: ' + sub);
    pusherChannel.bind('professional-voice-call', (data) => this.subject.next(data));
  }

  async initRtc() {
    this.rtc.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
  
    this.rtc.client.on("user-published", this.handleUserPublished);
    this.rtc.client.on("user-left", this.handleUserLeft);
    

    await this.rtc.client.join(this.options.appId, this.roomId, this.token, this.rtcUid)
    this.rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack({
      encoderConfig: "music_standard"
    });
    // this.rtc.localAudioTrack.setMuted(this.micMuted);
    await this.rtc.client.publish([this.rtc.localAudioTrack]);
  
    //initVolumeIndicator()
  }

  async handleUserPublished(user, mediaType) {
    console.log('handleUserPublished')
    await this.rtc?.client?.subscribe(user, mediaType);

    if (mediaType == "audio"){
      this.rtc.remoteAudioTracks[user.uid] = [user.audioTrack]
      user.audioTrack.play();
      
      // const remoteAudioTrack = user.audioTrack;
      // remoteAudioTrack.play();
    }
  }

  async handleUserLeft(user) {
    console.log('handleUserLeft')
    // delete this.rtc.remoteAudioTracks[user.uid]
  }

  async enterRoom() {
    this.initRtc();
  }

  toggleMic() {
    this.rtc?.localAudioTrack?.setMuted(this.rtc.micMuted);
  }

  createRTCClient() {
    this.rtc.client = AgoraRTC.createClient({ 
      mode: "rtc", 
      codec: "vp9" 
    });

    // Enable log upload
    AgoraRTC.enableLogUpload();
    // Set the log output level as INFO
    AgoraRTC.setLogLevel(1);

    AgoraRTC.onAudioAutoplayFailed = () => {
      // alert("click to start autoplay!");
    };

    AgoraRTC.onMicrophoneChanged = async changedDevice => {
      // When plugging in a device, switch to a device that is newly plugged in.
      if (changedDevice.state === "ACTIVE") {
        this.rtc?.localAudioTrack?.setDevice(changedDevice.device.deviceId);
        // Switch to an existing device when the current device is unplugged.
      } else if (changedDevice.device.label === this.rtc?.localAudioTrack?.getTrackLabel()) {
        const oldMicrophones = await AgoraRTC.getMicrophones();
        oldMicrophones[0] && this.rtc?.localAudioTrack?.setDevice(oldMicrophones[0].deviceId);
      }
    };
  }

  async localUser(channel, token, uuid, mode: string = '') {
    const uid = await this.rtc?.client?.join(this.options.appId, channel, token, uuid);
    
    // // Create an audio track from the audio sampled by a microphone.
    // this.rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack({
    //   encoderConfig: "music_standard"
    // });

    // // Publish the local audio and video tracks to the
    // // channel for other users to subscribe to it.
    // this.rtc.localAudioTrack.setMuted(this.rtc.micMuted);

    // await this.rtc?.client?.publish([this.rtc.localAudioTrack]);

    this.getEquipment(mode);
  }

  async getEquipment(mode) {
    let skipPermissionsCheck = mode ? true : false;
    const dev = await AgoraRTC.getMicrophones(skipPermissionsCheck);
    const hasMicrophone = dev.some(device => device.kind === 'audioinput');
    if(hasMicrophone && !mode) {
       // Create an audio track from the audio sampled by a microphone.
      this.rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack({
        encoderConfig: "music_standard"
      });

      // Publish the local audio and video tracks to the
      // channel for other users to subscribe to it.
      this.rtc.localAudioTrack.setMuted(this.rtc.micMuted);

      await this.rtc?.client?.publish([this.rtc.localAudioTrack]);
    }
  }

  agoraServerEvents(rtc) {
    rtc.client.on("user-published", async (user, mediaType) => {
      console.log(user, mediaType, 'user-published');

      await rtc.client.subscribe(user, mediaType);
      console.log("subscribe success");

      if (mediaType === "audio") {
        const remoteAudioTrack = user.audioTrack;
        remoteAudioTrack.play();
      }
    });

    rtc.client.on("user-unpublished", async(user, mediaType) => {
      console.log(user, 'user-unpublished');

      // Destroy the local audio track.
      rtc?.localAudioTrack?.close();

      // Leave the channel.
      await rtc.client.leave();

      let params = {
        id: user.uid,
        user_id: this.userId,
        company_id: this.companyId,
        mode: 'end-call',
        channel: this.userId,
        room: `agora-vcp-${user.uid}`,
      }

      await this.notifyProfessional(params);
    });

    rtc.client.on("user-joined", (user) => {
      let id = user.uid;
      this.remoteUsers.push({ 'uid': + id });
      this.updateUserInfo.next(id);
      console.log("user-joined", user, this.remoteUsers, 'event1');
    });

    rtc.client.on("user-left", (user) => {
      console.log("user-left", user, this.remoteUsers, 'event1');
      this.leaveCall();
    })
  }
  
  async leaveCall() {
    // Destroy the local audio track.
    this.rtc?.localAudioTrack?.close();

    // Leave the channel.
    await this.rtc?.client?.leave();
  }

  generateRTCToken(channel, role, tokentype, uid): Observable<any> {
    return this._http.get(`${GENERATE_RTC_TOKEN_URL}/${channel}/${role}/${tokentype}/${uid}`, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  getFeedItems(): Observable<any> {
    return this.subject.asObservable();
  }

  notifyProfessional(payload): Observable<any> {
    return this._http.post(NOTIFY_PROFESSIONAL_PUSHER_URL,
        payload,
        { headers: this.headers }
    ).pipe(map(res => res));
  }

  voiceCall(payload): Observable<any> {
    return this._http.post(VOICE_CALL_URL,
        payload,
        { headers: this.headers }
    ).pipe(map(res => res));
  }

  validateVoiceCallPasscode(payload): Observable<any> {
    return this._http.post(VALIDATE_VOICE_CALL_PASSCODE_URL,
        payload,
        { headers: this.headers }
    ).pipe(map(res => res));
  }
}