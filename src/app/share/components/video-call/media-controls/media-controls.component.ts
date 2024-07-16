import { CommonModule } from "@angular/common";
import { Component, ElementRef, Input, ViewChild } from '@angular/core'
import { LocalStreamComponent } from '../local-stream/local-stream.component';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-media-controls',
  standalone: true,
  imports: [
    CommonModule,
    
  ],
  templateUrl: './media-controls.component.html',
})
export class MediaControlsComponent {
  // Buttons
  //  @ViewChild('micButton', { static: true }) micButton!: ElementRef<HTMLButtonElement>;
  //  @ViewChild('videoButton', { static: true }) videoButton!: ElementRef<HTMLButtonElement>;
  //  @ViewChild('screenShareButton', { static: true }) screenShareButton!: ElementRef<HTMLButtonElement>;
  //  @ViewChild('leaveButton', { static: true }) leaveButton!: ElementRef<HTMLButtonElement>;

  micMuted: boolean = false;
  videoStopped: boolean = false;
  screenShared: boolean = false;

  constructor(private localStream: LocalStreamComponent) { }

  async ngOnInit() {
    initFlowbite();
  }

  handleMicToggle(e: Event): void {
    const isActive = this.localStream.getTrackState('mic') // get active state
    this.localStream?.muteTrack('mic', !isActive)
    // //  this.toggleButtonActiveState(e.target as HTMLDivElement)
    this.micMuted = isActive === undefined ? !this.micMuted : !isActive;
  }

  handleVideoToggle(e: Event): void {
    const isActive = this.localStream?.getTrackState('video') ?? false// get active state
    this.localStream?.muteTrack('video', !isActive)
    // //  this.toggleButtonActiveState(e.target as HTMLDivElement)
    this.videoStopped = isActive === undefined ? !this.videoStopped : !isActive;
  }

  //  toggleButtonActiveState(button: HTMLDivElement): void {
  //    button.classList.toggle('media-active')    // Add/Remove active class
  //    button.classList.toggle('muted')           // Add/Remove muted class
  //  }

  handleScreenShare(e: Event): void {
    const isActive = this.localStream.getTrackState('screen') // get active state
    if (isActive) {
      this.localStream.startScreenShare()
    } else {
      this.localStream.stopScreenShare()
    }
    this.screenShared = !this.screenShared;
    //  this.toggleButtonActiveState(e.target as HTMLDivElement)
  }

  handleLeaveChannel(): void {
    this.localStream.handleLeaveChannel()
  }
}