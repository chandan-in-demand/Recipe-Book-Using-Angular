import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RecipeService } from '../recipes/recipe-service';
import { Recipe } from '../recipes/recipe.model';
import { map,tap, take, exhaustMap } from "rxjs/operators";
import { AuthService } from '../auth/auth.service';

@Injectable({providedIn: 'root'})
export class DataStorageService{
  constructor( private http: HttpClient, private recipeService: RecipeService,
      private authService : AuthService){}

  storeRecipes(){
    const recipes = this.recipeService.getRecipe(); // return empty array if not any recipe present
    return this.http.put('https://ng-course-recipe-book-de2c1.firebaseio.com/recipes.json',
    recipes).subscribe();
    // as it return observable so we just need to subscribe.
  }

  fetchRecipes(){
    
    return this.http.get<Recipe[]>('https://ng-course-recipe-book-de2c1.firebaseio.com/recipes.json',
      ).pipe(
          map(recipes => {
            return recipes.map(recipe => {  //some recipes might be added without ingredients and if we directly try 
              //to access ingredient of those recipe it might error, so we add empty ingredient.
              return {
                ...recipe,
                ingredient: recipe.ingredient ? recipe.ingredient: []
              };
            });
          }), 
          // tap dont alter the data
            tap(recipes =>{
              this.recipeService.setRecipes(recipes);
            })
        );
  }
}