import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MatDialogRef, MatPaginator, MatSort, MatDialog, MatSnackBar, MatTableDataSource } from '@angular/material';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { Subject, fromEvent, BehaviorSubject, Observable, merge } from 'rxjs';
import { AuthorizationService } from '../authorization.service';
import { takeUntil, debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { Authorization } from '../authorization.model';

export interface authorizationsSort {
   name: string;
}


@Component({
  selector: 'authorization-list',
  templateUrl: './authorization-list.component.html',
  styleUrls: ['./authorization-list.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class AuthorizationListComponent implements OnInit {

    displayedColumns: string[] = ['name', 'active'];
    dataSource: MatTableDataSource<Authorization>;

  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

@ViewChild(MatPaginator) paginator: MatPaginator;
@ViewChild(MatSort) sort: MatSort;

  limit:number = 20;
  skip:number = 0;
  totalLength:number = 0;
  pageIndex : number = 0;
  pageLimit:number[] = [5, 10, 25, 100] ; 

  // Private
  private _unsubscribeAll: Subject<any>;
 /**
   * Constructor
   *
   * @param {AuthorizationService} _authorizationService
   * @param {MatDialog} _matDialog
   * @param {MatSnackBar} _matSnackBar
   */
  constructor(
      private _authorizationService: AuthorizationService,
      public _matDialog: MatDialog,
      private _matSnackBar: MatSnackBar


  ) {
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

        // Subscribe to update Items on changes
    this._authorizationService.onPageItemChanged
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(authorizationPage => {

         // Assign the data to the data source for the table to render
         this.dataSource = new MatTableDataSource(this._authorizationService.pageItem.content);
         this.totalLength =  this._authorizationService.pageItem.totalElements;
         this.limit = this._authorizationService.pageItem.size;
         this.pageIndex = this._authorizationService.pageItem.number;
         this.dataSource.sort = this.sort;

    });
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  changePage(event){
    console.log('event',event)
          this._authorizationService.getPageItem(event.pageIndex,event.pageSize);

  }

  /**
 * Delete Contact
 */
  deleteAuthorization(authorization): void {
      console.log(authorization);
      this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
          disableClose: false
      });

      this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

      this.confirmDialogRef.afterClosed().subscribe(result => {
          if (result) {

              this._authorizationService.deleteItemById(authorization.id).subscribe((response: any)  => {
                  // Show the success message
                  this._matSnackBar.open('Record Deleted', 'OK', {
                      verticalPosition: 'bottom',
                      duration: 3000
                  });
                  this._authorizationService.getItems();
              });
          }
          this.confirmDialogRef = null;
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

}