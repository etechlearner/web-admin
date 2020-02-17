import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { GymPage } from './gympage.model';
import { environment } from 'environments/environment';
import { Gym } from './gym.model';
import { Gymuser } from './gymuser.model';

const API_URL = environment.apiUrl;
const API_URL_ACCOUNT = environment.apiaccountUrl;
const BASE_URL = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})

export class GymService {

  entityNode = 'GMUser';
  routeParams: any;
  item: any;
  pageItem: any;
  items: any[];
  onItemChanged: BehaviorSubject<any>;
  onPageItemChanged: BehaviorSubject<any>;
  onItemsChanged: BehaviorSubject<any>;

  constructor(
    private _httpClient: HttpClient

  ) {
    // Set the defaults
    this.onItemChanged = new BehaviorSubject({});
    this.onPageItemChanged = new BehaviorSubject({});
    this.onItemsChanged = new BehaviorSubject({});

  }

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
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
        this._httpClient.get(API_URL_ACCOUNT + '/' + this.entityNode + '/admins')
          .subscribe((response: any) => {
            this.pageItem = new GymPage(response);
            this.onPageItemChanged.next(this.pageItem);
            resolve(response);
          }, reject => {
            console.log(reject)
          });

        // this._httpClient.get(API_URL + '/' + this.entityNode)
        // .subscribe((response: any) => {
        //   this.items = response;
        //   this.onItemsChanged.next(this.items);
        //   resolve(response);
        // }, reject);
      }
      else if (this.routeParams.id === 'new') {
        console.log('2')
        this.onItemChanged.next(false);
        resolve(false);
      }
      else if (this.routeParams.editcom === 'edit-commission') {
        this._httpClient.get(API_URL + '/gym/' + this.routeParams.id)
          .subscribe((response: any) => {

            this.item = response;
            this.onItemChanged.next(this.item);
            resolve(response);
          }, reject);
        resolve(false);

      }
      else {
        this._httpClient.get(API_URL + '/gym/findGymByOwner/' + this.routeParams.id)
          .subscribe((response: any) => {
            this.item = response;
            this.onItemChanged.next(this.item);
            resolve(response);
          }, () => {
            this.item = null;
            this.onItemChanged.next(false);
            resolve(false);
          });
        // resolve(true);
      }
    });
  }

  getPageItem(page: Number, size: Number): Promise<any> {
    // ?page=0&size=20
    return new Promise((resolve, reject) => {
      this._httpClient.get(API_URL_ACCOUNT + '/' + this.entityNode + '/admins' + '?page=' + page + '&size=' + size)
        .subscribe((response: any) => {
          this.pageItem = new GymPage(response);
          this.onPageItemChanged.next(this.pageItem);
          resolve(response);
        }, reject);
    });
  }

  getUnassignedOwnersPage(page: Number, size: Number): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${BASE_URL}/api/accountservice/v1/GMUser/admins/noGym?page=${page}&size=${size}`)
        .subscribe((response: any) => {
          this.pageItem = new GymPage(response);
          this.onPageItemChanged.next(this.pageItem);
          resolve(response);
        }, reject);
    });
  }

  getItem(): Promise<any> {
    return new Promise((resolve, reject) => {


      if (this.routeParams.id === 'new') {
        this.onItemChanged.next(false);
        resolve(false);
      }

      else {
        this._httpClient.get(API_URL + '/gym/findGymByOwner/' + this.routeParams.id)
          .subscribe((response: any) => {

            this.item = response;
            this.onItemChanged.next(this.item);
            resolve(response);
          }, reject);
      }
    });
  }

  getUserById(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(API_URL_ACCOUNT + '/' + this.entityNode + '/' + this.routeParams.id)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);

    });
  }

  saveItem(item): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.put(API_URL + '/franchisee', item)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }

  updateCommissionItem(item): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.put(API_URL + '/gym/updateGymPrice', item)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }

  addItem(item): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(API_URL + '/' + this.entityNode, item)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
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
      this._httpClient.get(API_URL_ACCOUNT + '/' + this.entityNode + '/admins')
        .subscribe((response: any) => {
          this.pageItem = new GymPage(response);
          this.onPageItemChanged.next(this.pageItem);
          resolve(response);
        }, reject);
    });

  }

  getItemByGymUser(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(API_URL + '/gym/findGymByOwner/' + id)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }

  deleteItemById(itemId): any {
    // return this._httpClient.delete(API_URL_ACCOUNT + '/' + this.entityNode + '/' + itemId);
    return new Promise((resolve, reject) => {
      this._httpClient.delete(API_URL_ACCOUNT + '/' + this.entityNode + '/' + itemId)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }

  createGym(item): Promise<Gym> {
    return new Promise((resolve, reject) => {
      // this._httpClient.post(`http://192.168.3.216:8080/api/appservice/v1/franchiser`, item)
      // this._httpClient.post(API_URL + '/franchiser', item)
      this._httpClient.post(API_URL + '/franchisee', item)
        .subscribe((response: any) => {
          resolve(new Gym(response));
        }, reject);
    });
  }

  createGymUser(item): Promise<Gymuser> {

    return new Promise((resolve, reject) => {
      this._httpClient.post(API_URL_ACCOUNT + '/GMUser/registerAdmin', item)
        .subscribe((response: any) => {
          resolve(new Gymuser(response));
        }, reject);
    });
  }

  toggleGymStatus(gymId: string): any {
    return new Promise((resolve, reject) => {
      this._httpClient.post(API_URL + '/franchiser/toggleGymStatus', { id: gymId })
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }

  getFilteredItems(keyword, page?: number, size?: number) {
    return this._httpClient.post(`${BASE_URL}/api/accountservice/v1/GMUser/searchByGymName`, { keyword })
  }

  getUnassignedOwners() {
    return new Promise((resolve, reject) => {
      this._httpClient.get(BASE_URL + '/api/accountservice/v1/GMUser/admins/noGym')
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }

  getSortedList(sortSwitch) {
    if (sortSwitch === 1) {
      return new Promise((resolve, reject) => {
        this._httpClient.get(BASE_URL + '/api/accountservice/v1/GMUser/admins/gymNameAsc')
          .subscribe((response: any) => {
            resolve(response);
          }, reject);
      });
    }
    if (sortSwitch === 2) {
      return new Promise((resolve, reject) => {
        this._httpClient.get(BASE_URL + '/api/accountservice/v1/GMUser/admins/gymNameDesc')
          .subscribe((response: any) => {
            resolve(response);
          }, reject);
      });
    }
    if (sortSwitch === 3) {
      return new Promise((resolve, reject) => {
        this._httpClient.get(BASE_URL + '/api/accountservice/v1/GMUser/admins/gymCreatedAtAsc')
          .subscribe((response: any) => {
            resolve(response);
          }, reject);
      });
    }
    if (sortSwitch === 4) {
      return new Promise((resolve, reject) => {
        this._httpClient.get(BASE_URL + '/api/accountservice/v1/GMUser/admins/gymCreatedAtDesc')
          .subscribe((response: any) => {
            resolve(response);
          }, reject);
      });
    }

  }

  getPaginatedSortedList(sortSwitch, event) {
    if (sortSwitch === 1) {
      return new Promise((resolve, reject) => {
        this._httpClient.get(BASE_URL + '/api/accountservice/v1/GMUser/admins/gymNameAsc' + `?page=${event.pageIndex}&size=${event.pageSize}`)
          .subscribe((response: any) => {
            resolve(response);
          }, reject);
      });
    }
    if (sortSwitch === 2) {
      return new Promise((resolve, reject) => {
        this._httpClient.get(BASE_URL + '/api/accountservice/v1/GMUser/admins/gymNameDesc' + `?page=${event.pageIndex}&size=${event.pageSize}`)
          .subscribe((response: any) => {
            resolve(response);
          }, reject);
      });
    }
    if (sortSwitch === 3) {
      return new Promise((resolve, reject) => {
        this._httpClient.get(BASE_URL + '/api/accountservice/v1/GMUser/admins/gymCreatedAtAsc' + `?page=${event.pageIndex}&size=${event.pageSize}`)
          .subscribe((response: any) => {
            resolve(response);
          }, reject);
      });
    }
    if (sortSwitch === 4) {
      return new Promise((resolve, reject) => {
        this._httpClient.get(BASE_URL + '/api/accountservice/v1/GMUser/admins/gymCreatedAtDesc' + `?page=${event.pageIndex}&size=${event.pageSize}`)
          .subscribe((response: any) => {
            resolve(response);
          }, reject);
      });
    }
  }
}
