import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MatDialogRef, MatPaginator, MatSort, MatDialog, MatSnackBar, MatTableDataSource } from '@angular/material';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { Subject } from 'rxjs';
import { FinanceService } from '../finance.service';
import { takeUntil } from 'rxjs/operators';
import { Finance } from '../finance.model';
import { SendEmailComponent } from '../send-email/send-email.component';
import { ClearingComponent } from '../clearing/clearing.component';
import { HttpClient } from '@angular/common/http';
import { GymDetailViewComponent } from '../gym-view/gym-view.component';
import { environment } from 'environments/environment';
import { Router, NavigationExtras } from '@angular/router';
import { OffersCountComponent } from '../offers-count/offers-count.component';

export interface financesSort {
  name: string;
}

const BASE_URL = environment.baseUrl;

@Component({
  selector: 'finance-list',
  templateUrl: './finance-list.component.html',
  styleUrls: ['./finance-list.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class FinanceListComponent implements OnInit {

  displayedColumns: string[] = [
    'name',
    'status',
    'others'
  ];
  dataSource: MatTableDataSource<Finance>;

  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  limit: number = 20;
  skip: number = 0;
  totalLength: number = 0;
  pageIndex: number = 0;
  pageLimit: number[] = [5, 10, 25, 100];
  public finance = {
    totalRevenue: "0",
    netreceivable: "0",
    pendingRefund: "0"
  }
  dialogRef: any;

  private _unsubscribeAll: Subject<any>;

  constructor(
    private _financeService: FinanceService,
    public _matDialog: MatDialog,
    private _matSnackBar: MatSnackBar,
    private _httpClient: HttpClient,
    private router: Router
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    // Get finance details
    this.getFinanceData();

    // Subscribe to update Items on changes
    this._financeService.onPageItemChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(financePage => {

        // Assign the data to the data source for the table to render
        this.dataSource = new MatTableDataSource(this._financeService.pageItem.content);
        this.totalLength = this._financeService.pageItem.totalElements;
        this.limit = this._financeService.pageItem.size;
        this.pageIndex = this._financeService.pageItem.number;
        this.dataSource.sort = this.sort;
      });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  changePage(event) {
    this._financeService.getPageItem(event.pageIndex, event.pageSize);
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  openEmailDialog(finance) {
    this.dialogRef = this._matDialog.open(SendEmailComponent, {
      panelClass: 'app-aminity-ionic-picker',
      data: finance.id
    });

    this.dialogRef.afterClosed()
      .subscribe((response: any) => {
        if (!response) {
          return;
        }
        console.log(response);
      });
  }

  openClearingDialog() {
    this.dialogRef = this._matDialog.open(ClearingComponent, {
      panelClass: 'app-aminity-ionic-picker',
    });

    this.dialogRef.afterClosed()
      .subscribe((response: any) => {
        if (!response) {
          return;
        }
        console.log(response);
      });
  }

  openViewDetailsDialog(finance) {
    this._financeService.getOffersByGymId(finance.id)
      .then((res: any) => {
        this.dialogRef = this._matDialog.open(GymDetailViewComponent, {
          panelClass: 'app-aminity-ionic-picker',
          data: {
            data: res.offers,
            gymId: finance.id
          }
        });

        this.dialogRef.afterClosed()
          .subscribe((response: any) => {
            if (!response) {
              return;
            }
            // console.log(response);
          });
      })
      .catch(err => {
        console.log(err)
        this._matSnackBar.open("An error occurred", "Ok", {
          duration: 3000
        })
      })
  }

  getFinanceData() {
    var that = this;
    let totalRevenue = new Promise(function (resolve, reject) {
      that._httpClient.get(`${BASE_URL}/api/appservice/v1/userSubscription/totalRevenue`)
        .subscribe((res: any) => {
          resolve(res)
        }, reject)
    });
    let totalReceivable = new Promise(function (resolve, reject) {
      that._httpClient.get(`${BASE_URL}/api/appservice/v1/userSubscription/totalReceivable`)
        .subscribe((res: any) => {
          resolve(res)
        }, reject)
    });
    let totalRefundable = new Promise(function (resolve, reject) {
      that._httpClient.get(`${BASE_URL}/api/appservice/v1/userSubscription/totalRefundable`)
        .subscribe((res: any) => {
          resolve(res)
        }, reject)
    });

    Promise.all([
      totalRevenue,
      totalReceivable,
      totalRefundable
    ])
      .then(function (res: any) {
        that.finance.totalRevenue = parseFloat(res[0].totalRevenue).toFixed(2).toString();
        that.finance.netreceivable = parseFloat(res[1].totalReceivable).toFixed(2).toString();
        that.finance.pendingRefund = parseFloat(res[2].totalRefundable).toFixed(2).toString();
      })
      .catch(err => {
        console.log(err)
      })
  }

  goToGymDetails(finance) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        name: finance.name
      }
    };
    this.router.navigate([`/finances/${finance.id}`], navigationExtras);
  }

  showOffers(gymId) {
    this._financeService.getPaginatedOffersByGymId(gymId, 0, 1)
      .then((res: any) => {
        this.dialogRef = this._matDialog.open(OffersCountComponent, {
          panelClass: 'app-aminity-ionic-picker',
          width: '600px',
          data: {
            activeOffers: res.active,
            expiredOffers: res.expire,
            inActiveOffers: res.inActive
          }
        });

        this.dialogRef.afterClosed()
          .subscribe((response: any) => {
            if (!response) {
              return;
            }
            console.log(response);
          });
      })
      .catch(err => {
        this._matSnackBar.open("Error fetching offers data")
      })
  }
}