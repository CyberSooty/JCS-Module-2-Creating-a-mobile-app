import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ExpenseService } from '../expense.service';

@Component({
  selector: 'app-new-expense',
  templateUrl: './new-expense.page.html',
  styleUrls: ['./new-expense.page.scss'],
})
export class NewExpensePage implements OnInit {
  form: FormGroup;
  receiptPhotoBase64: string;
  receiptTimeStamp: Date;
  receiptCaptured: boolean;

  constructor(private expenseService: ExpenseService,
              private loadingCtrler: LoadingController,
              private router: Router) { }

  ngOnInit() {
    this.form = new FormGroup({
      expenseDate: new FormControl(new Date().toISOString(), {updateOn:'blur', validators:[]}),
      amount: new FormControl(null, {updateOn:'change', validators:[Validators.required, Validators.pattern(/\d+.\d\d/)]}),
      description: new FormControl(null, {updateOn:'change', validators:[Validators.required]}),
      claimed: new FormControl(false),
      paid: new FormControl({value:false, disabled:true})
    });
  };

  onPhotoRequest(){
    this.expenseService.takeReceiptPhoto()
    .then( image => {
      console.log('Photo taken');
      this.receiptPhotoBase64 = 'data:image/jpeg;base64,' + image.base64String;
      this.receiptTimeStamp = new Date();
      this.receiptCaptured = true;
      console.log(this.receiptPhotoBase64);
    }).catch( error => {
      console.log('Error posted',error);
    });
  };

  onSave(){
    if (!this.form.valid) {
      console.log('New expense not valid');
      console.log(this.form);
      return;
    }
    this.loadingCtrler.create({
      message:'Creating expense...'
    }).then( loadingEl => {
      loadingEl.present();
      this.expenseService.addExpense(
        new Date(this.form.value.expenseDate),
        +this.form.value.amount,
        this.form.value.description,
        this.receiptPhotoBase64? this.receiptPhotoBase64: null,
        this.receiptTimeStamp? this.receiptTimeStamp : null,
        this.form.value.claimed,
        this.form.value.paid
        ).subscribe( ()=> {
          loadingEl.dismiss();
          this.form.reset();
          this.receiptPhotoBase64 = null;
          this.receiptTimeStamp = null;
          this.router.navigate(['/expense-list']);
        });
    });
  };

  controlPaidToggleInput(event){
    if (!event.detail.checked) {
      this.form.controls.paid.setValue(false);
      this.form.controls.paid.disable();
    } else {
      this.form.controls.paid.enable();
    }
  };

  onCancel(){
    this.form.reset();
    this.router.navigate(['/dashboard']);
  };

}
