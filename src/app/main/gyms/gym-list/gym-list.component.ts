import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MatDialogRef, MatPaginator, MatSort, MatDialog, MatSnackBar, MatTableDataSource } from '@angular/material';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { Subject, fromEvent } from 'rxjs';
import { GymService } from '../gym.service';
import { takeUntil, debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { GymViewComponent } from '../gym-view/gym-view.component';
import { Gymuser } from '../gymuser.model';
import { UserbyroleFormDialogComponent } from '../../teams/userbyrole-form/userbyrole-form.component';
import { Router } from '@angular/router';
import * as moment from 'moment';

// tslint:disable-next-line:class-name
export interface gymsSort {
    name: string;
}

@Component({
    selector: 'gym-list',
    templateUrl: './gym-list.component.html',
    styleUrls: ['./gym-list.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class GymListComponent implements OnInit {

    dialogRef: any;
    displayedColumns: string[] = [
        'owner-name',
        'gymName',
        'phone',
        'email',
        'createdAt',
        'active'
    ];
    dataSource: MatTableDataSource<Gymuser>;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    limit: number = 20;
    skip: Number = 0;
    totalLength: Number = 0;
    pageIndex: Number = 0;
    pageLimit: Number[] = [5, 10, 25, 100];
    moment = moment;
    showSearchLoader: boolean = false;
    noUser: boolean = false;
    unassignedGymOwner: boolean = false;
    isSorted: boolean = false;
    sortSwitch: number = 0;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('SearchInput') SearchInput: ElementRef;


    private _unsubscribeAll: Subject<any>;

    constructor(
        private _gymService: GymService,
        public _matDialog: MatDialog,
        private _matSnackBar: MatSnackBar,
        private _router: Router,
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        // Subscribe to update Items on changes
        this._gymService.onPageItemChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(gymPage => {

                // Assign the data to the data source for the table to render
                this.dataSource = new MatTableDataSource(this._gymService.pageItem.content);
                this.totalLength = this._gymService.pageItem.totalElements;
                this.limit = this._gymService.pageItem.size;
                this.pageIndex = this._gymService.pageItem.number;
                this.dataSource.sort = this.sort;

            });
        this.subscribeSearch();
    }

    subscribeSearch() {
        fromEvent(this.SearchInput.nativeElement, 'keyup')
            .pipe(
                map((event: any) => {
                    return event.target.value.toLowerCase();
                }),
                debounceTime(1000),
                distinctUntilChanged()
            )
            .subscribe((text: string) => {
                this.applyFilter(text)
            });
    }

    applyFilter(filterValue) {
        this.showSearchLoader = true;
        if (!filterValue) {
            this._gymService.getInit();
            this.showSearchLoader = false;
        } else {
            this._gymService.getFilteredItems(filterValue)
                .subscribe((res: any[]) => {
                    if (filterValue === '') {
                        this.noUser = false;
                        this.dataSource = new MatTableDataSource(res);
                        this.totalLength = this._gymService.pageItem.totalElements;
                        this.limit = this._gymService.pageItem.size;
                        this.pageIndex = this._gymService.pageItem.number;
                        this.dataSource.sort = this.sort;
                    } else {
                        this.noUser = false;
                        this.dataSource = new MatTableDataSource(res);
                        this.totalLength = this._gymService.pageItem.totalElements;
                        this.limit = this._gymService.pageItem.size;
                        this.pageIndex = this._gymService.pageItem.number;
                        this.dataSource.sort = this.sort;
                    }
                    if (this.dataSource.data.length < 1) {
                        this.noUser = true;
                    }
                    this.showSearchLoader = false;
                }, err => {
                    this.showSearchLoader = false;
                    this.noUser = true;
                    console.log(err)
                    this.dataSource = new MatTableDataSource();
                    this.totalLength = 0;
                    this.limit = 0;
                    this.pageIndex = 0;
                })
        }
    }

    changePage = (event): void => {
        if (!this.isSorted) {
            if (!this.unassignedGymOwner) {
                this._gymService.getPageItem(event.pageIndex, event.pageSize);
            } else {
                this._gymService.getUnassignedOwnersPage(event.pageIndex, event.pageSize);
            }
        } else {
            this._gymService.getPaginatedSortedList(this.sortSwitch, event)
                .then((res: any) => {
                    this.setDataSource(res)
                })
                .catch(err => {
                    console.log(err)
                    this._matSnackBar.open("An error occurred", "Ok", {
                        duration: 3000,
                        verticalPosition: "bottom"
                    })
                })
        }
    };

    viewGym(gymOwner): void {
        this._gymService.getItemByGymUser(gymOwner.authId)
            .then((gym) => {
                if (gym.name) {
                    this.dialogRef = this._matDialog.open(GymViewComponent, {
                        panelClass: 'app-aminity-ionic-picker',
                        data: {
                            gymOwner,
                            gym
                        }
                    });

                    this.dialogRef.afterClosed()
                        .subscribe((response: any) => {
                            if (!response) {
                                return;
                            }
                            gym.isActive = response.isActive;
                        });
                } else {
                    this._matSnackBar.open("No gym found for this owner", "OK", {
                        duration: 3000
                    })
                }
            })
            .catch((err) => {
                this._matSnackBar.open("No gym found for this owner", "OK", {
                    duration: 3000
                })
                this.dialogRef = this._matDialog.open(GymViewComponent, {
                    panelClass: 'app-aminity-ionic-picker',
                    data: {
                        gymOwner
                    }
                });
            });


    }

    ngOnDestroy = (): void => {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    };

    addUser(): void {
        this.dialogRef = this._matDialog.open(UserbyroleFormDialogComponent, {
            panelClass: 'userbyrole-form-dialog',
            data: {
                user: '',
                action: 'add'
            }
        });

        this.dialogRef.afterClosed()
            .subscribe(response => {
                if (!response) {
                    return;
                }
                const actionType: string = response[0];
                const responseData: Gymuser = response[1];
                switch (actionType) {
                    /**
                     * Save
                     */
                    case 'save':
                        this._gymService.getPageItem(this.pageIndex, this.limit);
                        this._router.navigate(['/gyms/' + responseData.authId + '/' + responseData.handle]);
                        break;
                    /**
                     * Delete
                     */
                    case 'delete':


                        break;
                }
            });
    }

    unassignedGymOwners() {
        this.unassignedGymOwner = !this.unassignedGymOwner;
        if (this.unassignedGymOwner) {
            this._gymService.getUnassignedOwners()
                .then((res: any) => {
                    this.dataSource = new MatTableDataSource(res.content);
                    this.totalLength = res.totalElements;
                    this.limit = res.size;
                    this.pageIndex = res.number;
                    this.dataSource.sort = this.sort;
                })
                .catch(err => {
                    console.log(err)
                })
        } else {
            this._gymService.getInit();
        }
    }

    sortData(event) {
        if (!event.direction) {
            this.sortSwitch = 0;
            this.isSorted = false;
            return
        }
        this.isSorted = true;
        if (event.active === "gymName" && event.direction === "asc") {
            this.sortSwitch = 1;
            this._gymService.getSortedList(1)
                .then((res: any) => {
                    this.setDataSource(res)
                })
                .catch(err => {
                    console.log(err)
                    if (err.error && err.error.message) {
                        this._matSnackBar.open(err.error.message, "Ok", {
                            duration: 3000,
                            verticalPosition: "bottom"
                        })
                    }
                })
        } else if (event.active === "gymName" && event.direction === "desc") {
            this.sortSwitch = 2;
            this._gymService.getSortedList(2)
                .then((res: any) => {
                    this.setDataSource(res)
                })
                .catch(err => {
                    console.log(err)
                    if (err.error && err.error.message) {
                        this._matSnackBar.open(err.error.message, "Ok", {
                            duration: 3000,
                            verticalPosition: "bottom"
                        })
                    }
                })
        } else if (event.active === "createdAt" && event.direction === "asc") {
            this.sortSwitch = 3;
            this._gymService.getSortedList(3)
                .then((res: any) => {
                    this.setDataSource(res)
                })
                .catch(err => {
                    console.log(err)
                    if (err.error && err.error.message) {
                        this._matSnackBar.open(err.error.message, "Ok", {
                            duration: 3000,
                            verticalPosition: "bottom"
                        })
                    }
                })
        } else if (event.active === "createdAt" && event.direction === "desc") {
            this.sortSwitch = 4;
            this._gymService.getSortedList(4)
                .then((res: any) => {
                    this.setDataSource(res)
                })
                .catch(err => {
                    console.log(err)
                    if (err.error && err.error.message) {
                        this._matSnackBar.open(err.error.message, "Ok", {
                            duration: 3000,
                            verticalPosition: "bottom"
                        })
                    }
                })
        }
    }

    setDataSource(source) {
        this.dataSource = new MatTableDataSource(source.content);
        this.totalLength = source.totalElements;
        this.limit = source.size;
        this.pageIndex = source.number;
        this.dataSource.sort = this.sort;
    }

}
