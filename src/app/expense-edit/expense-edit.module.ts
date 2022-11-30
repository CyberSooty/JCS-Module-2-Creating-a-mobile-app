import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExpenseEditPageRoutingModule } from './expense-edit-routing.module';

import { ExpenseEditPage } from './expense-edit.page';
import { ActionButtonComponentModule } from '../action-button/action-button.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    ExpenseEditPageRoutingModule,
    ActionButtonComponentModule
  ],
  declarations: [ExpenseEditPage]
})
export class ExpenseEditPageModule {}
