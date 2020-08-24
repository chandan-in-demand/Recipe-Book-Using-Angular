import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { environment } from "../../environments/environment";
import { User } from './user.model';
import { Router } from '@angular/router';

export interface AuthResponseData{
  kind: string,
  idToken: string,
  email:	string,
  refreshToken:	string,
  expiresIn:	string,
  localId: string, 
  registered?: boolean
}

@Injectable({providedIn: 'root'})
export class AuthService{
  userSubject = new  BehaviorSubject<User>(null); // takes intial value
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router){}

  signUp(email: string , password: string){
    return this.http.post<AuthResponseData>
    ('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key='+ environment.firebaseAPIKEY,
    {
      email: email,
      password: password,
      returnSecureToken: true
    }
    ).pipe(catchError(this.handleError), tap(resData =>
      {
        this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
      }));
      // firebase return expiresIn that is time in msec till the token expires
      
  }

  login(email: string, password: string){
    return this.http.post<AuthResponseData>
    ('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='+ environment.firebaseAPIKEY,
    {
      email: email,
      password: password,
      returnSecureToken: true
    }
    ).pipe(catchError(this.handleError), tap(resData =>
      {
        this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
      }));
  }

  private handleAuthentication(email: string, userId: string, token: string, expiresIn: number){
    const expirationDate = new Date(new Date().getTime() + expiresIn*1000);  //convert to ms and back to string
      const user = new User(
        email, 
        userId, 
        token, 
        expirationDate
      );
      this.userSubject.next(user);
      //starting timer for user
      
      this.autoLogout(expiresIn * 1000);

      localStorage.setItem('userData', JSON.stringify(user)); 
      //storing data in local object and here json.strrignify convert user object to string.
  }

  logout(){
    this.userSubject.next(null);  // we have made the emited value to null.
    this.router.navigate(['./auth']);
    localStorage.removeItem('userData');
    if(this.tokenExpirationTimer){
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  // this is timer get enterd first and counter start
  autoLogout(expirationDuration: number){
    console.log(expirationDuration);
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration) // manually added the timer we should write expirationDuration
  }

  autoLogin(){
    //json parse conver string to object
    const userData:{
      email: string,
      id: string,
      _token: string,
      _tokenExpirationDate: string
      // we will convert it manually into date
    } = JSON.parse(localStorage.getItem('userData')) ;
    if(!userData){
      return;
    }

    const loadUser = new User
    (
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
       );

      if(loadUser.token){   // check if token exists for this user or not 
        // here we are calling token method from model
        this.userSubject.next(loadUser);  
        //calculate remaining time
        const expirationDuration = 
          new Date(userData._tokenExpirationDate).getTime() -
          new Date().getTime();
        this.autoLogout(expirationDuration);
      }
  }


  private handleError(errorRes: HttpErrorResponse){
    console.log(errorRes);
    let errorMessage = "An unknown error occured"
    if(!errorRes.error || !errorRes.error.error){
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = "This Email Already Exists"
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = "This Email Does Not Exists"
        break;
      case 'TOO_MANY_ATTEMPTS_TRY_LATER':
        errorMessage = "Too many unsuccessfull attempts" 
        break; 
      case 'INVALID_PASSWORD':
        errorMessage = "This password is not Correct"      
        break;
    }
    return throwError(errorMessage);
  }
}