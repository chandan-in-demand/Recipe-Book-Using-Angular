import { NgModule } from '@angular/core';
import { AlertComponent } from './alert/alert.component';
import { PlaceholderDirective } from './placeholder/placeholder.directive';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { DropdownDirective } from './dropdown-directive';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AlertComponent,
    PlaceholderDirective,
    LoadingSpinnerComponent,
    DropdownDirective
  ],

  imports:[
    CommonModule
  ],
  // exporting is compulsory as it is to be used by other modules also
  exports:[
    AlertComponent,
    PlaceholderDirective,
    LoadingSpinnerComponent,
    DropdownDirective,
    CommonModule
  ]
})
export class SharedModule{

}