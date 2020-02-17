import { Component, OnInit } from '@angular/core';
import { GymService } from '../gym.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { Gym } from '../gym.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { Location } from '@angular/common';

@Component({
  selector: 'app-gym-edit-subscription',
  templateUrl: './gym-edit-subscription.component.html',
  styleUrls: ['./gym-edit-subscription.component.scss'],
  animations: fuseAnimations

})
export class GymEditSubscriptionComponent implements OnInit {

  gym: Gym;
  pageType: string;
  gymForm: FormGroup;

  // Private
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _gymService: GymService,
    private _formBuilder: FormBuilder,
    private _matSnackBar: MatSnackBar,
    private _router: Router,
    private location: Location
  ) {
    // Set the default
    this.gym = new Gym();
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    // Subscribe to update product on changes
    this._gymService.onItemChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(gym => {
        if (gym) {
          this.gym = new Gym(gym);
          this.pageType = 'edit';
        }
        else {
          this.pageType = 'new';
          this.gym = new Gym();
        }
        this.gymForm = this.createGymForm();
      });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  createGymForm(): FormGroup {
      return this._formBuilder.group({
        gymId: [this.gym.id],
        isSubmmit: ['yes', [Validators.required]],
        billingCost: [this.gym.billingCost, [Validators.required, Validators.max(999999), Validators.min(0)]],
        commission: [this.gym.commission, [Validators.required, Validators.max(100), Validators.min(0)]],
        });
  }

  saveGym(): void {
    const data = this.gymForm.getRawValue();
    this.gymForm.controls['isSubmmit'].setValue(null); 
    this._gymService.updateCommissionItem(data)
      .then(() => {
        // Trigger the subscription with new data
        this._gymService.onItemChanged.next(data);

        // Show the success message
        this._matSnackBar.open('Record saved', 'OK', {
          verticalPosition: 'bottom',
          duration: 3000
        });
        this._router.navigate(['/gyms']);
      });
  }

  showNotify(message) {
    // Show the success message
    this._matSnackBar.open(message, 'OK', {
      verticalPosition: 'bottom',
      duration: 3000
    });
  }

  goBack() {
    this.location.back()
  }

}
