/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Capacitor } from '@capacitor/core';
import { Camera } from '@capacitor/camera';
import { CameraResultType, CameraSource } from '@capacitor/camera/dist/esm/definitions';

import { BehaviorSubject, of } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';

import { Expense } from './expense.model';

interface DatabaseExpense {
  amount: string;
  claimed: boolean;
  date: string;
  description: string;
  paid: boolean;
  receiptCaptured: boolean;
  receiptPhotoBase64: string;
  receiptTimeStamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  databaseId: string;
  appInitialised = new BehaviorSubject<boolean>(false);
  private _expenses = new BehaviorSubject<Expense[]>([]);

  constructor(private http: HttpClient){
    this.fetchExpenses().subscribe( (expenses) => {
      console.log(expenses);
      this.appInitialised.next(true);
    });
  };

  get expenses(){
    return this._expenses.asObservable();
  };

  addExpense( expenseDate: Date,
              amount: number,
              description: string,
              receiptPhotoBase64: string,
              receiptTimeStamp: Date,
              claimed: boolean,
              paid: boolean){
    console.log('ExpenseService recieved:', expenseDate, amount, description, claimed, paid);
    const newExpense = new Expense(
      Math.random.toString(),
      expenseDate,
      amount,
      description,
      null,
      receiptPhotoBase64? true : false,
      receiptPhotoBase64,
      receiptTimeStamp,
      claimed,
      paid,
    );

    return this.http.post<{name: string}>('https://ionic-expenses-app-default-rtdb.firebaseio.com/expenses.json',
      {...newExpense, id:null})
        .pipe(
          switchMap( resData => {
            console.log('Post request made to firebase with a single expense');
            this.databaseId = resData.name;
            return this.expenses;
          }),
          take(1),
          tap( expenses => {
            newExpense.id = this.databaseId;
            this._expenses.next(expenses.concat(newExpense).sort( (e1, e2) => Number(e2.date) - Number(e1.date)));
          })
    );
  };

  updateExpense(id: string,
                expenseDate: Date,
                amount: number,
                description: string,
                receiptPhotoBase64: string,
                receiptTimeStamp: Date,
                claimed: boolean,
                paid: boolean){
    let updatedExpenses: Expense[];
    return this.expenses.pipe(
      take(1),
      switchMap( expenses => {
        if (!expenses || expenses.length <= 0) {
          return this.fetchExpenses();
        } else {
          return of(expenses);
        }
      }),
      switchMap( expenses => {
        const updatedExpenseIndex = expenses.findIndex(exp => exp.id === id);
        updatedExpenses = [...expenses];
        const oldExpense = updatedExpenses[updatedExpenseIndex];
        updatedExpenses[updatedExpenseIndex] = new Expense(
          oldExpense.id,
          expenseDate,
          amount,
          description,
          oldExpense.currency,
          receiptPhotoBase64? true : false,
          receiptPhotoBase64,
          receiptTimeStamp,
          claimed,
          paid
        );
        return this.http.put(`https://ionic-expenses-app-default-rtdb.firebaseio.com/expenses/${id}.json`,
        {...updatedExpenses[updatedExpenseIndex], id:null});
      }),
      tap( resData => {
        console.log('Put request made to firebase to update a single expense');
        this._expenses.next(updatedExpenses.sort( (e1, e2) => Number(e2.date) - Number(e1.date)));
      })
    );
  };

  fetchExpenses(){
    console.log('Fetch request made to firebase storage for all expenses');
    return this.http
      .get<{[key: string]: DatabaseExpense}>('https://ionic-expenses-app-default-rtdb.firebaseio.com/expenses.json')
      .pipe(
        map( resData => {
          const expenses = [];
          // eslint-disable-next-line guard-for-in
          for (const key in resData){
            if (resData.hasOwnProperty(key)){
              expenses.push( new Expense(
                key,
                new Date(resData[key].date),
                +resData[key].amount,
                resData[key].description,
                null,
                resData[key].receiptCaptured,
                resData[key].receiptPhotoBase64,
                resData[key].receiptTimeStamp,
                resData[key].claimed,
                resData[key].paid)
              );
            };
          };
          return expenses;
        }),
        tap( expenses => {
          expenses.sort( (e1, e2) => e2.date - e1.date);
          this._expenses.next(expenses);
        })
      );
  };

  getExpense(id: string){
    return this.expenses.pipe(
      take(1),
      map(expenses => ({...expenses.find( ex => ex.id === id)}))
    );
  };

  deleteExpense(id: string){
    return this.http.delete(`https://ionic-expenses-app-default-rtdb.firebaseio.com/expenses/${id}.json`)
      .pipe(
        switchMap( () => {
          console.log('Delete request made to firebase');
          return this.expenses;
        }),
        take(1),
        tap( expenses => {
          this._expenses.next(expenses.filter( expense => expense.id !== id));
        })
      );
  };

  takeReceiptPhoto(){
    if (!Capacitor.isPluginAvailable('Camera')){
      console.log('Camera not available');
      return null;
    };
    console.log('Getting camera');
    return Camera.getPhoto({
      quality: 40,
      source: CameraSource.Prompt,
      correctOrientation: true,
      height: 200,
      resultType: CameraResultType.Base64
    });
  };

  fetchSettings(){};

}
