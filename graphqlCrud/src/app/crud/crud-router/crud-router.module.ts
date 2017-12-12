import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from '../components/list/list.component';
import { FormComponent } from '../components/form/form.component';

const ROUTES: Routes = [
  { path: 'list', component: ListComponent },
  { path: 'add', component: FormComponent },
  { path: 'edit', component: FormComponent },
  { path: '**', pathMatch: 'full', redirectTo: '/list' }
];

@NgModule({
  imports: [ RouterModule.forChild(ROUTES) ],
  exports: [ RouterModule ]
})
export class CrudRouterModule { }
