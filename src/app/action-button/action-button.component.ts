import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ExpenseService } from '../expense.service';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-action-button',
  templateUrl: './action-button.component.html',
  styleUrls: ['./action-button.component.scss'],
})
export class ActionButtonComponent implements OnInit, OnDestroy {
  @Input() page: string;
  settingsSub: Subscription;
  vertical: string;
  horizontal: string;
  side: string;
  icon: string;

  constructor(private router: Router,
              private settingsService: SettingsService) { }

  ngOnInit(){
    this.settingsSub = this.settingsService.appSettings.subscribe( settings => {
      this.vertical = settings.fabPositionVertical;
      this.horizontal = settings.fabPositionHorizontal;
      this.side = settings.fabSide;
      this.icon = settings.fabIcon;
    });
  }

  showDashboard(){
    this.router.navigateByUrl('/');
  };

  showNewExpense(){
    this.router.navigateByUrl('/new-expense');
  };

  showExpenseList(){
    this.router.navigateByUrl('/expense-list');
  };

  showSettings(){
    this.router.navigateByUrl('/settings');
  };

  showInformation(){
    this.router.navigateByUrl('/information');
  };

  ngOnDestroy(): void {
    this.settingsSub.unsubscribe();
  }

}
