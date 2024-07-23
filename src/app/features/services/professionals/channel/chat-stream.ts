import { BehaviorSubject, ReplaySubject } from "rxjs";
import { ChatMessages } from "@lib/interfaces";
import AgoraRTM, { RtmClient, RtmChannel } from 'agora-rtm-sdk';
import { environment } from "@env/environment";

export class ChatStream {
    private appId = environment.agoraAppId;
    private channel: string = '';
    private token: string = '';
    private uid: string = '';
    private rtmClient!: RtmClient;
    private rtmChannel!: RtmChannel;
    public loading: boolean = false;
    public isJoined: boolean = false;

    /**
    * Replay subject to emit the events like
    * peerToPeerMsg, chatMessages, errors.
    */
    public errors = new ReplaySubject<{ code: number | string; msg: string }>();
    public peerToPeerMsg = new ReplaySubject<{ text: string, messageType: string; sendPeerId: string }>();
    public chatMessages: ChatMessages[] = [];

    chatMessagesUpdated$ = new BehaviorSubject<boolean>(false);

    constructor(channel: string, token: string, uid: string) {
        this.channel = channel;
        this.token = token;
        this.uid = uid;
        this.rtmClient = AgoraRTM.createInstance(this.appId);
    }

    /**
    * Join the Local streamer client channel.
    */
    async joinChannel(channel: string, token: string, username: string, image: string) {
        await this.loginRTM(username, image);
        this.isJoined = true;
        this.loading = false;
    }

    /**
    * Leave channel.
    */
    async leaveChannel(): Promise<void> {
        this.loading = true;
        this.rtmClient.logout();
        this.isJoined = false;
        this.loading = false;
    }

    /**
    * Login into the RTM account.
    */
    async loginRTM(username: string, image: string): Promise<void> {
        console.log('login ' + this.uid.toString())
        await this.rtmClient.login({ uid: this.uid.toString(), token: this.token })
            .then(async () => {
                await this.rtmClient.setLocalUserAttributes({ 
                    name: username, 
                    image,
                    isPresenting: '0' 
                });
                await this.createChannel();
            })
            .catch((res: any) => {
                this.errors.next({ code: res.code, msg: res.message });
            });
    }

    /**
    * Create the RTM Channel.
    */
    async createChannel(): Promise<void> {
        console.log('create channel ' + this.channel)
        this.rtmChannel = await this.rtmClient.createChannel(this.channel);
        await this.joinRTM();
    }

    /**
    * Join the RTM Channel.
    */
    async joinRTM(): Promise<void> {
        await this.rtmChannel.join()
            .then(() => {
                this.rtmEventListener();
            })
            .catch((res: any) => {
                console.log(res.message);
                this.errors.next({ code: res.code, msg: res.message });
                return;
            });
    }

    /**
    * EventListener of the rtm client.
    */
    rtmEventListener(): void {
        this.rtmChannel.on('ChannelMessage', async (message: any, memberId: string) => {
            let name = '';
            let image = '';
            await this.getUserAttribute(memberId)
                .then((value) => {
                    name = value.name;
                })
                .catch((reason: any) => console.log("getUserAttribute error", reason));
            this.chatMessages.push({
                memberId,
                memberName: name,
                memberImage: image,
                message: message.text,
                messageType: message.messageType,
                timestamp: Date.now()
            })
            this.chatMessagesUpdated$.next(true);
        })
        this.rtmChannel.on('MemberJoined', (memberId: string) => {
            console.log("MemberJoined", memberId);
        })
        this.rtmChannel.on('MemberLeft', (memberId: string) => {
            console.log("MemberLeft", memberId);
        })
        this.rtmClient.on('MessageFromPeer', (message: any, peerId: string) => {
            console.log("MessageFromPeer", message, peerId);
            this.peerToPeerMsg.next({ text: message.text, messageType: message.messageType, sendPeerId: peerId });
        })
    }

    /**
      * Get user name from the rtm.
      */
    async getUserAttribute(id: string): Promise<any> {
        return await this.rtmClient.getUserAttributes(id);
    }

    /**
    * Send message to the channel.
    */
    async sendMessage(message: string, memberName: string, memberImage: string): Promise<void> {
        await this.rtmChannel.sendMessage({ text: message })
        .then(() => {
            this.chatMessages.push({
                memberId: this.uid.toString(),
                memberName,
                memberImage,
                message: message,
                messageType: 'TEXT',
                timestamp: Date.now()
            })
            this.chatMessagesUpdated$.next(true);
        })
        .catch((reason: any) => {
            console.log(reason.message)
        });
    }
}