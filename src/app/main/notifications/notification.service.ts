import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

const BASE_URL = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private _httpClient: HttpClient) { }

  getAllNotifications(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${BASE_URL}/api/notificationservice/v1/notification`)
      .subscribe((res: any) => {
        resolve(res)
      }, reject)
    });
  }

  getPagedNotifications(size?: Number, page?:Number) {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${BASE_URL}/api/notificationservice/v1/notification?page=${page}&size=${size}`)
      .subscribe((res: any) => {
        resolve(res)
      }, reject)
    });
  }
}
