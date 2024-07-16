import { CommonModule } from "@angular/common";
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, SimpleChange, ViewChild } from '@angular/core'
import { ILocalTrack, IAgoraRTCClient } from 'agora-rtc-sdk-ng';
import { MediaControlsComponent } from '../media-controls/media-controls.component';
import { VideoCallService } from '@features/services';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-local-stream',
    standalone: true,
    imports: [
        CommonModule,
        MediaControlsComponent
    ],
    templateUrl: './local-stream.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocalStreamComponent implements AfterViewInit {
    @Input() micMuted: any;

    @ViewChild('localVideo', { static: true }) localVideo!: ElementRef<HTMLDivElement>;
    @Output() leaveChannel = new EventEmitter<void>();

    private client: IAgoraRTCClient | undefined;

    private localMicTrack!: ILocalTrack;
    private localVideoTrack!: ILocalTrack;
    private localScreenTracks?: ILocalTrack[];

    private channelJoined: boolean = false;
    private subscription: Subscription = new Subscription();

    private localTracksActive = {
        audio: false,
        video: false,
        screen: false,
    }

    // Mapping to simplify getting/setting track-state
    private trackNameMapping: { [key: string]: 'audio' | 'video' | 'screen' } = {
        audio: 'audio',
        video: 'video',
        screen: 'screen',
    }

    constructor(private _videoCallService: VideoCallService) {
        this.client = this._videoCallService.getClient()
    }

    // ngOnChanges(changes: SimpleChange) {
    //     let micMutedChange = changes["micMuted"];
    //     if (micMutedChange && 
    //         (micMutedChange?.previousValue != micMutedChange?.currentValue ||
    //         micMutedChange?.currentValue == true)
    //       ) {
    //         this.micMuted = micMutedChange.currentValue;
    //       }
    // }

    async ngAfterViewInit(): Promise<void> {
        // [this.localMicTrack, this.localVideoTrack] = await this._videoCallService.setupLocalTracks();
        // this.localTracksActive.audio = this.localMicTrack ? true : false
        // this.localTracksActive.video = this.localVideoTrack ? true : false
        
        // // play video track in localStreamComponent div
        // this.localVideoTrack.play(this.localVideo.nativeElement);
        // this.subscription.add(this._videoCallService.channelJoined$.subscribe(status => {
        //     this.channelJoined = status
        //     if (status) {
        //         this.publishTracks() // publish the tracks once we are in the channel
        //     }
        // }))
    }

    async ngOnDestroy() {
        // leave the channel if the component unmounts
        this.handleLeaveChannel()
    }

    async publishTracks() {
        await this.client?.publish([this.localMicTrack, this.localVideoTrack])
    }

    async unpublishTracks() {
        await this.client?.publish([this.localMicTrack, this.localVideoTrack])
    }

    async handleLeaveChannel(): Promise<void> {
        if (this.channelJoined) {
            const tracks = [this.localMicTrack, this.localVideoTrack]
            tracks.forEach(track => {
                track.close()
            })
            await this.client?.unpublish(tracks)
            await this._videoCallService.leaveChannel()
        }
        this.leaveChannel.emit()
    }

    async muteTrack(trackName: string, enabled: boolean): Promise<boolean> {
        const track = trackName === 'mic' ? this.localMicTrack : this.localVideoTrack;
        await track?.setEnabled(enabled);
        this.setTrackState(trackName, enabled)
        return enabled;
    }

    async startScreenShare(): Promise<boolean> {
        // TODO: add start screen share
        // Listen for screen share ended event (from browser ui button)
        // this.localScreenTracks[0]?.on("track-ended", () => {
        //   this.stopScreenShare()
        // })    
        return true;
    }

    async stopScreenShare(): Promise<boolean> {
        // TODO: add stop screenshare
        return false;
    }

    getTrackState(trackName: string): boolean | undefined {
        const key = this.trackNameMapping[trackName]
        if (key) {
            return this.localTracksActive[key]
        }
        console.log(`Get Track State Error: Unknown trackName: ${trackName}`)
        return
    }

    setTrackState(trackName: string, state: boolean): void {
        const key = this.trackNameMapping[trackName]
        if (key) {
            this.localTracksActive[key] = state
        }
        console.log(`Set Track State Error: Unknown trackName: ${trackName}`)
        return
    }
}