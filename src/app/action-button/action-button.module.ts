import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ActionButtonComponent } from './action-button.component';

@NgModule({
  declarations:[ActionButtonComponent],
  imports:[
    IonicModule,
    CommonModule
  ],
  exports:[ActionButtonComponent]
})
export class ActionButtonComponentModule {}
