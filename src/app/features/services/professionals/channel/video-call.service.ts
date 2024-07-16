import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { LocalService } from "@share/services/storage/local.service";
import AgoraRTC, { ILocalTrack, IAgoraRTCClient } from 'agora-rtc-sdk-ng';
import { environment } from "@env/environment";

@Injectable({
    providedIn: "root",
})
export class VideoCallService {
    private headers: HttpHeaders;

    private client: IAgoraRTCClient | undefined;
    private appId = environment.agoraAppId;

    private channelJoinedSource = new BehaviorSubject<boolean>(false);
    channelJoined$ = this.channelJoinedSource.asObservable();

    constructor(
        private _http: HttpClient,
        private _localService: LocalService,
    ) {
        this.headers = new HttpHeaders({
            "Content-Type": "application/json",
        });

        if (this.appId == '')
            console.error('APPID REQUIRED');

        this.client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp9' });
    }

    async joinChannel(channelName: string, token: string | null, uid: string | null) {
        await this.client?.join(this.appId, channelName, token, uid)
        this.channelJoinedSource.next(true)
    }

    async leaveChannel() {
        await this.client?.leave()
        this.channelJoinedSource.next(false)
    }

    setupLocalTracks(): Promise<ILocalTrack[]> {
        return AgoraRTC.createMicrophoneAndCameraTracks();
    }

    getClient() {
        return this.client;
    }
}