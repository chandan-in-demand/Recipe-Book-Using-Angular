import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingService } from '../shopping-service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
subscription : Subscription;
editMode = false;  
editedItemIndex: number;
editItem: Ingredient; // value which is fetched from shopping service
@ViewChild('f') shoppingEditForm: NgForm;


  constructor(private shoppingService : ShoppingService) { }

  ngOnInit(): void {
    this.subscription =  this.shoppingService.startedEditing.subscribe(
      (index: number) => {
        this.editedItemIndex = index;
        this.editMode = true;
        this.editItem = this.shoppingService.getIngredient(index);
        this.shoppingEditForm.setValue({
          name: this.editItem.name,
          amount: this.editItem.amount
        });
      }
    );
      
   

  }

  onSubmit(form: NgForm){
    const value = form.value;
    const newIngredientsAdded = new Ingredient(value.name, value.amount);
    if(this.editMode){
      this.shoppingService.updateIngredient(this.editedItemIndex, newIngredientsAdded);
    }else{
      this.shoppingService.addIngredient(newIngredientsAdded);
    }
    this.editMode = false; // setting back to false so that we can leave edit mode
    form.reset();
  }

  onClear(){
    this.shoppingEditForm.reset();
    this.editMode = false;
  }

  onDelete(){
    this.shoppingService.deleteIngredient(this.editedItemIndex);
    this.onClear();
  }
  ngOnDestroy(){
    this.subscription.unsubscribe;
  }
}
