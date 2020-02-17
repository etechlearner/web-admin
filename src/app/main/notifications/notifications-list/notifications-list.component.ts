import { Component, OnInit, ViewChild } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { NotificationService } from '../notification.service';
import { MatTableDataSource, MatSort } from '@angular/material';

const moment = require('moment');

@Component({
  selector: 'app-notifications-list',
  templateUrl: './notifications-list.component.html',
  styleUrls: ['./notifications-list.component.scss'],
  animations: fuseAnimations,
})
export class NotificationsListComponent implements OnInit {

  dataSource: MatTableDataSource<any>;
  limit: Number = 20;
  skip: Number = 0;
  totalLength: Number = 0;
  pageIndex: Number = 0;
  pageLimit: Number[] = [5, 10, 25, 100];
  displayedColumns: string[] = ['name', 'phone', 'email'];
  @ViewChild(MatSort) sort: MatSort;

  constructor(private notificationService: NotificationService) { }

  ngOnInit() {
    this.notificationService.getAllNotifications()
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
  }

  ViewTimeAgo(date) {
    return moment(date).fromNow();
  }

  changePage = (event): void => {
    this.notificationService.getPagedNotifications(event.pageSize, event.pageIndex)
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
  };

}
