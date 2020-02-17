import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http } from '@angular/http';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SettingPage } from './settingpage.model';
import { environment } from 'environments/environment';

const API_URL = environment.apiUrl;
const ACCOUNT_URL = environment.apiaccountUrl;
const BASE_URL = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  entityNode = 'app-settings';
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
      // console.log(this.route);
      if (this.routeParams.id === undefined) {

        const response = {
          content: [
            { id: '1', name: 'Amenities', handle: 'amenities' },
            { id: '2', name: 'Default Settings', handle: 'default' },
            { id: '3', name: 'Offers', handle: 'offers' },
            { id: '4', name: 'Back Account', handle: 'account' }
          ],
          totalPages: 1,
          totalElements: 3,
          last: 'string',
          size: 1,
          first: 'string',
          sort: 'string',
          number: 1,
          next: 'string'
        };
        // this._httpClient.get(API_URL + '/' + this.entityNode)
        //   .subscribe((response: any) => {
        this.pageItem = new SettingPage(response);
        this.onPageItemChanged.next(this.pageItem);
        resolve(response);
        // }, reject);
        // this._httpClient.get(API_URL + '/' + this.entityNode)
        // .subscribe((response: any) => {
        //   this.items = response;
        //   this.onItemsChanged.next(this.items);
        //   resolve(response);
        // }, reject);
      }
      else if (this.routeParams.id === 'new') {
        this.onItemChanged.next(false);
        resolve(false);
      }
      else if (this.routeParams.id === 'default') {
        this._httpClient.get(API_URL + '/' + this.entityNode + '/type/' + this.routeParams.id)
          .subscribe((response: any) => {
            this.items = response;
            this.onItemsChanged.next(this.items);
            resolve(response);
          }, reject);

        this.onItemChanged.next(false);
        resolve(false);
      }
      else if (this.routeParams.id === 'about') {
        this._httpClient.get(`${BASE_URL}/api/appservice/v1/app-settings/key/aboutContent`)
          .subscribe((response: any) => {
            this.onItemsChanged.next(response);
            resolve(response);
          })
      }
      else if (this.routeParams.id === 'privacy-policy') {
        this._httpClient.get(`${BASE_URL}/api/appservice/v1/app-settings/key/policy`)
          .subscribe((response: any) => {
            this.onItemsChanged.next(response);
            resolve(response);
          })
      }
      else if (this.routeParams.id === 'term-and-condition') {
        this._httpClient.get(`${BASE_URL}/api/appservice/v1/app-settings/key/terms`)
          .subscribe((response: any) => {
            this.onItemsChanged.next(response);
            resolve(response);
          })
      }
      else if (this.routeParams.page === 'accounts') {
        this.onItemsChanged.next(false);
        resolve(false);
      }
      else {
        this._httpClient.get(API_URL + '/' + this.entityNode + '/' + this.routeParams.id)
          .subscribe((response: any) => {
            this.item = response;
            console.log(response)
            this.onItemChanged.next(this.item);
            resolve(response);
          }, reject);
      }
    });
  }

  getItem(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.routeParams.id === 'new') {
        this.onItemChanged.next(false);
        resolve(false);
      }
      else {
        this._httpClient.get(API_URL + '/' + this.entityNode + '/' + this.routeParams.id)
          .subscribe((response: any) => {
            this.item = response;
            this.onItemChanged.next(this.item);
            resolve(response);
          }, reject);
      }
    });
  }

  isAccountVerified(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${ACCOUNT_URL}/auth/whoami`)
        .subscribe((response: any) => {
          if (response.authId) {
            this._httpClient.get(`${BASE_URL}/api/financeservice/v1/bank/verify/${response.authId}`)
              .subscribe((res: any) => {
                resolve(res);
              })
          }
        }, reject);
    });
  }

  saveItem(item): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.put(API_URL + '/' + this.entityNode + '/saveAllByType', item)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }

  addItem(item): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(API_URL + '/' + this.entityNode + '/saveAllByType', item)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }

  addAccountInfo(accountdata) {
    return new Promise((resolve, reject) => {
      // this._httpClient.post(API_URL + '/' + this.entityNode + '/saveAllByType', accountdata)
      //   .subscribe((response: any) => {
      //     resolve(response);
      //   }, reject);
      this._httpClient.post(`${BASE_URL}/api/financeservice/v1/bank`, accountdata)
        .subscribe((res: any) => {
          resolve(res)
        }, reject)
    });
  }


  addListItem(Listitem): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(API_URL + '/' + this.entityNode + '/saveall', Listitem)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }

  getItems(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(API_URL + '/' + this.entityNode)
        .subscribe((response: any) => {
          this.items = response;
          this.onItemsChanged.next(this.items);
          resolve(response);
        }, reject);
    });
  }

  getPageItem(page: number, size: number): Promise<any> {
    // ?page=0&size=20
    return new Promise((resolve, reject) => {
      this._httpClient.get(API_URL + '/' + this.entityNode + '?page=' + page + '&size=' + size)
        .subscribe((response: any) => {
          this.pageItem = new SettingPage(response);
          this.onPageItemChanged.next(this.pageItem);
          resolve(response);
        }, reject);
    });
  }

  deleteItemById(itemId: number): any {
    return this._httpClient.delete(API_URL + '/' + this.entityNode + '/' + itemId);

  }

  updateSettingsContent(content): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.routeParams.id === 'about') {
        this._httpClient.put(`${BASE_URL}/api/appservice/v1/app-settings/updateSetting`, content)
          .subscribe((res: any) => {
            resolve(res)
          }, reject)
      }
      else if (this.routeParams.id === 'privacy-policy') {
        this._httpClient.put(`${BASE_URL}/api/appservice/v1/app-settings/updateSetting`, content)
          .subscribe((res: any) => {
            resolve(res)
          }, reject)
      }
      else if (this.routeParams.id === 'term-and-condition') {
        this._httpClient.put(`${BASE_URL}/api/appservice/v1/app-settings/updateSetting`, content)
          .subscribe((res: any) => {
            resolve(res)
          }, reject)
      }
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
