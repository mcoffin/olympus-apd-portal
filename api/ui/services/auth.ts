import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class LoginService {
    constructor(private cookieService: CookieService, private http: HttpClient) {}

    logout(): Observable<any> {
        return this.http.get('logout', { observe: 'response' })
            .pipe(
                tap((r) => {
                    console.log('logging out');
                    this.cookieService.delete('user_id');
                })
            );
    }

    get isLoggedIn(): Observable<boolean> {
        return this.http.get('api/v1', { observe: 'response' })
            .map(r => true)
            .catch(err => Observable.of(false));
    }
}
