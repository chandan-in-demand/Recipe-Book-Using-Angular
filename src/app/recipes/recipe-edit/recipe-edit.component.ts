import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { RecipeService } from '../recipe-service';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode = false;
  recipeForm : FormGroup;
  constructor(private route: ActivatedRoute,
    private recipeService: RecipeService,
    private router: Router) { }

  ngOnInit(): void {
    this.route.params
    .subscribe(
      (params: Params)=>{
        this.id = +params['id'];
        this.editMode = params['id'] !=null; // if ur route address contain the id then its edit mode otherwise new mode
        this.initForm();
      }
    );
  } 

  onAddIngredients(){
    (<FormArray>this.recipeForm.get('ingredients')).push(              // fetching the array
      new FormGroup({
        'name' : new FormControl('', Validators.required),
        'amount': new FormControl('', [Validators.required,
                Validators.pattern(/^[1-9]+[0-9]*$/)
              ])
      })
    );     
  }

  private initForm(){ // call when route param change
    let recipeName ='';
    let recipeImagePath='';
    let recipeDescription='';
    let recipeIngredients = new FormArray([]);


    if(this.editMode){
      const recipe = this.recipeService.getRecipeById(this.id);
      recipeName = recipe.name;
      recipeImagePath = recipe.imagePath;
      recipeDescription= recipe.description;
      console.log(this.recipeService.getRecipe());
      if(recipe['ingredient']) {    // checking if recipe recieved through id has ingredients or not
        for(let ingredientEle of recipe.ingredient){
          console.log(ingredientEle.name);
          console.log(ingredientEle.amount);
          recipeIngredients.push(
            new FormGroup({
              'name' :new FormControl(ingredientEle.name, Validators.required),
              'amount': new FormControl(ingredientEle.amount, [Validators.required, 
                          Validators.pattern(/^[1-9]+[0-9]*$/)])
            })
          );  
        }
      }
    }

    this.recipeForm = new FormGroup({
      'name' : new FormControl(recipeName, Validators.required),
      'imagePath': new FormControl(recipeImagePath, Validators.required),
      'description': new FormControl(recipeDescription, Validators.required),
      'ingredients': recipeIngredients
      
    });
  }

  onSubmit(){
    const newRecipe = new Recipe(this.recipeForm.value['name'],
      this.recipeForm.value['description'],
      this.recipeForm.value['imagePath'],
      this.recipeForm.value['ingredients']);
     
    if(this.editMode){
      console.log(this.recipeService.getRecipe());
      this.recipeService.updateRecipe(this.id, newRecipe);
    }  else{
      this.recipeService.addRecipe(newRecipe);
    }

    this.onCancel();
    
  }

  get controls() { // a getter!
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  onCancel(){
    this.router.navigate(['../'], {relativeTo: this.route});
    
  }

  onDeleteIngredients(index: number){
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }
  
       
}
