import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Http } from '@angular/http';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { environment } from 'environments/environment';

const BASE_URL = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class SupportService {

  routeParams: any;
  item: any;
  userReports: any;
  adminReports: any;
  items: any[];
  onItemChanged: BehaviorSubject<any>;
  pagedAdminReports: any;
  onPagedAdminReportsChanged: BehaviorSubject<any>;
  pagedUserReports: any;
  onPagedUserReportsChanged: BehaviorSubject<any>;
  onItemsChanged: BehaviorSubject<any>;

  constructor(
    private _httpClient: HttpClient,
    private http: Http,
  ) {
    // Set the defaults
    this.onPagedAdminReportsChanged = new BehaviorSubject({});
    this.onPagedUserReportsChanged = new BehaviorSubject({});
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    this.routeParams = route.params;

    return new Promise((resolve, reject) => {

      Promise.all([
        this.getInit()
      ]).then(
        () => {
          resolve();
        },
        reject
      );
    });
  }

  getInit(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${BASE_URL}/api/appservice/v1/report/getReports/GRUSER_GFADMIN`)
        .subscribe((response: any) => {
          this.adminReports = response;
          this.pagedAdminReports = response;
          this.onPagedAdminReportsChanged.next(this.adminReports);
        }, reject);

      this._httpClient.get(`${BASE_URL}/api/appservice/v1/report/getReports/GRUSER_GAADMIN`)
        .subscribe((response: any) => {
          this.userReports = response;
          this.pagedUserReports = response;
          this.onPagedUserReportsChanged.next(this.userReports);
        }, reject);
      // Resolve reports
      let reports = {
        adminReports: this.adminReports,
        userReports: this.userReports
      }
      resolve(reports);
    });
  }

  getPagedAdminReports(page: number, size: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${BASE_URL}/api/appservice/v1/report/getReports/GRUSER_GFADMIN?page=${page}&size=${size}`)
        .subscribe((response: any) => {
          this.adminReports = response;
          this.pagedAdminReports = response;
          this.onPagedAdminReportsChanged.next(this.adminReports);
          resolve(response);
        }, reject);

    });
  }

  getPagedUserReports(page: number, size: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${BASE_URL}/api/appservice/v1/report/getReports/GRUSER_GAADMIN?page=${page}&size=${size}`)
        .subscribe((response: any) => {
          this.userReports = response;
          this.pagedUserReports = response;
          this.onPagedUserReportsChanged.next(this.userReports);
          resolve(response);
        }, reject);
    });
  }

  replyReport(data): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${BASE_URL}/api/appservice/v1/report/reply`, data)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }

  getUserDetails(userId): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${BASE_URL}/api/appservice/v1/userSubscription/findUserByAuthId/${userId}`)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
