import { Component, OnInit } from '@angular/core';
import { Setting } from '../setting.model';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { SettingService } from '../setting.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { startWith, map, takeUntil } from 'rxjs/operators';
import { FuseUtils } from '@fuse/utils';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
  animations: fuseAnimations
})
export class SettingComponent implements OnInit {
  setting: Setting;
  pageType: string;
  settingForm: FormGroup;
  
  // myControl = new FormControl();
  package_id: string;

  // Private
  private _unsubscribeAll: Subject<any>;
  toppings = new FormControl();
  
  env: any;

  /**
   * Constructor
   *
   * @param {SettingService} _settingService
   * @param {FormBuilder} _formBuilder
   * @param {MatSnackBar} _matSnackBar,
   *
   */
  constructor(
    private _settingService: SettingService,
    private _formBuilder: FormBuilder,
    private _matSnackBar: MatSnackBar,
    private _router: Router
  ) {
    // Set the default
    this.setting = new Setting();
    // Set the private defaults
    this._unsubscribeAll = new Subject();

  }
  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  ngOnInit(): void {

    // Subscribe to update product on changes
    this._settingService.onItemChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(setting => {

        if (setting) {
          this.setting = new Setting(setting);
          this.pageType = 'edit';
        }
        else {
          this.pageType = 'new';
          this.setting = new Setting();
        }
        this.settingForm = this.createSettingForm();


      });
  }
  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }



  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------
  /**
   * Create setting form
   *
   * @returns {FormGroup}
   */
  createSettingForm(): FormGroup {
    
      return this._formBuilder.group({
        id: [this.setting.id],
        name: [this.setting.name, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
        handle: [this.setting.handle],
      });
   
  }

  /**
   * Save setting
   */
  saveSetting(): void {
    const data = this.settingForm.getRawValue();
    data.handle = FuseUtils.handleize(data.name);

    this._settingService.saveItem(data)
      .then(() => {

        // Trigger the subscription with new data
        this._settingService.onItemChanged.next(data);

        // Show the success message
        this._matSnackBar.open('Record saved', 'OK', {
          verticalPosition: 'bottom',
          duration: 3000
        });
        this._router.navigate(['/settings']);
      });
  }

  /**
   * Add setting
   */
  addSetting(): void {
    const data = this.settingForm.getRawValue();
    data.handle = FuseUtils.handleize(data.name);

    

    this._settingService.addItem(data)
      .then(() => {

        // Trigger the subscription with new data
        this._settingService.onItemChanged.next(data);
        // Show the success message
        this._matSnackBar.open('Record added', 'OK', {
          verticalPosition: 'bottom',
          duration: 3000
        });

        // Change the location with new one
        this._router.navigate(['/settings']);
      });
  }

}
