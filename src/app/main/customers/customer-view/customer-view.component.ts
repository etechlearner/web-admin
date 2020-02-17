import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MatSort, MatDialog, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { CustomerService } from '../customer.service';
import { RefundDialogComponent } from '../refund-dialog/refund-dialog.component';
import * as moment from 'moment';

@Component({
  selector: 'app-customer-view',
  templateUrl: './customer-view.component.html',
  styleUrls: ['./customer-view.component.scss'],
  animations: fuseAnimations
})

export class CustomerViewComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  public moment = moment;
  limit: Number = 20;
  skip: Number = 0;
  totalLength: Number = 0;
  pageIndex: Number = 0;
  pageLimit: Number[] = [5, 10, 25, 100];
  dataSource: MatTableDataSource<any>;
  dialogRef: any;
  displayedColumns: string[] = [
    'name',
    'passType',
    'amount',
    // 'activateDate',
    'purchaseDate',
    // 'expireDate',
    'daysAvailed',
    'status',
    // 'others'
  ];
  showTable: boolean = false;

  constructor(
    private _customerService: CustomerService,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    private _data: any,
    private _customeService: CustomerService
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
    if (this._data && this._data.data && this._data.data.length > 0) {
      console.log('asd')
      this.dataSource = new MatTableDataSource(this._data.data.content);
      this.totalLength = this._data.data.totalElements;
      this.limit = this._data.data.size;
      this.pageIndex = this._data.data.number;
      this.dataSource.sort = this.sort;
      this.showTable = true;
    }    
  }

  showRefundRules(event) {
    event.stopPropagation();
    // this._customerService.getItem()
    //   .then((data) => {
    //     console.log(data);
    this.dialogRef = this._matDialog.open(RefundDialogComponent, {
      panelClass: 'app-aminity-ionic-picker'
    });

    this.dialogRef.afterClosed()
      .subscribe((response: any) => {
        if (!response) {
          return;
        }

        console.log(response);
      });

    // }).catch((err) => {

    // });
  }

  changePage = (event): void => {
    this._customeService.getPagedBoughtOffers(this._data.authId ,event.pageIndex, event.pageSize)
    .then((res: any) => {
      this.dataSource = res.content;
    })
    .catch(err => {
      console.log(err)
    })
  };

}
