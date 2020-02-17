import { Component, Inject, ViewChild, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSlideToggleChange, MatDialog, MatSnackBar } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';
import { GymService } from '../gym.service';
import { Gym } from '../gym.model';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gym-view',
  templateUrl: './gym-view.component.html',
  styleUrls: ['./gym-view.component.scss']
})
export class GymViewComponent {

  @Input() checked: Boolean;
  action: string;
  id: string;
  list: string[];
  offline: Boolean;
  gym: Gym;
  gymOwner;
  authId: any;
  activate = new FormControl();
  tags: any[];
  formType: string;
  todoForm: FormGroup;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  cannotActivate: boolean = true;

  @ViewChild('titleInput')
  titleInputField;

  constructor(
    public matDialogRef: MatDialogRef<GymViewComponent>,
    @Inject(MAT_DIALOG_DATA)
    private _data: any,
    private _gymService: GymService,
    public _matDialog: MatDialog,
    private _matSnackBar: MatSnackBar,
    private router: Router,
  ) {

    // Set the defaults
    if (_data.gym) {
      this.action = _data.action;
      this.id = _data.id;
      this.gym = _data.gym;
      this.offline = _data.gym.isActive;
      this.authId = _data.id
    }
    if (_data.gymOwner) {
      this.gymOwner = _data.gymOwner
    }
    if (
      this.gym &&
      this.gym.stepsCompleted &&
      this.gym.stepsCompleted.includes("STEP1") &&
      this.gym.stepsCompleted.includes("STEP2") &&
      this.gym.stepsCompleted.includes("STEP3") &&
      this.gym.stepsCompleted.includes("STEP4") &&
      this.gym.stepsCompleted.includes("STEP5")
    ) {
      this.cannotActivate = false;
    }

  }

  toggleStatus(ob: MatSlideToggleChange) {
    this._gymService.toggleGymStatus(this.gym.id)
      .then((res) => {
        this.offline = res.isActive;
        this._matSnackBar.open('Status updated', 'Ok', {
          verticalPosition: 'bottom',
          duration: 3000
        });
        this.matDialogRef.close({ isActive: res.isActive });
      })
      .catch(err => {
        console.log(err)
      })
  }

  goToFinance(gym) {
    this.router.navigateByUrl(`/finances/${gym.id}`);
    this.matDialogRef.close();
  }

  remove() {
    this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._gymService.deleteItemById(this.gymOwner.authId)
          .then((res: any) => {
            this._matSnackBar.open('Record Deleted', 'OK', {
              verticalPosition: 'bottom',
              duration: 3000
            });
            this._gymService.getItems();
          })
          .catch(err => {
            console.log(err)
            this._matSnackBar.open('Unable to remove record', 'OK', {
              verticalPosition: 'bottom',
              duration: 3000
            });
          })
      }
      this.confirmDialogRef = null;
    });
  }
}