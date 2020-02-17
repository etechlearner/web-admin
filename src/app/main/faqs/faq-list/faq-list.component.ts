import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MatDialogRef, MatPaginator, MatSort, MatDialog, MatSnackBar, MatTableDataSource } from '@angular/material';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { Subject, fromEvent, BehaviorSubject, Observable, merge } from 'rxjs';
import { FaqService } from '../faq.service';
import { takeUntil, debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { Faq } from '../faq.model';
import { FuseUtils } from '../../../../@fuse/utils';
import { FormControl } from '@angular/forms';

export interface FaqsSort {
    name: string;
}


@Component({
    selector: 'faq-list',
    templateUrl: './faq-list.component.html',
    styleUrls: ['./faq-list.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class FaqListComponent implements OnInit, OnDestroy {

    displayedColumns: string[] = ['name', 'active'];
    dataSource: MatTableDataSource<Faq>;

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    limit = 20;
    skip = 0;
    totalLength = 0;
    pageIndex = 0;
    pageLimit: number[] = [5, 10, 25, 100];

    faqs: any;
    faqsFiltered: any;
    step: number;
    searchInput: any;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @Param {FaqService} _faqService
     * @Param {MatDialog} _matDialog
     * @Param {MatSnackBar} _matSnackBar
     */
    constructor(
        private _faqService: FaqService,
        public _matDialog: MatDialog,
        private _matSnackBar: MatSnackBar
    ) {
        // Set the defaults
        this.searchInput = new FormControl('');
        this.step = 0;
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
        // this._faqService.onFaqsChanged
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe(response => {
        //         this.faqs = response;
        //         this.faqsFiltered = response;
        //     });

        this.searchInput.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe(searchText => {
                this.faqsFiltered = FuseUtils.filterArrayByString(this.faqs, searchText);
            });
        // Subscribe to update Items on changes
        this._faqService.onPageItemChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(faqPage => {
                this.faqs = this._faqService.pageItem.content;
                this.faqsFiltered = this._faqService.pageItem.content;
                // Assign the data to the data source for the table to render
                // this.dataSource = new MatTableDataSource(this._faqService.pageItem.content);
                this.totalLength = this._faqService.pageItem.totalElements;
                this.limit = this._faqService.pageItem.size;
                this.pageIndex = this._faqService.pageItem.number;
                // this.dataSource.sort = this.sort;

            });
    }

    applyFilter(filterValue: string): void {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    changePage(event): void {
        console.log('event', event);
        this._faqService.getPageItem(event.pageIndex, event.pageSize);

    }

    /**
     * Delete Contact
     */
    deleteFaq(faq): void {
        console.log(faq);
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {

                this._faqService.deleteItemById(faq.id).subscribe((response: any) => {
                    // Show the success message
                    this._matSnackBar.open('Record Deleted', 'OK', {
                        verticalPosition: 'bottom',
                        duration: 3000
                    });
                    // this._faqService.getItems();
                    this.faqs = this.faqs.filter(_faq => {
                        return faq.id !== _faq.id
                    })
                    this.faqsFiltered = this.faqsFiltered.filter(_faq => {
                        return faq.id !== _faq.id
                    })
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

    /**
     * Set step
     *
     * @Param {number} index
     */
    setStep(index: number): void {
        this.step = index;
    }

    /**
     * Next step
     */
    nextStep(): void {
        this.step++;
    }

    /**
     * Previous step
     */
    prevStep(): void {
        this.step--;
    }
}
