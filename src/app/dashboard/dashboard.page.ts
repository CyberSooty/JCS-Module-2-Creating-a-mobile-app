import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Expense } from '../expense.model';
import { ExpenseService } from '../expense.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit, OnDestroy {
  expensesSub: Subscription;
  initialisedSub: Subscription;
  expensesLoaded = false;
  numberUnclaimedExpenses = 0;
  amountUnclaimedExpenses = 0;
  numberAwaitingPayment: number;
  amountAwaitingPayment: number;

  constructor(private expensesService: ExpenseService) { }

  ngOnInit() {
    console.log('Dashboard ngOnInit');
    this.initialisedSub = this.expensesService.appInitialised.subscribe(
      initialised => {
        this.expensesLoaded = initialised;
        console.log('AppInitialised: ', this.expensesLoaded);
      }
    );
    this.expensesSub = this.expensesService.expenses.subscribe(
      expenses => {
        this.amountUnclaimedExpenses = 0;
        this.numberUnclaimedExpenses = 0;
        this.numberAwaitingPayment = 0;
        this.amountAwaitingPayment = 0;
        expenses.forEach( expense => {
          if (!expense.claimed) {
            this.numberUnclaimedExpenses += 1;
            this.amountUnclaimedExpenses += expense.amount;
          } else if (!expense.paid) {
            this.numberAwaitingPayment += 1;
            this.amountAwaitingPayment += expense.amount;
          };
        });
      }
    );
  };

  ngOnDestroy(): void {
    this.expensesSub.unsubscribe();
    this.initialisedSub.unsubscribe();
  };
}
