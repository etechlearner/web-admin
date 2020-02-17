import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MatDialogRef, MatPaginator, MatSort, MatDialog, MatSnackBar, MatTableDataSource } from '@angular/material';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { Subject, fromEvent } from 'rxjs';
import { CustomerService } from '../customer.service';
import { takeUntil, debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Customer } from '../customer.model';
import { CustomerViewComponent } from '../customer-view/customer-view.component';
import { FormControl } from '@angular/forms';
import { ViewOffersComponent } from '../view-offers/view-offers.component';

export interface customersSort {
  name: string;
}

@Component({
  selector: 'customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})

export class CustomerListComponent implements OnInit {

  displayedColumns: string[] = ['name', 'id', 'contact', 'email', 'action'];
  dataSource: MatTableDataSource<Customer>;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  limit: number = 20;
  skip: number = 0;
  totalLength: number = 0;
  pageIndex: number = 0;
  pageLimit: number[] = [5, 10, 25, 100];
  dialogRef: any;
  searchInput: any;
  noUser: boolean = false;
  showSearchLoader: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('SearchInput') SearchInput: ElementRef;

  private _unsubscribeAll: Subject<any>;

  constructor(
    private _customerService: CustomerService,
    public _matDialog: MatDialog,
    private _matSnackBar: MatSnackBar
  ) {
    this._unsubscribeAll = new Subject();
    this.searchInput = new FormControl('');
  }

  ngOnInit(): void {
    // Subscribe to update Items on changes
    this._customerService.onPageItemChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(customerPage => {

        // Assign the data to the data source for the table to render
        this.dataSource = new MatTableDataSource(this._customerService.pageItem.content);
        this.totalLength = this._customerService.pageItem.totalElements;
        this.limit = this._customerService.pageItem.size;
        this.pageIndex = this._customerService.pageItem.number;
        setTimeout(() => {
          this.dataSource.sort = this.sort;
        })
      });
    this.subscribeSearch();
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  subscribeSearch() {
    fromEvent(this.SearchInput.nativeElement, 'keyup')
      .pipe(
        map((event: any) => {
          return event.target.value;
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
    this._customerService.getFilteredItems(filterValue)
      .subscribe((res: any[]) => {
        if (filterValue === '') {
          this.noUser = false;
          this.dataSource = new MatTableDataSource(res.splice(0, this.limit));
          this.totalLength = this._customerService.pageItem.totalElements;
          this.limit = this._customerService.pageItem.size;
          this.pageIndex = this._customerService.pageItem.number;
          this.dataSource.sort = this.sort;
        } else {
          this.noUser = false;
          this.dataSource = new MatTableDataSource(res);
          this.totalLength = this._customerService.pageItem.totalElements;
          this.limit = this._customerService.pageItem.size;
          this.pageIndex = this._customerService.pageItem.number;
          this.dataSource.sort = this.sort;
        }
        if (this.dataSource.data.length < 1) {
          this.noUser = true;
        }
        this.showSearchLoader = false;
      }, err => {
        this.showSearchLoader = false;
        console.log(err)
        this.dataSource = new MatTableDataSource();
        this.totalLength = 0;
        this.limit = 0;
        this.pageIndex = 0;
      })
  }

  changePage(event) {
    this._customerService.getPageItem(event.pageIndex, event.pageSize);
  }

  viewMore(customer) {
    this._customerService.getBoughtOffers(customer.authId)
      .then((data) => {
        this.dialogRef = this._matDialog.open(CustomerViewComponent, {
          panelClass: 'app-aminity-ionic-picker',
          data: {
            data,
            authId: customer.authId
          }
        });

        this.dialogRef.afterClosed()
          .subscribe((response: any) => {
            if (!response) {
              return;
            }

            // console.log(response);
          });

      }).catch((err) => {
        this._matSnackBar.open("An error occured", "Ok", {
          duration: 3000
        })
      });
  }

  showOffers(customer) {
    this._matDialog.open(ViewOffersComponent, {
      panelClass: 'app-aminity-ionic-picker',
      width: '600px',
    })
  }
}