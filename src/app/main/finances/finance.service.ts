import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { FinancePage } from './financepage.model';
import { environment } from 'environments/environment';

const BASE_URL = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})

export class FinanceService {

  routeParams: any;
  item: any;
  pageItem: any;
  items: any[];
  onItemChanged: BehaviorSubject<any>;
  onPageItemChanged: BehaviorSubject<any>;
  onItemsChanged: BehaviorSubject<any>;

  constructor(
    private _httpClient: HttpClient,
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
        this._httpClient.get(`${BASE_URL}/api/appservice/v1/gym`)
          .subscribe((response: any) => {
            this.pageItem = new FinancePage(response);
            this.onPageItemChanged.next(this.pageItem);
            resolve(response);
          }, reject);
      }
      if (this.routeParams.id) {
        this._httpClient.post(`${BASE_URL}/api/appservice/v1/userSubscription/findSubscriptionsByGymIdAndFilterByDateAndStatus`, {
          // dateFrom: "2019-11-11",
          // dateTo: "2019-12-12",
          gymId: this.routeParams.id,
          // "statues": [
          //   "CANCELLED"
          // ]
        })
          .subscribe((response: any) => {
            this.pageItem = response;
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

  getItem(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.routeParams.id === 'new') {
        this.onItemChanged.next(false);
        resolve(false);
      }
    });
  }

  getPageItem(page: number, size: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${BASE_URL}/api/appservice/v1/gym?page=${page}&size=${size}`)
        .subscribe((response: any) => {
          this.pageItem = new FinancePage(response);
          this.onPageItemChanged.next(this.pageItem);
          resolve(response);
        }, reject);
    });
  }

  getOffersByGymId(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${BASE_URL}/api/appservice/v1/userSubscription/soldOffers/${id}`)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }

  getPaginatedOffersByGymId(id: string, page: number, size: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${BASE_URL}/api/appservice/v1/userSubscription/soldOffers/${id}?page=${page}&size=${size}`)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }

  sendReport(data): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${BASE_URL}/api/appservice/v1/report/send`, data)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }

  refund(offer): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${BASE_URL}/api/appservice/v1/userSubscription/cancel_admin?user_id=${offer.userId}`, { item: offer })
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }

  searchGymByName(keyword): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${BASE_URL}/api/appservice/v1/gym/findByGymName/${keyword}`)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }

  getFilteredOffers(filter, event?): Promise<any> {
    if (event) {
      return new Promise((resolve, reject) => {
        this._httpClient.post(`${BASE_URL}/api/appservice/v1/userSubscription/findSubscriptionsByGymIdAndFilterByDateAndStatus?page=${event.pageIndex}&size=${event.pageSize}`, filter)
          .subscribe((response: any) => {
            this.pageItem = response;
            this.onPageItemChanged.next(this.pageItem);
            resolve(response);
          }, reject);
      });
    } else {
      return new Promise((resolve, reject) => {
        this._httpClient.post(`${BASE_URL}/api/appservice/v1/userSubscription/findSubscriptionsByGymIdAndFilterByDateAndStatus`, filter)
          .subscribe((response: any) => {
            this.pageItem = response;
            this.onPageItemChanged.next(this.pageItem);
            resolve(response);
          }, reject);
      });
    }

  }
}
