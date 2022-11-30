import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { Settings } from './settings.model';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  appSettings = new BehaviorSubject<Settings>({
    fabPositionHorizontal: 'end',
    fabPositionVertical: 'bottom',
    fabSide: 'top',
    fabIcon: 'chevron-up-circle'}
  );

  constructor() {};

  updateFabPosition(corner: string){
    return this.appSettings.pipe(
      take(1),
      tap( settings => {
        this.appSettings.next({
          fabPositionHorizontal: corner === 'top-left' || corner === 'bottom-left'? 'start' : 'end',
          fabPositionVertical: corner === 'top-right' || corner === 'top-left'? 'top' : 'bottom',
          fabSide: settings.fabSide === 'start' || settings.fabSide === 'end'?
                    corner === 'top-left' || corner === 'bottom-left'? 'end' : 'start'
                    : corner === 'top-left' || corner === 'top-right'? 'bottom' : 'top',
          fabIcon: settings.fabSide === 'start' || settings.fabSide === 'end'?
                    corner === 'top-left' || corner === 'bottom-left'? 'chevron-forward-circle' : 'chevron-back-circle'
                    : corner === 'top-left' || corner === 'top-right'? 'chevron-down-circle' : 'chevron-up-circle'
        });
      }));
  };

  updateFabOrientation(orientation: string){
    return this.appSettings.pipe(
      take(1),
      tap( settings => {
        this.appSettings.next({
          fabPositionHorizontal: settings.fabPositionHorizontal,
          fabPositionVertical: settings.fabPositionVertical,
          fabSide: orientation === 'vertical'?
                    settings.fabPositionVertical === 'top'? 'bottom' : 'top'
                    : settings.fabPositionHorizontal === 'start'? 'end' : 'start',
          fabIcon: orientation === 'vertical'?
                    settings.fabPositionVertical === 'top'? 'chevron-down-circle' : 'chevron-up-circle'
                    : settings.fabPositionHorizontal === 'start'? 'chevron-forward-circle' : 'chevron-back-circle',
        });
      }));
  };
}
