import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MatDialogRef, MatPaginator, MatSort, MatDialog, MatSnackBar, MatTableDataSource } from '@angular/material';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { Subject } from 'rxjs';
import { AminityService } from '../aminity.service';
import { takeUntil } from 'rxjs/operators';

import { Aminity } from '../aminity.model';

// tslint:disable-next-line:class-name
export interface aminitysSort {
  name: string;
}

@Component({
  selector: 'aminity-list',
  templateUrl: './aminity-list.component.html',
  styleUrls: ['./aminity-list.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class AminityListComponent implements OnInit {

  displayedColumns: string[] = ['image', 'name', 'active'];
  dataSource: MatTableDataSource<Aminity>;

  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  limit: number = 20;
  skip: number = 0;
  totalLength: number = 0;
  pageIndex: number = 0;
  pageLimit: number[] = [5, 10, 25, 100];

  // Private
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _aminityService: AminityService,
    public _matDialog: MatDialog,
    private _matSnackBar: MatSnackBar


  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    // Subscribe to update Items on changes
    this._aminityService.onPageItemChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(aminityPage => {

        // Assign the data to the data source for the table to render
        // console.log(this._aminityService.pageItem.content);
        this.dataSource = new MatTableDataSource(this._aminityService.pageItem.content);
        this.totalLength = this._aminityService.pageItem.totalElements;
        this.limit = this._aminityService.pageItem.size;
        this.pageIndex = this._aminityService.pageItem.number;
        this.dataSource.sort = this.sort;
      });
      console.log(this._aminityService.pageItem.content)
  }

  applyFilter = (filterValue: string): void => {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  changePage = (event): void => {
    // console.log('event', event)
    this._aminityService.getPageItem(event.pageIndex, event.pageSize);
  }

  deleteAminity(aminity): void {
    console.log(aminity);
    this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });
    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._aminityService.deleteItemById(aminity.id).subscribe((response: any) => {
          // Show the success message
          this._matSnackBar.open('Record Deleted', 'OK', {
            verticalPosition: 'bottom',
            duration: 3000
          });
          this._aminityService.getPageItem(this.pageIndex, this.totalLength);
        });
      }
      this.confirmDialogRef = null;
    });

  }

  ngOnDestroy = (): void => {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
