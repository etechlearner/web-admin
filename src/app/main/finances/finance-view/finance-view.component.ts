import { Component, OnDestroy, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil, tap, switchMap, finalize } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { MatSort, MatDialog, MatTableDataSource, MatSnackBar } from '@angular/material';
import { FinanceService } from '../finance.service';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-finance-view',
  templateUrl: './finance-view.component.html',
  styleUrls: ['./finance-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class FinanceViewComponent implements OnInit, OnDestroy {

  // Private
  private _unsubscribeAll: Subject<any>;
  @ViewChild(MatSort) sort: MatSort;
  searchInput: FormControl;
  gymName: string = "";
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
  statusList: string[] = [
    'ACTIVE',
    'INACTIVE',
    'CANCELLED',
    'COMPLETE'
  ];
  showTable: boolean = false;
  moment: any = moment;
  filterForm: FormGroup;
  searchMoviesCtrl = new FormControl();
  gyms: any;
  isLoading = false;
  errorMsg: string;
  from: any;
  to: any;
  totalEarning: any;
  grEarning: any;
  showSearchLoader: boolean = false;

  constructor(
    private financeService: FinanceService,
    private matSnackbar: MatSnackBar,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private http: HttpClient
  ) {
    // Set the defaults
    this.searchInput = new FormControl('');

    // Set the private defaults
    this._unsubscribeAll = new Subject();

  }

  ngOnInit() {
    this.financeService.onPageItemChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(finance => {
        // Assign the data to the data source for the table to render
        this.dataSource = new MatTableDataSource(this.financeService.pageItem.content);
        // SET TOTAL EARNING AND GR-EARNING
        if (this.financeService.pageItem.content && this.financeService.pageItem.content.length > 0) {
          this.totalEarning = this.financeService.pageItem.content[0].totalEarning;
          this.grEarning = this.financeService.pageItem.content[0].gymRabbitEarning;
        }
        this.totalLength = this.financeService.pageItem.totalElements;
        this.limit = this.financeService.pageItem.size;
        this.pageIndex = this.financeService.pageItem.number;
        this.dataSource.sort = this.sort;
      });



    this.from = moment().startOf('month').format('DD/MM/YYYY');
    this.to = moment().endOf('month').format('DD/MM/YYYY');
    this.filterForm = this._formBuilder.group({
      dateFrom: [''],
      dateTo: [''],
      requestStatues: ['']
    });

    this.route.queryParams
      .subscribe(param => {
        if (param.name) {
          this.gymName = param.name;
        }
        this.filterForm.reset();
      });

    this.autoComplete();
  }

  autoComplete() {
    this.searchMoviesCtrl.valueChanges
      .pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(searchText => {
        if (searchText) {
          this.showSearchLoader = true;
          this.financeService.searchGymByName(searchText.toLowerCase())
            .then((res: any) => {
              this.gyms = res;
              this.showSearchLoader = false;
            })
            .catch(err => {
              this.showSearchLoader = false;
              console.log(err)
              this.matSnackbar.open("An error occured", "Ok", {
                duration: 3000,
                verticalPosition: "bottom"
              })
            })
        } else {
          this.gyms = [];
        }
      });
  }

  applyFilter(event?) {
    let filter = this.filterForm.value;
    if (filter.dateFrom != "") {
      filter.dateFrom = moment(filter.dateFrom).format("YYYY-MM-DD");
    }

    if (filter.dateTo != "") {
      filter.dateTo = moment(filter.dateTo).format("YYYY-MM-DD");
    }

    filter.gymId = this.route.snapshot.paramMap.get('id');

    // IF PAGINATION
    if (event) {
      if (filter.requestStatues == '') {
        delete filter.requestStatues
      }
      if (filter.dateFrom == "Invalid date") {
        filter.dateFrom = "";
      }
      if (filter.dateTo == "Invalid date") {
        filter.dateTo = "";
      }
      this.financeService.getFilteredOffers(filter, event)
    }
    // IF FILTER IS EMPTY AND APPLY BTN CLICKED, OPEN TOAST
    else if (filter.dateFrom == '' && filter.dateTo == '' && filter.requestStatues == '') {
      this.matSnackbar.open("No filter selected", "Ok", {
        duration: 3000,
        verticalPosition: "bottom"
      })
    }
    // IF NO PAGINATION APPLIED, ONLY FILTERS ARE APPLIED
    else {
      if (!filter.requestStatues) {
        delete filter.requestStatues
      }
      if (filter.dateFrom == "Invalid date") {
        filter.dateFrom = "";
      }
      if (filter.dateTo == "Invalid date") {
        filter.dateTo = "";
      }
      this.financeService.getFilteredOffers(filter)
    }
  }

  resetFilter() {
    this.filterForm.reset();
  }

  searchGym(menuTrigger) {
    menuTrigger.openMenu();
  }

  gymSelected(gym) {
    this.from = moment().startOf('month').format('DD/MM/YYYY');
    this.to = moment().endOf('month').format('DD/MM/YYYY');
    this.filterForm.reset();
    this.gymName = gym.name;
  }

  ngOnDestroy() {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
