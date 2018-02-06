import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class LoginService {
    constructor(private cookieService: CookieService) {}

    get isLoggedIn(): boolean {
        return this.cookieService.check('google_access_token');
    }
}
