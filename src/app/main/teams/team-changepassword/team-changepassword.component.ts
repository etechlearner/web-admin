import { Component, OnInit } from '@angular/core';
import { Team } from '../team.model';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { TeamService } from '../team.service';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-team-changepassword',
  templateUrl: './team-changepassword.component.html',
  styleUrls: ['./team-changepassword.component.scss'],
  animations: fuseAnimations
})
export class TeamChangepasswordComponent implements OnInit {
  team: Team;
  pageType: string;
  teamForm: FormGroup;
  package_id: string;

  // Private
  private _unsubscribeAll: Subject<any>;
  private memberId: string;
  toppings = new FormControl();

  constructor(
    private _teamService: TeamService,
    private _formBuilder: FormBuilder,
    private _matSnackBar: MatSnackBar,
    private _router: Router,
    private route: ActivatedRoute
  ) {
    this.team = new Team();
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    // Subscribe to update product on changes
    this._teamService.onItemChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(team => {
        if (team) {
          this.team = new Team(team);
          this.pageType = 'edit';
        }
        else {
          this.pageType = 'new';
          this.team = new Team();
        }
        this.teamForm = this.createTeamForm();
      });
    this.memberId = this.route.snapshot.paramMap.get('id');
  }

  ngOnDestroy = (): void => {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  createTeamForm(): FormGroup {
    return this._formBuilder.group({
      oldPassword: ['', [Validators.required]],
      password: ['', [Validators.minLength(8), Validators.pattern("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[-_!?/<>;:{}()*@#$%^&+=])(?=\\S+$).{8,}$")]],
      confirmPassword: ['', [Validators.required, confirmPasswordValidator]]
    });

  }

  addTeam(): void {
    const data = this.teamForm.getRawValue();
    // data.handle = FuseUtils.handleize(data.name);
    this._teamService.addItem(data)
      .then(() => {
        // Trigger the subscription with new data
        this._teamService.onItemChanged.next(data);
        // Show the success message
        this._matSnackBar.open('Record added', 'OK', {
          verticalPosition: 'bottom',
          duration: 2000
        });

        // Change the location with new one
        this._router.navigate(['/teams']);
      });
  }

  changePassword() {
    const data = this.teamForm.getRawValue();
    data.authId = this.memberId;
    this._teamService.updateMemberPassword(data)
      .then((res: any) => {
        if (res.err && res.err.message) {
          this._matSnackBar.open(res.err.message, 'OK', {
            verticalPosition: 'bottom',
            duration: 3000
          });
          return
        }
        // Show the success message
        this._matSnackBar.open('Updated', 'OK', {
          verticalPosition: 'bottom',
          duration: 3000
        });

        // Change the location with new one
        this._router.navigate(['/teams']);
      })
      .catch(err => {
        console.log(err)
        this._matSnackBar.open(err.error ? err.error.message : 'Unable to update', 'OK', {
          verticalPosition: 'bottom',
          duration: 3000
        });
      })
  }

}

export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.parent || !control) {
    return null;
  }

  const password = control.parent.get('password');
  const passwordConfirm = control.parent.get('passwordConfirm');

  if (!password || !passwordConfirm) {
    return null;
  }

  if (passwordConfirm.value === '') {
    return null;
  }

  if (password.value === passwordConfirm.value) {
    return null;
  }

  return { 'passwordsNotMatching': true };
};
