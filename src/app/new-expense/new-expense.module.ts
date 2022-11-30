import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewExpensePageRoutingModule } from './new-expense-routing.module';

import { NewExpensePage } from './new-expense.page';
import { ActionButtonComponentModule } from '../action-button/action-button.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    NewExpensePageRoutingModule,
    ActionButtonComponentModule
  ],
  declarations: [NewExpensePage]
})
export class NewExpensePageModule {}
