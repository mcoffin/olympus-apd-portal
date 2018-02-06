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
        console.log('logging out');
	this.cookieService.delete('user_id');
	return this.http.get<any>('http://localhost:8080/logout')
            .pipe(
                catchError((e, caught) => {
                    console.error('error while logging out: ${e}');
                    return new ErrorObservable("error while logging out");
                }),
            );
    }

    get isLoggedIn(): boolean {
        return this.cookieService.check('user_id');
    }
}
