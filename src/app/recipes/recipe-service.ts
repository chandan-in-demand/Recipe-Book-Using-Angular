import { Recipe } from './recipe.model';
import { Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingService } from '../shopping-list/shopping-service';
import { Subject } from 'rxjs';

@Injectable()
export class RecipeService{
    // recipeSelected = new EventEmitter<Recipe>();
    recipeChanged = new Subject<Recipe[]>();
  // private recipes: Recipe[] = [
  //   new Recipe('Corn special',
  //   'salty',
  //   'https://i2.wp.com/www.downshiftology.com/wp-content/uploads/2018/12/Shakshuka-19.jpg', 
  //   [
  //       new Ingredient('Meat', 2),
  //       new Ingredient('Egg', 2)
  //   ]),
  //   new Recipe('Corn Pizza',
  //   'olive',
  //   'https://res.cloudinary.com/hellofresh/image/upload/f_auto,fl_lossy,q_auto,w_610/v1/hellofresh_s3/image/5dcc139c96d0db43857c2eb3-a12c2ae7.jpg',
  //   [
  //       new Ingredient('Pizza', 2),
  //       new Ingredient('Meat', 2),
  //       new Ingredient('Egg', 2)
  //   ]) 
  // ];

  private recipes: Recipe[] = [];
  constructor(private shoppingService: ShoppingService){}

  getRecipe(){
      return this.recipes.slice();
  }

  getRecipeById(index: number){ 
      return this.recipes[index];
  }
  addIngredientsToShoppingList(ingredients: Ingredient[]){
    this.shoppingService.addIngredients(ingredients);
  }

  addRecipe(recipe: Recipe){
    this.recipes.push(recipe);
    this.recipeChanged.next(this.recipes.slice());
    console.log('Add Recipe method called');
  }

  updateRecipe(index: number, newRecipe: Recipe){
    this.recipes[index] = newRecipe;
    this.recipeChanged.next(this.recipes.slice());
    console.log('update Recipe method called');
  }

  deleteRecipe(index: number){
    this.recipes.splice(index, 1);
    this.recipeChanged.next(this.recipes.slice());
  }

  setRecipes(recipes : Recipe[]){
    this.recipes = recipes;
    this.recipeChanged.next(this.recipes.slice());
  }

}
