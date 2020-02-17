import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Http } from '@angular/http';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CustomerPage } from './customerpage.model';
import { environment } from 'environments/environment';

const BASE_URL = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  routeParams: any;
  item: any;
  pageItem: any;
  items: any[];
  onItemChanged: BehaviorSubject<any>;
  onPageItemChanged: BehaviorSubject<any>;
  onItemsChanged: BehaviorSubject<any>;

  constructor(
    private _httpClient: HttpClient,
    private http: Http,
  ) {
    // Set the defaults
    this.onItemChanged = new BehaviorSubject({});
    this.onPageItemChanged = new BehaviorSubject({});
    this.onItemsChanged = new BehaviorSubject({});
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
      if (this.routeParams.id === undefined) {
        this._httpClient.get(`${BASE_URL}/api/accountservice/v1/auth/users`)
          .subscribe((response: any) => {
            this.pageItem = new CustomerPage(response);
            this.onPageItemChanged.next(this.pageItem);
            resolve(response);
          }, reject);
      }
      if (this.routeParams.id === 'new') {
        this.onItemChanged.next(false);
        resolve(false);
      }
    });
  }

  getBoughtOffers(authId): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${BASE_URL}/api/appservice/v1/userSubscription/boughtOffers/${authId}`)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }

  getPagedBoughtOffers(authId, page: number, size: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${BASE_URL}/api/appservice/v1/userSubscription/boughtOffers/${authId}` + '?page=' + page + '&size=' + size)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }

  getPageItem(page: number, size: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${BASE_URL}/api/accountservice/v1/auth/users?page=${page}&size=${size}`)
        .subscribe((response: any) => {
          this.pageItem = new CustomerPage(response);
          this.onPageItemChanged.next(this.pageItem);
          resolve(response);
        }, reject);
    });
  }

  getFilteredItems(name, page?: number, size?: number) {
    return this._httpClient.post(`${BASE_URL}/api/accountservice/v1/auth/usersSearch`, { name })
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
