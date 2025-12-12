import { Injectable, inject } from '@angular/core';
import { Auth, authState, signInWithEmailAndPassword, signOut, User } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private auth = inject(Auth);

    // Observable of the current user, or null if not logged in
    readonly user$: Observable<User | null> = authState(this.auth);

    constructor() { }

    login(email: string, password: string) {
        return signInWithEmailAndPassword(this.auth, email, password);
    }

    logout() {
        return signOut(this.auth);
    }
}
