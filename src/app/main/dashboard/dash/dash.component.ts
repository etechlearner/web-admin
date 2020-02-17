import { Component, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

const BASE_URL = environment.baseUrl;

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.scss'],
  animations: fuseAnimations
})

export class DashComponent implements OnInit {

  public gyms = {
    totalgyms: 0,
    appUsers: 0,
    newUsers: 0
  }
  public subscriptions = {
    inactiveOffers: 0,
    activeOffers: 0,
    expired: 0
  }
  public finance = {
    totalRevenue: 0,
    netreceivable: 0,
    pendingRefund: 0
  }
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getDashboardData();
  }

  getDashboardData() {
    var that = this;
    let appUsersCount = new Promise(function (resolve, reject) {
      that.http.get(`${BASE_URL}/api/accountservice/v1/auth/appUserCount`)
        .subscribe((res: any) => {
          resolve(res)
        })
    });
    let offersCount = new Promise(function (resolve, reject) {
      that.http.get(`${BASE_URL}/api/appservice/v1/userSubscription/count`)
        .subscribe((res: any) => {
          resolve(res)
        }, reject)
    });
    let gymCount = new Promise(function (resolve, reject) {
      that.http.get(`${BASE_URL}/api/appservice/v1/gym/totalCount`)
        .subscribe((res: any) => {
          resolve(res)
        }, reject)
    });
    let newUsersCount = new Promise(function (resolve, reject) {
      that.http.get(`${BASE_URL}/api/accountservice/v1/auth/newUserCount`)
        .subscribe((res: any) => {
          resolve(res)
        }, reject)
    });
    let totalRevenue = new Promise(function (resolve, reject) {
      that.http.get(`${BASE_URL}/api/appservice/v1/userSubscription/totalRevenue`)
        .subscribe((res: any) => {
          resolve(res)
        }, reject)
    });
    let totalReceivable = new Promise(function (resolve, reject) {
      that.http.get(`${BASE_URL}/api/appservice/v1/userSubscription/totalReceivable`)
        .subscribe((res: any) => {
          resolve(res)
        }, reject)
    });
    let totalRefundable = new Promise(function (resolve, reject) {
      that.http.get(`${BASE_URL}/api/appservice/v1/userSubscription/totalRefundable`)
        .subscribe((res: any) => {
          resolve(res)
        }, reject)
    });

    Promise.all([
      gymCount,
      appUsersCount,
      newUsersCount,
      offersCount,
      totalRevenue,
      totalReceivable,
      totalRefundable
    ])
      .then(function (res: any) {
        that.gyms.totalgyms = res[0].gymCount;
        that.gyms.appUsers = res[1].appUserCount;
        that.gyms.newUsers = res[2].appUserCount;

        that.subscriptions.inactiveOffers = res[3].inActive;
        that.subscriptions.activeOffers = res[3].active;
        that.subscriptions.expired = res[3].expire;

        that.finance.totalRevenue = res[4].totalRevenue;
        that.finance.netreceivable = res[5].totalReceivable;
        that.finance.pendingRefund = res[6].totalRefundable;
      })
      .catch(err => {
        console.log(err)
      })
  }

}
