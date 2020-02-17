import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MatSort, MatDialog, MatTableDataSource, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FinanceService } from '../finance.service';
import * as moment from 'moment';

@Component({
  selector: 'app-gym-detail-view',
  templateUrl: './gym-view.component.html',
  styleUrls: ['./gym-view.component.scss'],
  animations: fuseAnimations
})
export class GymDetailViewComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;

  limit: Number = 20;
  skip: Number = 0;
  totalLength: Number = 0;
  pageIndex: Number = 0;
  pageLimit: Number[] = [5, 10, 25, 100];
  dataSource: MatTableDataSource<any>;
  dialogRef: any;
  displayedColumns: string[] = [
    'user-name',
    'pass-name',
    'amount',
    'purchaseDate',
    'status',
    'others'
  ];
  showTable: boolean = false;
  moment: any = moment;

  constructor(
    private _financeService: FinanceService,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    private _data: any,
    private matSnackbar: MatSnackBar
  ) { }

  ngOnInit() {
    if (this._data && this._data.data && this._data.data.content && this._data.data.content.length > 0) {
      this.dataSource = new MatTableDataSource(this._data.data.content);
      this.totalLength = this._data.data.totalElements;
      this.limit = this._data.data.size;
      this.pageIndex = this._data.data.number;
      this.dataSource.sort = this.sort;
      this.showTable = true;
    }
  }

  changePage = (event): void => {
    this._financeService.getPaginatedOffersByGymId(this._data.gymId, event.pageIndex, event.pageSize)
      .then((res: any) => {
        this.dataSource = res.offers.content;
      })
      .catch(err => {
        console.log(err)
      })
  };

  refund(offer) {
    this._financeService.refund(offer)
      .then((res: any) => {
        this.matSnackbar.open("Refund will be processed in 3 business days", "Ok", {
          duration: 3000
        })
        offer.status = "CANCELLED"
      })
      .catch(err => {
        this.matSnackbar.open("An error occurred", "Ok", {
          duration: 3000
        })
      })
  }

}
