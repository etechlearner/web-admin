import { Component, EventEmitter, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { Gymuser } from '../../gyms/gymuser.model';
import { CountryCode } from '../../gyms/country.code';
import { GymService } from '../../gyms/gym.service';
import { FuseUtils } from '../../../../@fuse/utils';
import { GymCreate } from '../../custom-request/gymCreate.request';
import { Gym } from '../../gyms/gym.model';
import { Router } from '@angular/router';

@Component({
    selector: 'app-userbyrole-form-dialog',
    templateUrl: './userbyrole-form.component.html',
    styleUrls: ['./userbyrole-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class UserbyroleFormDialogComponent {
    action: string;
    contact: Gymuser;
    userbyroleForm: FormGroup;
    dialogTitle: string;
    stateInfo: any[] = [];
    countryInfo: any[] = new CountryCode().data;
    cityInfo: any[] = [];
    countrySelected: any;
    stateSelected: any;

    public reenableButton = new EventEmitter<boolean>(false);

    // after complete  use  this.reenableButton.emit(false);

    constructor(
        public matDialogRef: MatDialogRef<UserbyroleFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _gymService: GymService,
        private _router: Router,
        private _matSnackBar: MatSnackBar,
    ) {
        // Set the defaults
        this.action = _data.action;

        if (this.action === 'edit') {
            this.dialogTitle = 'Edit User';
            this.contact = new Gymuser({});
            // _data.contact;
        } else {
            this.dialogTitle = 'New User';
            this.contact = new Gymuser({});
        }
        this.countrySelected = this.countryInfo[0];

        this.userbyroleForm = this.createUserbyroleForm();
    }

    createUserbyroleForm = (): FormGroup => {
        return this._formBuilder.group({
            id: [],
            name: [this.contact.name, [Validators.required, Validators.minLength(3), Validators.maxLength(25), nameValidator]],
            phone: [this.contact.phone, [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9 ]*')]],
            email: [this.contact.email, [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[-_!?/<>;:{}()*@#$%^&+=])(?=\\S+$).{8,}$')]],
            isoCode: [this.contact.isoCode, [Validators.required]]

        });
    }

    onChangeCountry = (countryValue): void => {
        this.countrySelected = this.countryInfo[countryValue];
        this.stateInfo = this.countryInfo[countryValue].States;
        this.cityInfo = this.stateInfo[0].Cities;
        console.log(this.cityInfo);
    }

    addGymOwner = (): void => {
        this.reenableButton.emit(true);
        const data = this.userbyroleForm.getRawValue();
        data.handle = FuseUtils.handleize(data.name);
        data.isoCode = this.countrySelected.dial_code;
        this._gymService.createGymUser(data).then((responseUser: Gymuser) => {
            this.showNotify('Record saved!');
            this.matDialogRef.close(['save', responseUser]);
        }).catch((err) => {
            this.reenableButton.emit(false);
            const validationErrors = err.error.errors;
            Object.keys(validationErrors).forEach(prop => {
                const nameObj = validationErrors[prop];
                Object.keys(nameObj).forEach(key => {
                    this.showNotify(nameObj[key]);
                    this.userbyroleForm.get(key).setErrors(nameObj);
                    console.log(key + ': ' + nameObj[key]);
                });
            });
        });
    }

    showNotify = (message): void => {
        // Show the success message
        this._matSnackBar.open(message, 'OK', {
            verticalPosition: 'bottom',
            duration: 2000
        });
    }

}

export const nameValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    if (!control.parent || !control) {
        return null;
    }

    let name = control.parent.get('name').value;

    if (name.trim()) {
        return null;
    }

    return { 'blankName': true };
};