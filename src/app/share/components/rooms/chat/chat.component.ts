import { CommonModule } from "@angular/common";
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostListener,
    Input,
} from "@angular/core";
import { RouterModule } from "@angular/router";
import { Subject } from "rxjs";
import {
    LangChangeEvent,
    TranslateModule,
    TranslateService,
} from "@ngx-translate/core";
import { LocalService } from "@share/services";
import { FormsModule } from "@angular/forms";
import { initFlowbite } from 'flowbite';
import { environment } from "@env/environment";
import { ChatService } from "@features/services";

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
    @Input() id: any;
    @Input() image: any;
    @Input() firstName: any;
    @Input() userId: any;
    @Input() userName: any;
    @Input() userImage: any;
    @Input() userData: any;

    languageChangeSubscription;
    language: any;
    isMobile: boolean = false;
    messages: any = [];
    message: string = '';
    formSubmitted: boolean = false;

    constructor(
        private _translateService: TranslateService,
        private _localService: LocalService,
        private _chatService: ChatService,
        private cd: ChangeDetectorRef
    ) {

    }

    @HostListener("window:resize", [])
    private onResize() {
        this.isMobile = window.innerWidth < 768;
    }

    async ngOnInit() {
        initFlowbite();
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

        this.initializeData();
    }

    initializeData() {
        this.loadMessages();
    }

    loadMessages() {
        // Temporary messages to show in UI
        this.messages = [
            {
                sender_id: '61468',
                message: 'Hello!!!',
                date: '2024-07-19 19:30:00'
            },
            {
                sender_id: '61469',
                message: 'Hey there',
                date: '2024-07-19 19:35:00'
            },
            {
                sender_id: '61469',
                message: 'How are you doing?',
                date: '2024-07-19 19:38:00'
            },
            {
                sender_id: '61468',
                message: 'Pretty good. Thank you. You?',
                date: '2024-07-19 19:40:00'
            },
        ]
    }

    async sendMessage() {
        this.formSubmitted = true;

        await this._chatService.openConnection(
            `vcp-chat-${this.userId}`, 
            '007eJxTYOBbUOF0XeiF9FQbwc/FqREnNjsKzv7hYHf21cYbNYn8M7UVGIwSLSySLNPSjI2SzExSDIwtDNISTdKMjRNT0wzSkiwN7tTOStvCwMCQZXfnIyMDKwMjEIL4KgyW5qam5haGBrompilJuoaGqWm6lklmprqWKUnJJqkm5kYpJkkAhI0oOg==', // generated from console for testing
        )
        this._chatService.createMessage(`vcp-chat-${this.id}`, this.message);

        this.formSubmitted = false;
    }

    ngOnDestroy() {
        this.languageChangeSubscription?.unsubscribe();
        this.destroy$.next();
        this.destroy$.complete();
    }
}