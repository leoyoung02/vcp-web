import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable, Subject } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ProfessionalsService } from "@features/services";
import { environment } from "@env/environment";
import AC, { AgoraChat } from 'agora-chat';

@Injectable({
    providedIn: "root",
})
export class ChatService {
    private headers: HttpHeaders;

    private appKey = environment.agoraChatAppKey;

    private connection;

    constructor(
        private _http: HttpClient,
        private _professionalsService: ProfessionalsService,
    ) {
        this.headers = new HttpHeaders({
            "Content-Type": "application/json",
        });

        if (this.appKey == '')
            console.error('APPKEY REQUIRED');

        this.connection = new AC.connection({
            appKey: this.appKey,
        })

        this.addEventHandler(this.connection);
    }

    addEventHandler(connection) {
        connection.addEventHandler('connection&message', {
            onConnected: () => {
                console.log('connected!')
            },
            onDisconnected: () => {
                console.log('disconnected!')
            },
            onTextMessage: (message) => {
                console.log('message', message);
            },
            onTokenWillExpire: (params) => {
                console.log('params', params);
            },
            onTokenExpired: (params) => {
                console.log('params', params);
            },
            onError: (error) => {
                console.log('error', error);
            }
        });
    }

    getConnection() {
        return this.connection;
    }

    async openConnection(userId, token) {
        await this.connection?.open({
			user: userId,
			agoraToken: token,
		})
    }

    closeConnection() {
        this.connection?.close();
    }

    async createMessage(peerId, peerMessage) {
        let options: AgoraChat.CreateMsgType = {
            chatType: "singleChat",
            type: "txt",
            to: peerId,
            msg: peerMessage,
        };
        let msg = AC.message.create(options);
        this.connection
            .send(msg)
            .then((res) => {
                console.log("send private text success");
            })
            .catch((error) => {
                console.log('send message error', error);
            });
        

        // conn.getConversationlist({
        //     pageSize: 50
        // }).then((res)=>{
        //     console.log(res)
        // })

        // conn.getHistoryMessages({
        //     pageSize: 20,
        //     cursor: -1,
        //     chatType: 'singleChat',
        //     targetId: peerId,
        // }).then((res)=>{
        //     console.log(res)
        // })
    }
}