import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject, map } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { LocalService } from "@share/services/storage/local.service";
import { environment } from "@env/environment";
import { GENERATE_RTC_TOKEN_URL, NOTIFY_PROFESSIONAL_PUSHER_URL, VOICE_CALL_URL } from "@lib/api-constants";
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
  };

  options = {
    appId: "216cb9286f7b4d38af22f24ba5b5e0d4",
  };

  remoteUsers: RTCUser[] = [];
  updateUserInfo = new BehaviorSubject<any>(null);

  subject: Subject<any> = new Subject<any>();
  userId: any;

  constructor(
    private _http: HttpClient, 
    private _localService: LocalService
) {
    this.headers = new HttpHeaders({
      "Content-Type": "application/json",
    });

    this.userId = this._localService.getLocalStorage(environment.lsuserId);
    const client = new Pusher('d15683105c5d696cddc7', { cluster: 'eu' });
    console.log('channel: ' + `pusher-vcp-${this.userId}`)
    const channel = client.subscribe(`pusher-vcp-${this.userId}`);
    channel.bind('professional-voice-call', (data) => this.subject.next(data));
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
      alert("click to start autoplay!");
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

  async localUser(channel, token, uuid) {
    const uid = await this.rtc?.client?.join(this.options.appId, channel, token, uuid);
    // Create an audio track from the audio sampled by a microphone.
    this.rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack({
      encoderConfig: "music_standard"
    });

    // Publish the local audio and video tracks to the
    // channel for other users to subscribe to it.
    await this.rtc?.client?.publish([this.rtc.localAudioTrack]);
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
    rtc.client.on("user-unpublished", user => {
      console.log(user, 'user-unpublished');
    });

    rtc.client.on("user-joined", (user) => {
      let id = user.uid;
      this.remoteUsers.push({ 'uid': + id });
      this.updateUserInfo.next(id);
      console.log("user-joined", user, this.remoteUsers, 'event1');
    });
  }

  outboundPSTN(user) {
    console.log(user)
  }
  
  async leaveCall() {
    // Destroy the local audio track.
    this.rtc?.localAudioTrack?.close();

    // Traverse all remote users.
    this.rtc?.client?.remoteUsers.forEach(user => {
      // Destroy the dynamically created DIV container.
      const playerContainer = document.getElementById('remote-playerlist' + user.uid.toString());
      playerContainer && playerContainer.remove();
    });
    // Leave the channel.
    await this.rtc?.client?.leave();

  }

  generateUid() {
    const length = 5;
    const randomNo = (Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1)));
    return randomNo;
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
}