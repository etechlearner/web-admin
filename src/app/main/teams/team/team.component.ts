import { Component, OnInit } from '@angular/core';
import { Team } from '../team.model';
import { FormGroup, FormBuilder, Validators, FormControl, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Subject } from 'rxjs';
import { TeamService } from '../team.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { FuseUtils } from '@fuse/utils';
import { fuseAnimations } from '@fuse/animations';
import { CountryCode } from 'app/main/gyms/country.code';
import { Role } from '../role.enum';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
  animations: fuseAnimations
})
export class TeamComponent implements OnInit {
  team: Team;
  pageType: string;
  teamForm: FormGroup;
  roles = [
    {
      name: 'Customer Care',
      value: Role.GFCUSTOMERCARE
    },
    {
      name: 'Finance',
      value: Role.GFFINANCE
    },
    {
      name: 'On-Boarding',
      value: Role.GFONBOARDING
    },
    {
      name: 'Sales',
      value: Role.GFSALES
    },
  ]
  package_id: string;
  private _unsubscribeAll: Subject<any>;
  toppings = new FormControl();
  countrySelected: any;
  countryInfo: any[] = new CountryCode().data;
  roleSelected: any;
  teamMember: any;
  env: any;

  constructor(
    private _teamService: TeamService,
    private _formBuilder: FormBuilder,
    private _matSnackBar: MatSnackBar,
    private _router: Router
  ) {
    this.team = new Team();
    this._unsubscribeAll = new Subject();
    this.countrySelected = this.countryInfo[0];
  }

  ngOnInit(): void {
    this._teamService.onItemChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(team => {
        if (team) {
          this.teamMember = team;
          this.team = new Team(team);
          this.pageType = 'edit';
          this.teamForm = this.createTeamForm(team);
        }
        else {
          this.pageType = 'new';
          this.team = new Team();
          this.teamForm = this.createTeamForm();
        }
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  createTeamForm(teamMember?): FormGroup {
    if (teamMember) {
      return this._formBuilder.group({
        id: [],
        name: [teamMember.name ? teamMember.name : '', [Validators.required, Validators.minLength(3), Validators.maxLength(25), nameValidator]],
        phone: [teamMember.phone ? teamMember.phone : '', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
        email: [teamMember.email ? teamMember.email : '', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[-_!?/<>;:{}()*@#$%^&+=])(?=\\S+$).{8,}$')]],
        isoCode: [teamMember.isoCode ? teamMember.isoCode : '', [Validators.required]],
        role: [teamMember.userRole ? teamMember.userRole : [], [Validators.required]],
        designation: [teamMember.designation ? teamMember.designation : '', [Validators.required, Validators.minLength(3), Validators.maxLength(25), nameValidator]],
      });
    } else {
      return this._formBuilder.group({
        id: [],
        name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25), nameValidator, Validators.pattern('[a-zA-Z][a-zA-Z ]+')]],
        phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[-_!?/<>;:{}()*@#$%^&+=])(?=\\S+$).{8,}$')]],
        isoCode: ['', [Validators.required]],
        role: [[''], [Validators.required]],
        designation: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25), nameValidator]],
      });
    }
  }

  onChangeCountry(countryValue) {
    this.countrySelected = countryValue;
  }

  onChangeRole(roleValue) {
    this.roleSelected = roleValue;
  }

  addTeam(): void {
    const data = this.teamForm.getRawValue();
    data.handle = FuseUtils.handleize(data.name);
    data.userRole = [];
    this.roleSelected.forEach(role => {
      data.userRole.push({
        name: role
      })
    });
    data.isoCode = this.countrySelected.dial_code;
    delete data.role;
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
      })
      .catch(err => {
        console.log(err)
        this._matSnackBar.open(err.error ? err.error.message : "Unable to create member", "Ok", {
          duration: 3000,
          verticalPosition: "bottom"
        })
      })
  }

  updateTeamMember() {
    let updatedUser = this.teamForm.getRawValue();
    this.teamMember.userRole = [];
    this.roleSelected.forEach(role => {
      this.teamMember.userRole.push({
        name: role
      })
    });
    updatedUser.isoCode = updatedUser.isoCode.code;
    this.teamMember.name = updatedUser.name;
    this.teamMember.phone = updatedUser.phone;
    this.teamMember.designation = updatedUser.designation;
    this._teamService.updateTeamMember(this.teamMember)
      .then((res: any) => {
        this._matSnackBar.open("Updated successfully", "Ok", {
          duration: 3000
        })
        this._router.navigateByUrl("/teams");
      })
      .catch(err => {
        console.log(err)
        this._matSnackBar.open("Unable to update", "Ok", {
          duration: 3000
        })
      })
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