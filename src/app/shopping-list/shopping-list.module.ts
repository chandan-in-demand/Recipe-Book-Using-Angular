import { NgModule } from '@angular/core';
import { ShoppingListComponent } from './shopping-list.component';
import { ShoppingEditComponent } from './shopping-edit/shopping-edit.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    ShoppingListComponent,
    ShoppingEditComponent
  ],
  imports: [
    RouterModule,
    FormsModule,
    // CommonModule,   // used in place of browser module for its child,
    RouterModule.forChild([
      {
        path: '',
        component: ShoppingListComponent 
      }
    ]),
    SharedModule

  ]
})
export class ShoppingListModule{

}