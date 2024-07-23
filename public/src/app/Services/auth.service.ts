import { Injectable } from '@angular/core';
// import { AngularFireAuth } from '@angular/fire/auth';
// import firebase from 'firebase/app';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private chatRoom: string = '';
    private User: string = '';

  

    getUser() {
        return this.User;
    }
    setUser(user: string) {
        this.User = user;
    }
    getchatRoom() {
        return this.chatRoom;
    }
    setchatRoom(chatRoom: string) {
        this.chatRoom = chatRoom;
    }
}
