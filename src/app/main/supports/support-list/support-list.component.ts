import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MatDialogRef, MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { Subject } from 'rxjs';
import { SupportService } from '../support.service';
import { takeUntil } from 'rxjs/operators';
import { SupportReplyComponent } from '../support-reply/support-reply.component';

export interface supportsSort {
  name: string;
}

@Component({
  selector: 'support-list',
  templateUrl: './support-list.component.html',
  styleUrls: ['./support-list.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})

export class SupportListComponent implements OnInit {

  dialogRef: any;
  displayedColumns: string[] = ['name', 'active'];
  // dataSource: MatTableDataSource<Support>;

  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort;

  adminLimit: number = 20;
  userLimit: number = 20;
  skip: number = 0;
  adminTotalLength: number = 0;
  userTotalLength: number = 0;
  pageIndex: number = 0;
  pageLimit: number[] = [5, 10, 25, 100];

  // User data
  userSelected: number = -1;
  userReports: any = [];
  userMessage: string = '';
  userSubject: string = '';
  userReportDate: any;
  userEmail: string = '';
  userTag: string = '';

  // Admin data
  adminSelected: number = -1;
  adminReports: any = [];
  adminMessage: string = '';
  adminSubject: string = '';
  adminReportDate: any;
  adminEmail: string = '';
  adminTag: string = '';

  // Private
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _supportService: SupportService,
    public _matDialog: MatDialog,
    private _matSnackBar: MatSnackBar
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    // Subscribe to update Items on changes
    this._supportService.onPagedAdminReportsChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(reports => {
        this.adminReports = reports;
        if (this.adminReports && this.adminReports.content) {
          // this.adminReports.content.reverse();
        }
        if (this._supportService.pagedAdminReports) {
          this.adminTotalLength = this._supportService.pagedAdminReports.totalElements;
          this.adminLimit = this._supportService.pagedAdminReports.size;
          this.pageIndex = this._supportService.pagedAdminReports.number;
          this.adminReports.sort = this.sort;
        }
        if (this.adminReports.content) {
          // this.selectedAdmin()
        }
      });

    this._supportService.onPagedUserReportsChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(reports => {
        this.userReports = reports;
        if (this.userReports && this.userReports.content) {
          // this.userReports.content.reverse();
        }
        if (this._supportService.pagedAdminReports) {
          this.userTotalLength = this._supportService.pagedUserReports.totalElements;
          this.userLimit = this._supportService.pagedUserReports.size;
          this.pageIndex = this._supportService.pagedUserReports.number;
          this.adminReports.sort = this.sort;
        }
        if (this.adminReports.content) {
          // this.selectedUser()
        }
      });
  }

  applyFilter(filterValue: string) {
    this.adminReports.filter = filterValue.trim().toLowerCase();
  }

  changeAdminPage(event) {
    this._supportService.getPagedAdminReports(event.pageIndex, event.pageSize)
      .then(res => {
        this.adminReports = res;
        if (this.adminReports.content) {
          this.selectedAdmin()
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  changeUserPage(event) {
    this._supportService.getPagedUserReports(event.pageIndex, event.pageSize)
      .then(res => {
        this.userReports = res;
        if (this.userReports.content) {
          this.selectedUser()
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  selectedAdmin(index?: number) {
    if (index) {
      this.adminMessage = this.adminReports.content[index].message;
      this.adminSubject = this.adminReports.content[index].subject;
      this.adminTag = this.adminReports.content[index].tag;
      let d = new Date(this.adminReports.content[index].createdAt);
      this.adminReportDate = d.toDateString();
      this.adminSelected = index;
      this.adminEmail = this.adminReports.content[index].userFromObj.email;
    }
    else {
      this.adminMessage = this.adminReports.content[0].message;
      this.adminSubject = this.adminReports.content[index].subject;
      this.adminTag = this.adminReports.content[0].tag;
      let d = new Date(this.adminReports.content[0].createdAt);
      this.adminReportDate = d.toDateString();
      this.adminSelected = 0;
      this.adminEmail = this.adminReports.content[0].userFromObj.email;
    }
  }

  selectedUser(index?: number) {
    if (index) {
      this.userMessage = this.userReports.content[index].message;
      this.userSubject = this.userReports.content[index].subject;
      this.userTag = this.userReports.content[index].tag;
      this.userEmail = this.userReports.content[index].userFromObj.email;
      let d = new Date(this.userReports.content[index].createdAt);
      this.userReportDate = d.toDateString();
      this.userSelected = index;
    }
    else {
      this.userMessage = this.userReports.content[0].message;
      this.userSubject = this.userReports.content[0].subject;
      this.userTag = this.userReports.content[0].tag;
      this.userEmail = this.userReports.content[0].userFromObj.email;
      let d = new Date(this.userReports.content[0].createdAt);
      this.userReportDate = d.toDateString();
      this.userSelected = 0;
    }
  }

  adminReply() {
    this.dialogRef = this._matDialog.open(SupportReplyComponent, {
      panelClass: '',
      data: {
        reportId: this.adminReports.content[this.adminSelected].id,
        reportSubject: this.adminReports.content[this.adminSelected]
      }
    });

    this.dialogRef.afterClosed()
      .subscribe(response => {
        if (!response) {
          return;
        }
      });
  }

  userReply() {
    this.dialogRef = this._matDialog.open(SupportReplyComponent, {
      panelClass: '',
      data: {
        reportId: this.userReports.content[this.userSelected].id,
        reportSubject: this.userReports.content[this.userSelected]
      }
    });

    this.dialogRef.afterClosed()
      .subscribe(response => {
        if (!response) {
          return;
        }
      });
  }
}