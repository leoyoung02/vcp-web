import { CommonModule } from "@angular/common";
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    HostListener,
    Input,
    Output,
    SimpleChange,
} from "@angular/core";
import { RouterModule } from "@angular/router";
import { Subject, Subscription } from "rxjs";
import {
    LangChangeEvent,
    TranslateModule,
    TranslateService,
} from "@ngx-translate/core";
import { LocalService } from "@share/services";
import { FormsModule } from "@angular/forms";
import { initFlowbite } from 'flowbite';
import { environment } from "@env/environment";
import { ChatService, ChatStream, ProfessionalsService } from "@features/services";
import get from "lodash/get";

@Component({
    selector: "app-chat-drawer",
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        RouterModule,
        FormsModule,
    ],
    templateUrl: "./chat.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent {
    private destroy$ = new Subject<void>();

    @Input() canChat: any;
    @Input() buttonColor: any;
    @Input() companyId: any;
    @Input() id: any;
    @Input() image: any;
    @Input() firstName: any;
    @Input() userId: any;
    @Input() userName: any;
    @Input() userImage: any;
    @Input() userData: any;
    @Input() senderBalance: any;
    @Input() reloadData: any;

    languageChangeSubscription;
    language: any;
    isMobile: boolean = false;
    chatMessages: any = [];
    messages: any = [];
    message: string = '';
    formSubmitted: boolean = false;
    leave: boolean = false;

    public client!: ChatStream;
    private channel!: string;
    private token = '';
    public memberId!: string;

    private _username!: string;
    get username(): string {
        return this._username;
    }

    private errorsSub!: Subscription;
    private peerToPeerMsgSub!: Subscription;

    ngOnChanges(changes: SimpleChange) {
        let canChatChange = changes["canChat"];
        if (canChatChange && canChatChange.previousValue != canChatChange.currentValue) {
            this.canChat = canChatChange.currentValue;
            this.loadMessages();
        }

        let reloadDataChange = changes["reloadData"];
        if (reloadDataChange && reloadDataChange.previousValue != reloadDataChange.currentValue) {
            this.reloadData = reloadDataChange.currentValue;
            this.loadMessages();
        }
    }

    constructor(
        private _translateService: TranslateService,
        private _localService: LocalService,
        private _chatService: ChatService,
        private _professionalsService: ProfessionalsService,
        private cd: ChangeDetectorRef
    ) {

    }

    @HostListener("window:resize", [])
    private onResize() {
        this.isMobile = window.innerWidth < 768;
    }

    async ngOnInit() {
        this.onResize();
        this.language = this._localService.getLocalStorage(environment.lslang);
        this._translateService.use(this.language || "es");

        this.languageChangeSubscription =
            this._translateService.onLangChange.subscribe(
                (event: LangChangeEvent) => {
                    this.language = event.lang;
                    this.initializeData();
                }
            );

        if (this.canChat) {
            initFlowbite();
        }
        this.initializeData();
    }

    initializeData() {
        this.loadMessages();
    }

    loadMessages() {
        if (this.canChat) { this.initializeChatService(); }

        // // Temporary messages to show in UI
        // this.messages = [
        //     {
        //         sender_id: '61468',
        //         message: 'Hello!!!',
        //         date: '2024-07-19 19:30:00'
        //     },
        //     {
        //         sender_id: '61469',
        //         message: 'Hey there',
        //         date: '2024-07-19 19:35:00'
        //     },
        //     {
        //         sender_id: '61469',
        //         message: 'How are you doing?',
        //         date: '2024-07-19 19:38:00'
        //     },
        //     {
        //         sender_id: '61468',
        //         message: 'Pretty good. Thank you. You?',
        //         date: '2024-07-19 19:40:00'
        //     },
        //     {
        //         sender_id: '61468',
        //         message: 'Hello!!!',
        //         date: '2024-07-19 19:30:00'
        //     },
        //     {
        //         sender_id: '61469',
        //         message: 'Hey there',
        //         date: '2024-07-19 19:35:00'
        //     },
        // ]
    }

    async initializeChatService() {
        if(!this.memberId) {
            this.memberId = String(Math.floor(Math.random() * 2032));
            this._username = this.userName;
    
            this.token = get(await this._chatService.generateRTMToken(this.memberId).toPromise(), 'rtmToken');
    
            if(this.token && this.memberId) {
                this.channel = `agora-vcp-chat-${this.id}-${this.userId}`;
                this.client = new ChatStream(
                    this.channel,
                    this.token,
                    this.memberId,
                );
        
                if (!this.client.isJoined) {
                    await this.client.joinChannel(
                        this.channel,
                        this.token,
                        this.username,
                        this.userImage,
                    );
        
                    this.internalEventListener();
        
                    let currentUserId = this._localService.getLocalStorage(environment.lsuserId);
                    if (this.userId == currentUserId) { this.initiateChat() };
                }
            }
        }

        if(this.client) {
            this.client.chatMessagesUpdated$.subscribe(status =>{
                setTimeout(() => {
                    this.chatMessages = this.client.chatMessages;
                    this.cd.detectChanges();
                }, 500)
            })
        }
    }

    /**
        * Listeners event like remote info update, left, join, error, volume indicator.
        */
    private internalEventListener(): void {
        this.errorsSub = this.client.errors.subscribe(async (res: { code: string | number; msg: string; }) => {
            console.log('errorsSub', res);
            switch (res.code) {
                case 'CAN_NOT_GET_GATEWAY_SERVER':
                    await this.leaveChannel();
                    break;
                default:
                    break;
            }
        })

        this.peerToPeerMsgSub = this.client.peerToPeerMsg.subscribe((res: { text: string, messageType: string, sendPeerId: string }) => {
            switch (res.text) {
                case 'leave-channel':
                    this.leaveChannel();
                    break;
                default:
                    break;
            }
        })
    }

    /**
    * Leave the chanel.
    */
    async leaveChannel(): Promise<void> {
        await this.client.leaveChannel();
        this.leave = true;
    }

    async initiateChat() {
        let chat_guid = Math.random().toString(36).substring(6);
        let chat_passcode = Math.random().toString(36).substring(6);

        let params = {
            id: this.id,
            user_id: this.userId,
            company_id: this.companyId,
            mode: 'accept-chat',
            message: this._translateService.instant('professionals.incomingchat'),
            sender_name: this.userName,
            sender_image: this.userImage,
            room: this.channel,
            sender_uid: this.memberId,
            sender_balance_before_chat: this.senderBalance,
            chat_guid,
            chat_passcode,
            token: this.token,
        }
        this.notifyChatProfessional(params);
    }

    notifyChatProfessional(params) {
        this._professionalsService.notifyChatProfessional(params).subscribe(
            (response) => {
            },
            (error) => {
                console.log(error);
            })
    }

    async sendMessage() {
        this.formSubmitted = true;
        await this.client.sendMessage(
            this.message,
            this.userName,
            this.userImage,
        );

        setTimeout(() => {
            this.message = '';
            this.chatMessages = this.client?.chatMessages;
            this.cd.detectChanges();
            this.formSubmitted = false;
        }, 500)
    }

    closeChat() {
        this.handleOnDestroy();
    }

    handleOnDestroy() {
        if (this.canChat) {
            this.errorsSub?.unsubscribe();
            this.peerToPeerMsgSub?.unsubscribe();
        }

        this.languageChangeSubscription?.unsubscribe();
        this.destroy$.next();
        this.destroy$.complete();
    }

    ngOnDestroy() {
        this.handleOnDestroy();
    }
}