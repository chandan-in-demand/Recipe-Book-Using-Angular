import { Resolve, ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { DataStorageService } from '../shared/data-storage-servicee';
import { RecipeService } from './recipe-service';

@Injectable({providedIn: 'root'})
export class RecipeResolver implements Resolve<Recipe[]>{
    constructor(private dataStorageService: DataStorageService, private recipeService: RecipeService){}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
        const recipes = this.recipeService.getRecipe();
        if(recipes.length  === 0){
            return this.dataStorageService.fetchRecipes();
        } else{
            return recipes;
        }
    }
}