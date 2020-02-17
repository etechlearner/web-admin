import { Component, EventEmitter, OnInit } from '@angular/core';
import { Setting } from '../setting.model';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { SettingService } from '../setting.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { CountryCode } from 'app/main/gyms/country.code';

@Component({
    selector: 'app-setting-default',
    templateUrl: './setting-default.component.html',
    styleUrls: ['./setting-default.component.scss'],
    animations: fuseAnimations
})

export class SettingDefaultComponent implements OnInit {
    setting: Setting;
    settings: Setting[] = [];
    pageType: string;
    settingForm: FormGroup;
    package_id: string;
    toppings = new FormControl();
    env: any;
    public countrySelected: any;
    countryInfo: any[] = new CountryCode().data;
    disableButton: boolean = false;
    adminPhone: any;
    adminIsoCode: any;

    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _settingService: SettingService,
        private _formBuilder: FormBuilder,
        private _matSnackBar: MatSnackBar
    ) {
        // Set the default
        this.setting = new Setting();
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.countrySelected = this.countryInfo[0];
    }

    ngOnInit(): void {
        // Subscribe to update product on changes
        this._settingService.onItemsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(setting => {
                if (setting.length > 0) {
                    this.settings = setting;
                    this.settings.forEach(setting => {
                        if (setting.appKey === 'ADMINPHONE') {
                            this.adminPhone = setting.appValue.slice(-10, setting.appValue.length);
                            this.adminIsoCode = setting.appValue.slice(0, setting.appValue.indexOf(this.adminPhone))
                            this.countryInfo.forEach(country => {
                                if (country.dial_code == this.adminIsoCode) {
                                    this.countrySelected = country;
                                }
                            })
                        }
                    })
                    // setting.forEach(element => {
                    //     this.settings.push(new Setting(element));
                    // });
                    // this.setting = new Setting(setting);
                    this.pageType = 'edit';
                } else {
                    this.pageType = 'new';
                    this.settings.push(new Setting({ appKey: 'GYMBILLINGCOST', appValue: '10', type: 'default' }));
                    this.settings.push(new Setting({ appKey: 'GYMCOMMISSION', appValue: '15', type: 'default' }));
                    this.settings.push(new Setting({ appKey: 'CANCELLATION', appValue: '10', type: 'default' }));
                    this.settings.push(new Setting({ appKey: 'ADMINEMAIL', appValue: 'admin@gmail.com', type: 'default' }));
                    this.settings.push(new Setting({ appKey: 'ADMINPASSWORD', appValue: 'admin123', type: 'default' }));
                    this.settings.push(new Setting({ appKey: 'ADMINPHONE', appValue: '00000000000', type: 'default' }));
                }
                this.settingForm = this.createSettingForm();
                this.onChanges();
            });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    createSettingForm(): FormGroup {
        return this._formBuilder.group({
            GYMBILLINGCOST: [this.getSettings('GYMBILLINGCOST'), [Validators.required, Validators.max(999999), Validators.min(0)]],
            GYMCOMMISSION: [this.getSettings('GYMCOMMISSION'), [Validators.required, Validators.max(100), Validators.min(0)]],
            CANCELLATION: [this.getSettings('CANCELLATION'), [Validators.required, Validators.max(100), Validators.min(0)]],
            ADMINEMAIL: [this.getSettings('ADMINEMAIL'), [Validators.required, Validators.email]],
            // UPPERCASE, LOWER CASE AND NUMBERS, MIN LENGTH 8
            ADMINPASSWORD: [this.getSettings('ADMINPASSWORD'), [Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[-_!?/<>;:{}()*@#$%^&+=])(?=\\S+$).{8,}$')]],
            ADMINPHONE: [this.getSettings('ADMINPHONE').slice(-10, this.getSettings('ADMINPHONE').length), [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9 ]*')]],
            isoCode: [this.adminIsoCode ? this.adminIsoCode : "0", [Validators.required]],
        });
    }

    onChanges(): void {
        this.settingForm.valueChanges.subscribe(val => {
            this.disableButton = false;
        });
    }

    getSettings = (key: string): string => {
        const stateValue = this.settings.findIndex(x => x.appKey === key);
        return this.settings[stateValue].appValue;
    }

    setSettings = (key: string, value: string): void => {
        const index = this.settings.findIndex(x => x.appKey === key);
        if (index === -1) {
            // this.settings.push(obj);
        } else {
            this.settings[index].appValue = value;
        }
    }

    onChangeCountry(countryValue) {
        this.countrySelected = countryValue;
    }

    saveSetting(): void {
        this.disableButton = true;
        const data = this.settingForm.getRawValue();
        let phoneNumber = this.countrySelected.dial_code + data.ADMINPHONE;

        this.setSettings('GYMBILLINGCOST', data.GYMBILLINGCOST);
        this.setSettings('GYMCOMMISSION', data.GYMCOMMISSION);
        this.setSettings('CANCELLATION', data.CANCELLATION);
        this.setSettings('ADMINEMAIL', data.ADMINEMAIL);
        this.setSettings('ADMINPASSWORD', data.ADMINPASSWORD);
        this.setSettings('ADMINPHONE', phoneNumber);

        this._settingService.addItem(this.settings)
            .then(() => {
                // Trigger the subscription with new data
                // this._settingService.onItemsChanged.next(data);

                // Show the success message
                this._matSnackBar.open('Settings are changed successfully', 'Ok', {
                    verticalPosition: 'bottom',
                    duration: 3000
                });
            })
            .catch(err => {
                this._matSnackBar.open('Unable to update settings', 'Ok', {
                    verticalPosition: 'bottom',
                    duration: 3000
                });
                this.disableButton = false;
            })
    }

    addSetting(): void {
        const data = this.settingForm.getRawValue();

        this.setSettings('GYMBILLINGCOST', data.GYMBILLINGCOST);
        this.setSettings('GYMCOMMISSION', data.GYMCOMMISSION);
        this.setSettings('CANCELLATION', data.CANCELLATION);
        this.setSettings('ADMINEMAIL', data.ADMINEMAIL);
        this.setSettings('ADMINPASSWORD', data.ADMINPASSWORD);
        this.setSettings('ADMINPHONE', data.ADMINPHONE);

        this._settingService.addItem(this.settings)
            .then(() => {
                // Trigger the subscription with new data
                // this._settingService.onItemChanged.next(data);

                // Show the success message
                this._matSnackBar.open('Settings are changed successfully', 'Ok', {
                    verticalPosition: 'bottom',
                    duration: 3000
                });
            })
            .catch(err => {
                this._matSnackBar.open('Unable to update settings', 'Ok', {
                    verticalPosition: 'bottom',
                    duration: 3000
                });
            })
    }

}
