import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse } from '../interfaces/auth.interface';
import { User } from '../interfaces/user.interface';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = environment.baseUrl
  private _user!: User
  
  get user() {
    return { ...this._user};
  }
  constructor( private http: HttpClient) { }

  register(name: string, email: string, password: string) {
    const url = `${this.baseUrl}/auth/new`;
    const body = { name, email, password };

    return this.http.post<AuthResponse>( url , body )
            .pipe(
              tap(
                resp => {
                  localStorage.setItem('token', resp.token!)
                  if ( resp.ok ) {
                    this._user = {
                      name: resp.name!,
                      uid: resp.uid!,
                      email: resp.email!
                    }
                  }
                }
              ),
              map( resp => resp.ok ),
              catchError( err => of(err.error.msg))
            )
  }

  login ( email: string, password: string ){

    const url = `${this.baseUrl}/auth/login`;
    const body = { email, password };

    return this.http.post<AuthResponse>( url, body)
            .pipe(
              tap( resp => {
                localStorage.setItem('token', resp.token! );
                if ( resp.ok ) {
                  this._user = {
                    name: resp.name!,
                    uid: resp.uid!,
                    email: resp.email!
                  }
                }
                console.log('new user ',this._user);
              }),
              map( resp => resp.ok ),
              catchError( err => of(err.error.msg) )
            )
  }

  validateToken() {
    const url = `${this.baseUrl}/auth/renew`;
    const headers = new HttpHeaders()
      .set('x-token', localStorage.getItem('token') || '') 

    return this.http.get<AuthResponse>( url, { headers } )
            .pipe(
              map( resp => {
                localStorage.setItem('token', resp.token! );
                if ( resp.ok ) {
                  this._user = {
                    name: resp.name!,
                    uid: resp.uid!,
                    email: resp.email!
                  }
                }
                
                return resp.ok;
              }),
              catchError( err => of(false) )
            );
  }

  logout(){
    localStorage.clear();
  }
}
