import { Component, OnInit } from '@angular/core';
import { Authorization } from '../authorization.model';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { AuthorizationService } from '../authorization.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { startWith, map, takeUntil } from 'rxjs/operators';
import { FuseUtils } from '@fuse/utils';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.scss'],
  animations: fuseAnimations
})
export class AuthorizationComponent implements OnInit {
  authorization: Authorization;
  pageType: string;
  authorizationForm: FormGroup;
  
  // myControl = new FormControl();
  package_id: string;

  // Private
  private _unsubscribeAll: Subject<any>;
  toppings = new FormControl();
  
  env: any;

  /**
   * Constructor
   *
   * @param {AuthorizationService} _authorizationService
   * @param {FormBuilder} _formBuilder
   * @param {MatSnackBar} _matSnackBar,
   *
   */
  constructor(
    private _authorizationService: AuthorizationService,
    private _formBuilder: FormBuilder,
    private _matSnackBar: MatSnackBar,
    private _router: Router
  ) {
    // Set the default
    this.authorization = new Authorization();
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
    this._authorizationService.onItemChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(authorization => {

        if (authorization) {
          this.authorization = new Authorization(authorization);
          this.pageType = 'edit';
        }
        else {
          this.pageType = 'new';
          this.authorization = new Authorization();
        }
        this.authorizationForm = this.createAuthorizationForm();


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
   * Create authorization form
   *
   * @returns {FormGroup}
   */
  createAuthorizationForm(): FormGroup {
    
      return this._formBuilder.group({
        id: [this.authorization.id],
        name: [this.authorization.name,[Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
        handle: [this.authorization.handle],
      });
   
  }

  /**
   * Save authorization
   */
  saveAuthorization(): void {
    const data = this.authorizationForm.getRawValue();
    data.handle = FuseUtils.handleize(data.name);

    this._authorizationService.saveItem(data)
      .then(() => {

        // Trigger the subscription with new data
        this._authorizationService.onItemChanged.next(data);

        // Show the success message
        this._matSnackBar.open('Record saved', 'OK', {
          verticalPosition: 'bottom',
          duration: 3000
        });
        this._router.navigate(['/authorizations']);
      });
  }

  /**
   * Add authorization
   */
  addAuthorization(): void {
    const data = this.authorizationForm.getRawValue();
    data.handle = FuseUtils.handleize(data.name);

    

    this._authorizationService.sendItem(data)
      .then(() => {

        // Trigger the subscription with new data
        this._authorizationService.onItemChanged.next(data);
        // Show the success message
        this._matSnackBar.open('Record added', 'OK', {
          verticalPosition: 'bottom',
          duration: 3000
        });

        // Change the location with new one
        this._router.navigate(['/authorizations']);
      });
  }

}