import { NgModule } from '@angular/core';
import { AuthComponent } from './auth.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AuthComponent,
  ],
  imports:[
    SharedModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: '', component: AuthComponent
      }
    ])
  ],
  exports:[
    AuthComponent,
    RouterModule
  ]
})
export class AuthModule{

}