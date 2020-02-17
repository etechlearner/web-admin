import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MatDialogRef, MatPaginator, MatSort, MatDialog, MatSnackBar, MatTableDataSource } from '@angular/material';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { Subject } from 'rxjs';
import { TeamService } from '../team.service';
import { takeUntil } from 'rxjs/operators';
import { Role } from '../role.enum';
import { Team } from '../team.model';
import { Router } from '@angular/router';

export interface teamsSort {
  name: string;
}

@Component({
  selector: 'team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class TeamListComponent implements OnInit {

  dialogRef: any;
  displayedColumns: string[] = [
    'name',
    'designation',
    // 'role',
    'finance',
    'sales',
    'support',
    'on-boarding',
    'other'
  ];
  role = Role;
  financeRoles = [];
  careRoles = [];
  onBoardingRoles = [];
  salesRoles = [];
  dataSource: MatTableDataSource<Team>;

  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  limit: number = 20;
  skip: number = 0;
  totalLength: number = 0;
  pageIndex: number = 0;
  pageLimit: number[] = [5, 10, 25, 100];

  private _unsubscribeAll: Subject<any>;

  constructor(
    private _teamService: TeamService,
    public _matDialog: MatDialog,
    private _matSnackBar: MatSnackBar,
    private router: Router
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {

    // Subscribe to update Items on changes
    this._teamService.onPageItemChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(teamPage => {

        // Assign the data to the data source for the table to render
        this.dataSource = new MatTableDataSource(this._teamService.pageItem.content);
        this.totalLength = this._teamService.pageItem.totalElements;
        this.limit = this._teamService.pageItem.size;
        this.pageIndex = this._teamService.pageItem.number;
        this.dataSource.sort = this.sort;

        // Set Role Permissions
        this.setFinancePermissionList();
        this.setCarePermissionList();
        this.setSalesPermissionList();
        this.setOnBoardingPermissionList();
      });
  }

  setFinancePermissionList() {
    this.financeRoles = [];
    this._teamService.pageItem.content.forEach(teamMember => {
      teamMember.userRole.forEach(role => {
        if (role.name === "GFFINANCE") {
          this.financeRoles.push(teamMember.authId);
        }
      })
    })
  }

  setOnBoardingPermissionList() {
    this.onBoardingRoles = [];
    this._teamService.pageItem.content.forEach(teamMember => {
      teamMember.userRole.forEach(role => {
        if (role.name === "GFONBOARDING") {
          this.onBoardingRoles.push(teamMember.authId);
        }
      })
    })
  }

  setCarePermissionList() {
    this.careRoles = [];
    this._teamService.pageItem.content.forEach(teamMember => {
      teamMember.userRole.forEach(role => {
        if (role.name === "GFCUSTOMERCARE") {
          this.careRoles.push(teamMember.authId);
        }
      })
    })
  }

  setSalesPermissionList() {
    this.salesRoles = [];
    this._teamService.pageItem.content.forEach(teamMember => {
      teamMember.userRole.forEach(role => {
        if (role.name === "GFSALES") {
          this.salesRoles.push(teamMember.authId);
        }
      })
    })
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  changePage(event) {
    this._teamService.getPageItem(event.pageIndex, event.pageSize);
  }

  deleteTeam(team): void {
    this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {

        this._teamService.deleteItemById(team.authId)
          .then((response: any) => {
            // Show the success message
            this._matSnackBar.open('Record Deleted', 'OK', {
              verticalPosition: 'bottom',
              duration: 3000
            });
            this._teamService.getInit();
          });
      }
      this.confirmDialogRef = null;
    }, err => {
      console.log(err)
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  editTeamMember(teamMember) {
    this.router.navigateByUrl(`/teams/edit/${teamMember.authId}`)
  }
}