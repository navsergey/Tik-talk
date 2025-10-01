import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs';
import {TokenResponse} from './auth.interface';
import {CookieService} from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  http = inject(HttpClient)
  cookieService = inject(CookieService) //Для вытягивания token из куков
  baseApiUrl = 'https://icherniakov.ru/yt-course/auth/';

  token: string | null = null;
  refreshtoken: string | null = null;

  get isAuth(){
    if (!this.token){
      this.token = this.cookieService.get('token'); //Проверка куков
    }
    return !!this.token; //Двойное отрицание, чтобы привести к boolean
  }
  login(payload: {username: string, password: string}) {
    const fd = new FormData();

    fd.append('username', payload.username);
    fd.append('password', payload.password);
    return this.http.post<TokenResponse>(`${this.baseApiUrl}token`, fd).pipe(
      tap(val => {
        this.token = val.access_token;
        this.refreshtoken = val.refresh_token;
        this.cookieService.set('token', this.token);
        this.cookieService.set('refresh_token', this.refreshtoken);
      })
    )
  }
}
