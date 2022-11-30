import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'new-expense',
    loadChildren: () => import('./new-expense/new-expense.module').then( m => m.NewExpensePageModule)
  },
  {
    path: 'expense-list',
    loadChildren: () => import('./expense-list/expense-list.module').then( m => m.ExpenseListPageModule)
  },
  {
    path: 'expense-edit/:expenseId',
    loadChildren: () => import('./expense-edit/expense-edit.module').then( m => m.ExpenseEditPageModule)
  },
  {
    path: 'information',
    loadChildren: () => import('./information/information.module').then( m => m.InformationPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
