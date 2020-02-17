import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from '../subscription.model';
import {FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors, FormControl} from '@angular/forms';
import {Observable, Subject} from 'rxjs';
import {SubscriptionService} from '../subscription.service';
import {MatSnackBar} from '@angular/material';
import {Router} from '@angular/router';
import {startWith, map, takeUntil} from 'rxjs/operators';
import {FuseUtils} from '@fuse/utils';
import {fuseAnimations} from '@fuse/animations';

@Component({
    selector: 'app-subscription',
    templateUrl: './subscription.component.html',
    styleUrls: ['./subscription.component.scss'],
    animations: fuseAnimations
})
export class SubscriptionComponent implements OnInit, OnDestroy {
    subscription: Subscription;
    pageType: string;
    subscriptionForm: FormGroup;

    // myControl = new FormControl();
    package_id: string;
    offertype: string[] = ['type1', 'type2'];

    // Private
    private _unsubscribeAll: Subject<any>;
    toppings = new FormControl();

    env: any;

    /**
     * Constructor
     *
     * @Param {SubscriptionService} _subscriptionService
     * @Param {FormBuilder} _formBuilder
     * @Param {MatSnackBar} _matSnackBar,
     *
     */
    constructor(
        private _subscriptionService: SubscriptionService,
        private _formBuilder: FormBuilder,
        private _matSnackBar: MatSnackBar,
        private _router: Router
    ) {
        // Set the default
        this.subscription = new Subscription();
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
        this._subscriptionService.onItemChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(subscription => {

                if (subscription) {
                    this.subscription = new Subscription(subscription);
                    this.pageType = 'edit';
                } else {
                    this.pageType = 'new';
                    this.subscription = new Subscription();
                }
                this.subscriptionForm = this.createSubscriptionForm();


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
     * Create subscription form
     *
     * @Returns {FormGroup}
     */
    createSubscriptionForm(): FormGroup {

        return this._formBuilder.group({
            type: [this.subscription.type],
            duration: [this.subscription.duration],
            name: [this.subscription.name],
            isFree: [this.subscription.isFree],
            handle: [this.subscription.handle],
        });

    }

    /**
     * Save subscription
     */
    saveSubscription(): void {
        const data = this.subscriptionForm.getRawValue();
        data.handle = FuseUtils.handleize(data.name);

        this._subscriptionService.saveItem(data)
            .then(() => {

                // Trigger the subscription with new data
                this._subscriptionService.onItemChanged.next(data);

                // Show the success message
                this._matSnackBar.open('Record saved', 'OK', {
                    verticalPosition: 'bottom',
                    duration: 2000
                });
                this._router.navigate(['/subscriptions']);
            });
    }

    /**
     * Add subscription
     */
    addSubscription(): void {
        const data = this.subscriptionForm.getRawValue();
        data.handle = FuseUtils.handleize(data.name);


        this._subscriptionService.addItem(data)
            .then(() => {

                // Trigger the subscription with new data
                this._subscriptionService.onItemChanged.next(data);
                // Show the success message
                this._matSnackBar.open('Record added', 'OK', {
                    verticalPosition: 'bottom',
                    duration: 2000
                });

                // Change the location with new one
                this._router.navigate(['/subscriptions']);
            });
    }

}
