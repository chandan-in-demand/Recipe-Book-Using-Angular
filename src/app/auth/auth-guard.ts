import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate{
  constructor(private authService: AuthService, private router: Router){}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree| Observable<boolean| UrlTree> | 
    Promise<boolean | UrlTree>{
      //by using map we are converting the object to boolean
      return this.authService.userSubject.pipe(
        take(1),
        map(user => {
        const isAuth = !!user;
        if(isAuth){
          return true;
        }
         return this.router.createUrlTree(['/auth']);
      })
      );
  }
}