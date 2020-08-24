import { Component, OnInit, Input, OnDestroy} from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingService } from './shopping-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
  
})
export class ShoppingListComponent implements OnInit, OnDestroy {

  ingredients: Ingredient[];
  private igChangedSub: Subscription;
  constructor(private shoppingService: ShoppingService) { }

  ngOnInit(): void {
    this.ingredients = this.shoppingService.getIngredients();
    this.igChangedSub = this.shoppingService.ingredientsChanged.subscribe(
      (ingredients : Ingredient[]) =>{
        this.ingredients = ingredients;
      }
    );
  }

  onIngredientAdded(ingredient: Ingredient){
    this.ingredients.push(ingredient);
  }

  ngOnDestroy(){
    this.igChangedSub.unsubscribe();
  }

  onEditItem(index: number){ 
    this.shoppingService.startedEditing.next(index);
  }
 
}
