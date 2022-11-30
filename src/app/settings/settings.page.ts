import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  form: FormGroup;

  constructor(private settingsService: SettingsService) { }

  ngOnInit() {
    this.form = new FormGroup({
      fabPosition: new FormControl('bottom-right')
    });
  };

  updateFabPosition(corner: string){
    this.settingsService.updateFabPosition(corner).subscribe();
  };

  updateFabOrientation(direction: string){
    this.settingsService.updateFabOrientation(direction).subscribe();
  };
}
