import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Expense } from '../expense.model';
import { ExpenseService } from '../expense.service';

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.page.html',
  styleUrls: ['./expense-list.page.scss'],
})
export class ExpenseListPage implements OnInit, OnDestroy {
  unclaimedExpenses: Expense[];
  unpaidExpenses: Expense[];
  paidExpenses: Expense[];
  openAccordion: string;
  expensesLoaded = false;
  private expensesSub: Subscription;
  private initialisedSub: Subscription;

  constructor(private expensesService: ExpenseService,
              private router: Router){};

  ngOnInit() {
    console.log('ExpenseList ngOnInit');
    this.initialisedSub = this.expensesService.appInitialised.subscribe(
      initialised => {
        this.expensesLoaded = initialised;
        console.log('AppInitialised: ', this.expensesLoaded);
      });
    this.expensesSub = this.expensesService.expenses.subscribe(
      expenses => {
        this.paidExpenses =  expenses.filter( ex => ex.paid);
        this.unpaidExpenses = expenses.filter( ex => !ex.paid && ex.claimed);
        this.unclaimedExpenses = expenses.filter( ex => !ex.claimed);

        this.openAccordion = this.unclaimedExpenses.length > 0? 'unclaimed' : this.unpaidExpenses.length > 0? 'unpaid' : '';
      }
    );
  };

  editExpense(id: string){
    this.router.navigate(['/expense-edit', id]);
  };

  ngOnDestroy(): void {
    this.expensesSub.unsubscribe();
    this.initialisedSub.unsubscribe();
  }

}
