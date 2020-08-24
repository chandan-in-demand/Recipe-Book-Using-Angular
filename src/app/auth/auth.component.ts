import { Component, ComponentFactoryResolver, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService, AuthResponseData } from './auth.service';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnDestroy{
    isLoginMode = true;
    isLoading = false;
    error: string = null;
    private closeSub: Subscription;
    @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective;  //this var is do display component alert

    constructor(private authService: AuthService,
        private router : Router,
        private componentFacotryResolver: ComponentFactoryResolver
        ){}

    onSwitchMode(){
        this.isLoginMode = !this.isLoginMode;
    }
    
    onSubmit(form: NgForm){
        if(!form.valid){
            return;
        }
        const email = form.value.email;
        const password = form.value.password;
        let authObs: Observable<AuthResponseData>;;
        this.isLoading = true;
        if(this.isLoginMode){
            // authObs = this.authService.login(email, password);
          authObs = this.authService.login(email,password);
        }
        else{
           authObs =  this.authService.signUp(email, password);
        }
       authObs.subscribe(resData => {
        console.log(resData);
        this.isLoading = false;
        this.router.navigate(['/recipes']);
    }, errorMessage => {
       this.error = errorMessage;
    //    console.log(this.error);

       this.showErrorAlert(errorMessage); 
        this.isLoading = false;
    }
    
    );
        form.reset();
    }

    onHandleError(){
        this.error = null;
        console.log('handle error method is called');
    }

    private showErrorAlert(message: string){
        const alertComponentFactory = this.componentFacotryResolver.resolveComponentFactory
        (AlertComponent); // still not instantiated 
        // we hv just passed the type.
        // const alertCmp = new AlertComponent();   // this does not work
        const hostViewConatianerRef = this.alertHost.viewContainerRef;  // taking viewconatianerref from placeholder
        //where it was made public
        hostViewConatianerRef.clear();
        const componentRef =  hostViewConatianerRef.createComponent(alertComponentFactory);
        // here we are calling the instance cretaed inside the alertcomponent 
        componentRef.instance.message = this.error;
        console.log(this.error);
        this.closeSub = componentRef.instance.close.subscribe(()=>{
            this.closeSub.unsubscribe;
            hostViewConatianerRef.clear();
            
        })
    }

    ngOnDestroy(){
        if(this.closeSub){
            this.closeSub.unsubscribe;
        }
    }
 }