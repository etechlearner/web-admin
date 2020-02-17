import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { Gym } from '../gym.model';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { Subject } from 'rxjs';
import { GymService } from '../gym.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { FuseUtils } from '@fuse/utils';
import { fuseAnimations } from '@fuse/animations';
import { CountryCode } from '../country.code';
import { Gymuser } from '../gymuser.model';
import { GymCreate } from 'app/main/custom-request/gymCreate.request';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

const BASE_URL = environment.baseUrl;

@Component({
    selector: 'app-gym',
    templateUrl: './gym.component.html',
    styleUrls: ['./gym.component.scss'],
    animations: fuseAnimations
})
export class GymComponent implements OnInit, OnDestroy {

    gym: Gym;
    pageType: string;
    gymForm: FormGroup;
    stateInfo: any[] = [];
    countryInfo: any[] = new CountryCode().data;
    cityInfo: any[] = [];
    gymUser: Gymuser;
    countrySelected: any;
    stateSelected: any;
    public reenableButton = new EventEmitter<boolean>(false);
    toppings = new FormControl();

    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _gymService: GymService,
        private _formBuilder: FormBuilder,
        private _matSnackBar: MatSnackBar,
        private _router: Router,
        private http: HttpClient
    ) {
        // Set the default
        this.gym = new Gym();
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.countrySelected = this.countryInfo[0];
    }

    ngOnInit(): void {
        // Subscribe to update product on changes
        this._gymService.onItemChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(gym => {
                if (gym.id !== undefined) {
                    this.gym = new Gym(gym);
                    this.pageType = 'edit';
                } else {
                    this.pageType = 'new';
                    this.gym = new Gym();
                }
                this.gymForm = this.createGymForm();
                // this.gymForm.controls['email'].setErrors({notUnique: true});
            });

        this._gymService.getUserById().then((createdGym: Gymuser) => {
            this.gymUser = new Gymuser(createdGym);
        }).catch((err) => {
            // this.gymForm.controls['isSubmmit'].setValue('done');
            console.log(err);
        });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    createGymForm(): FormGroup {
        return this._formBuilder.group({
            id: [this.gym.id],
            name: [this.gym.name, [Validators.required, Validators.minLength(3), Validators.maxLength(25), nameValidator]],
            nfcTag: [this.gym.nfcTag, [Validators.required]],
            isoCode: [this.getCountry(this.gym.isoCode), [Validators.required]],
            state: [this.getState(this.gym.state), [Validators.required]],
            handle: [this.gym.handle],
            isActive: [this.gym.isActive],
            stepsCompleted: ['STEP1'],
            emailAddress: [this.gym.emailAddress ? this.gym.emailAddress : '', [Validators.required, Validators.email]],
            phone: [this.gym.phone ? this.gym.phone : '', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9 ]*')]]
        });
    }

    saveGym(): void {
        const data = this.gymForm.getRawValue();
        data.handle = FuseUtils.handleize(data.name);
        const dial_code = this.gymForm.get('isoCode').value.code;
        const state = this.gymForm.get('state').value.StateName;
        data.state = state;
        data.isoCode = dial_code;
        this.reenableButton.emit(true);
        this._gymService.saveItem(data)
            .then(() => {
                // Trigger the subscription with new data
                this._gymService.onItemChanged.next(data);
                this.reenableButton.emit(false);

                // Show the success message
                this._matSnackBar.open('Record saved', 'OK', {
                    verticalPosition: 'bottom',
                    duration: 3000
                });
                this._router.navigate(['/gyms']);
            }).catch((err) => {
                this.reenableButton.emit(false);
                const validationErrors = err.error.errors;
                Object.keys(validationErrors).forEach(prop => {
                    const nameObj = validationErrors[prop];
                    // tslint:disable-next-line: typedef
                    Object.keys(nameObj).forEach(key => {
                        this.showNotify(nameObj[key]);
                        this.gymForm.get(key).setErrors(nameObj);
                        console.log(key + ': ' + nameObj[key]);
                    });
                });
                this.showNotify('Gym Not Created!');
            });
    }

    addGym(): void {
        const data = this.gymForm.getRawValue();
        data.handle = FuseUtils.handleize(data.name);
        const dial_code = this.gymForm.get('isoCode').value.dial_code;
        const state = this.gymForm.get('state').value.StateName;
        data.state = state;
        data.isoCode = dial_code;
        data.rating = 0;
        this.getParentGymId()
            .then((res) => {
                data.parentGymId = res;
                this.reenableButton.emit(true);
                this._gymService.createGym(new GymCreate({ gym: data, gymUser: this.gymUser }))
                    .then((createdGym: Gym) => {
                        this.showNotify('Record saved!');
                        this._router.navigate(['/gyms']);
                    }).catch((err) => {
                        this.reenableButton.emit(false);
                        const validationErrors = err.error.errors;
                        Object.keys(validationErrors).forEach(prop => {
                            const nameObj = validationErrors[prop];
                            // tslint:disable-next-line: typedef
                            Object.keys(nameObj).forEach(key => {
                                this.showNotify(nameObj[key]);
                                this.gymForm.get(key).setErrors(nameObj);
                                console.log(key + ': ' + nameObj[key]);
                            });
                        });
                        this.showNotify('Gym Not Created!');
                    });
            })
    }

    getParentGymId() {
        return new Promise((resolve, reject) => {
            this.http.get(`${BASE_URL}/api/accountservice/v1/auth/whoami`)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        })
            .then((myProfile: any) => {
                return new Promise((resolve, reject) => {
                    this.http.get(`${BASE_URL}/api/appservice/v1/gym/findGymByOwner/${myProfile.authId}`)
                        .subscribe((response: any) => {
                            resolve(response.id);
                        }, reject);
                })
            })
    }

    /* To copy Text from Textbox */
    copyInputMessage = (inputElement): void => {
        inputElement.select();
        document.execCommand('copy');
        inputElement.setSelectionRange(0, 0);
    }

    genNfc(): void {
        this.gymForm.controls['nfcTag'].setValue(FuseUtils.generatorUUID());
    }

    showNotify(message): void {
        // Show the success message
        this._matSnackBar.open(message, 'OK', {
            verticalPosition: 'bottom',
            duration: 3000
        });
    }

    onChangeCountry = (item: any): void => {
        const countryValue = this.countryInfo.findIndex(x => x === item);
        this.countrySelected = this.countryInfo[countryValue];
        this.stateInfo = this.countryInfo[countryValue].States;
        this.cityInfo = this.stateInfo[0].Cities;
    }

    onChangeState = (item: any): void => {
        const stateValue = this.stateInfo.findIndex(x => x === item);
        this.stateSelected = this.stateInfo[stateValue];
        this.cityInfo = this.stateInfo[stateValue].Cities;
    }

    getCountry = (item: string): void => {
        const countryValue = this.countryInfo.findIndex(x => x.code === item);

        // @ts-ignore
        if (item !== '' && countryValue !== -1) {
            this.stateInfo = this.countryInfo[countryValue].States;
        }
        return this.countryInfo[countryValue];
    }

    getState = (item: string): void => {
        const stateValue = this.stateInfo.findIndex(x => x.StateName === item);
        return this.stateInfo[stateValue];
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