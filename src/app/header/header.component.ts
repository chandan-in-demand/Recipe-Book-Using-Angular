import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { DataStorageService } from '../shared/data-storage-servicee';
import { AuthService } from '../auth/auth.service';
import { Observable, Subscription } from 'rxjs';

@Component({
    selector: "app-header",
    templateUrl: './header.component.html',
    
})
export class HeaderComponent implements OnInit, OnDestroy{
    collapsed = true;
    private userSub : Subscription;
    isAuthenticated = false;

    constructor(private dataStorageService: DataStorageService, private authService: AuthService){}

    ngOnInit(){
        this.userSub = this.authService.userSubject.subscribe(userData => {
            this.isAuthenticated = !!userData; // checking if user is returned null or notnull
        });
    }

    onSaveData(){  // onsave method called
    this.dataStorageService.storeRecipes();  // 
    }

    onFetchData(){
    this.dataStorageService.fetchRecipes().subscribe(); // subscribe can be empty as we are getting no reponse.
    }

    ngOnDestroy(){
        this.userSub.unsubscribe();
    }
    
    onLogout(){
        this.authService.logout();
    }
  
}