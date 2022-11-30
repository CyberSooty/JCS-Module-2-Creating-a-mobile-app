import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Expense } from '../expense.model';
import { ExpenseService } from '../expense.service';

@Component({
  selector: 'app-expense-edit',
  templateUrl: './expense-edit.page.html',
  styleUrls: ['./expense-edit.page.scss'],
})
export class ExpenseEditPage implements OnInit, OnDestroy {
  form: FormGroup;
  expensesSub: Subscription;
  expense: Expense;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private expensesService: ExpenseService,
              private loadingCtrlr: LoadingController) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('expenseId')){
        console.log('no id found');
        this.router.navigate(['/expense-list']);
        return;
      };
      this.expensesSub = this.expensesService.getExpense(paramMap.get('expenseId')).subscribe( expense => {
        this.expense = expense;
        this.form = new FormGroup({
          expenseDate: new FormControl(this.expense.date.toISOString(), {updateOn:'blur', validators:[]}),
          amount: new FormControl(this.expense.amount,
            {updateOn:'change', validators:[Validators.required, Validators.pattern(/\d+.\d\d/)]}),
          description: new FormControl(this.expense.description, {updateOn:'change', validators:[Validators.required]}),
          claimed: new FormControl(this.expense.claimed),
          paid: new FormControl({value: this.expense.paid, disabled: !this.expense.claimed})
        });
      });
    });
  };

  onPhotoRequest(){
    this.expensesService.takeReceiptPhoto()
    .then( image => {
      console.log('Photo taken');
      this.expense.receiptPhotoBase64 = 'data:image/jpeg;base64,' + image.base64String;
      this.expense.receiptTimeStamp = new Date();
      this.expense.receiptCaptured = true;
    }).catch( error => {
      console.log('Error posted',error);
    });
  };

  onUpdate(){
    if (!this.form.valid) {
      console.log('Form not valid');
      return;
    };
    this.loadingCtrlr.create({
      message: 'Updating expense...'
    }).then( loadingEl => {
      loadingEl.present();
      this.expensesService.updateExpense(
        this.expense.id,
        new Date(this.form.value.expenseDate),
        this.form.value.amount,
        this.form.value.description,
        this.expense.receiptPhotoBase64,
        this.expense.receiptTimeStamp,
        this.form.value.claimed,
        this.form.value.paid
      ).subscribe( ldingEl => {
        loadingEl.dismiss();
        this.form.reset();
        this.router.navigate(['/expense-list']);
      });
    });
  };

  onCancel(){
    this.form.reset();
    this.router.navigate(['/expense-list']);
  };

  onDelete(){
    this.expensesService.deleteExpense(this.expense.id).subscribe( () => {
      this.router.navigate(['/expense-list']);
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

  ngOnDestroy(): void {
    this.expensesSub.unsubscribe();
  }

}
