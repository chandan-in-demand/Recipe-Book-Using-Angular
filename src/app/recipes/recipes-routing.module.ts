import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecipesComponent } from './recipes.component';
import { AuthGuard } from '../auth/auth-guard';
import { RecipeStartComponent } from './recipe-start/recipe-start.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { RecipeDetailsComponent } from './recipe-details/recipe-details.component';
import { RecipeResolver } from './recipes.resolver';


const routes : Routes =[
  {
    path: '', // make empty for lazy loading to work. and add this to app-routing
    // and remove component from app.module as lazyloading itself will load it when required.
    component:  RecipesComponent,  
    canActivate: [AuthGuard],
    children: [
        { 
            path: '',
            component: RecipeStartComponent
        },
        { 
            path: 'new', 
            component: RecipeEditComponent
        },
        { 
            path: ':id',
             component: RecipeDetailsComponent,
            resolve: [RecipeResolver]
        },
        {
            path: ':id/edit',
            component: RecipeEditComponent,
            resolve: [RecipeResolver]
        }
    ]
}
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class RecipesRoutingModule{

}