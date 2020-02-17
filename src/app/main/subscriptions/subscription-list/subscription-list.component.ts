import {Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, OnDestroy} from '@angular/core';
import {fuseAnimations} from '@fuse/animations';
import {MatDialogRef, MatPaginator, MatSort, MatDialog, MatSnackBar, MatTableDataSource} from '@angular/material';
import {FuseConfirmDialogComponent} from '@fuse/components/confirm-dialog/confirm-dialog.component';
import {Subject, fromEvent, BehaviorSubject, Observable, merge} from 'rxjs';
import {SubscriptionService} from '../subscription.service';
import {takeUntil, debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import {Subscription} from '../subscription.model';

export interface SubscriptionsSort {
    name: string;
}

@Component({
    selector: 'subscription-list',
    templateUrl: './subscription-list.component.html',
    styleUrls: ['./subscription-list.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class SubscriptionListComponent implements OnInit, OnDestroy {
    displayedColumns: string[] = ['name', 'active'];
    dataSource: MatTableDataSource<Subscription>;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    limit = 20;
    skip = 0;
    totalLength = 0;
    pageIndex = 0;
    pageLimit: number[] = [5, 10, 25, 100];
    private _unsubscribeAll: Subject<any>;

    /** Constructor
     * @Param {SubscriptionService} _subscriptionService
     * @Param {MatDialog} _matDialog
     * @Param {MatSnackBar} _matSnackBar
     * */
    constructor(private _subscriptionService: SubscriptionService,
                public _matDialog: MatDialog,
                private _matSnackBar: MatSnackBar) {
        /* Set the private defaults*/
        this._unsubscribeAll = new Subject();
    }

    /**
     * On init
     * */
    ngOnInit(): void {/* Subscribe to update Items on changes*/
        this._subscriptionService.onPageItemChanged.pipe(
            takeUntil(this._unsubscribeAll)
            ).subscribe(subscriptionPage => {
           /* Assign the data to the data source for the table to render*/
            this.dataSource = new MatTableDataSource(this._subscriptionService.pageItem.content);
            this.totalLength = this._subscriptionService.pageItem.totalElements;
            this.limit = this._subscriptionService.pageItem.size;
            this.pageIndex = this._subscriptionService.pageItem.number;
            this.dataSource.sort = this.sort;
        });
    }

    applyFilter(filterValue: string): void {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    changePage(event): void {
        console.log('event', event);
        this._subscriptionService.getPageItem(event.pageIndex, event.pageSize);
    }

    /**
     *  Delete Contact
     * */
    deleteSubscription(subscription): void {
        console.log(subscription);
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {disableClose: false});
        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';
        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._subscriptionService.deleteItemById(subscription.id).subscribe((response: any) => {/* Show the success message*/
                    this._matSnackBar.open('Record Deleted', 'OK', {verticalPosition: 'top', duration: 3000});
                    this._subscriptionService.getItems();
                });
            }
            this.confirmDialogRef = null;
        });
    }

    /**
     * To Destory the state
     * */
    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
