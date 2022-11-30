import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExpenseEditPage } from './expense-edit.page';

const routes: Routes = [
  {
    path: '',
    component: ExpenseEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExpenseEditPageRoutingModule {}
