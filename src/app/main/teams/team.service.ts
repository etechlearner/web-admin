import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Http } from '@angular/http';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TeamPage } from './teampage.model';
import { environment } from 'environments/environment';

const BASE_URL = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class TeamService {

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
        this._httpClient.get(`${BASE_URL}/api/accountservice/v1/GFUser/team`)
          .subscribe((response: any) => {
            this.pageItem = new TeamPage(response);
            this.onPageItemChanged.next(this.pageItem);
            resolve(response);
          }, reject);
      }
      if (this.routeParams.id === 'new') {
        this.onItemChanged.next(false);
        resolve(false);
      }
      if (this.routeParams.id && this.routeParams.id !== 'new') {
        this._httpClient.get(`${BASE_URL}/api/accountservice/v1/auth/findByAuthId/${this.routeParams.id}`)
          .subscribe((response: any) => {
            this.onItemChanged.next(response)
            resolve(response);
          }, reject);
      }
      if (this.routeParams.changepassword === 'change-password') {
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

  addItem(item): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${BASE_URL}/api/accountservice/v1/GFUser/registerTeamUser`, item)
        .subscribe((response: any) => {
          console.log(response)
          resolve(response);
        }, reject);
    });
  }

  getPageItem(page: number, size: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${BASE_URL}/api/accountservice/v1/GFUser/team?page=${page}&size=${size}`)
        .subscribe((response: any) => {
          this.pageItem = new TeamPage(response);
          this.onPageItemChanged.next(this.pageItem);
          resolve(response);
        }, reject);
    });
  }

  deleteItemById(id) {
    return new Promise((resolve, reject) => {
      this._httpClient.delete(`${BASE_URL}/api/accountservice/v1/GFUser/${id}`)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }

  updateTeamMember(updatedMember): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${BASE_URL}/api/accountservice/v1/GFUser/update`, updatedMember)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }

  updateMemberPassword(data) {
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${BASE_URL}/api/accountservice/v1/auth/updatePasswordByAuthId`, data)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }

  handleError<T>(operation = 'operation', result?: T) {
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
