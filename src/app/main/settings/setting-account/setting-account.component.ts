import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { SettingService } from '../setting.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '../../../../@fuse/animations';
import { Account } from '../account.model';
import { CountryCodeA3 } from '../../gyms/_countryAlpha3.code';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as jwt_decode from 'jwt-decode';
import { environment } from 'environments/environment';

const BASE_URL = environment.baseUrl;

@Component({
  selector: 'app-setting-account',
  templateUrl: './setting-account.component.html',
  styleUrls: ['./setting-account.component.scss'],
  animations: fuseAnimations
})
export class SettingAccountComponent implements OnInit {
  account: Account;
  pageType: string;
  accountForm: FormGroup;
  bankAccount: Account;
  accountAlreadyExist: boolean = false;
  // IFrame Variables
  showIframe: boolean = true;
  urlSafe: SafeResourceUrl;
  url: any = "";

  public reenableButton = new EventEmitter<boolean>(false);
  package_id: string;
  holdingtype: string[] = ['personal', 'business'];
  accountType: string[] = ['savings', 'checking'];
  currencyType: string[] = ['AUD', 'USD'];
  countryInfo: any[] = new CountryCodeA3().data;
  isVerified: boolean = false;

  private _unsubscribeAll: Subject<any>;
  env: any;

  constructor(
    private _settingService: SettingService,
    private _formBuilder: FormBuilder,
    private _matSnackBar: MatSnackBar,
    private _router: Router,
    public sanitizer: DomSanitizer
  ) {
    // Set the default
    this.bankAccount = new Account();
    // Set the private defaults
    this._unsubscribeAll = new Subject();

  }

  ngOnInit(): void {
    this.verifyAccount();
    // Subscribe to update product on changes
    this._settingService.onItemsChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(account => {
        if (account) {
          this.bankAccount = account;
          // setting.forEach(element => {
          //     this.settings.push(new Account(element));
          // });
          // this.setting = new Account(setting);
          this.pageType = 'edit';
        } else {
          this.pageType = 'new';
        }
      });

      this.url = this.getAuthId();      
  }

  async getAuthId() {
    const token = await localStorage.getItem("access_token");
    const dd = jwt_decode(token);
    this.url = `${BASE_URL}/api/financeservice/v1/bankForm/lightBank?authId=${dd.sub}`;
    this.urlSafe= this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }

  ngOnDestroy = (): void => {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  verifyAccount = () => {
    // debugger;
    this._settingService.isAccountVerified()
      .then((res: any) => {
        if (res.bank_accounts.verification_status === "not_verified") {
          //   this._matSnackBar.open('Unverified account.', 'OK', {
          //     verticalPosition: 'bottom',
          //     duration: 3000
          //   });
          //   this.bankAccount = new Account();
          //   this.accountAlreadyExist = false;
          // this.isVerified = false
        }
        //  else {
        //   this.isVerified = true;
        //   res.bank_accounts.bank.payout_currency = res.bank_accounts.currency;
        //   this.bankAccount = new Account(res.bank_accounts.bank);
        //   this.accountAlreadyExist = true;
        // }
        res.bank_accounts.bank.payout_currency = res.bank_accounts.currency;
        this.bankAccount = new Account(res.bank_accounts.bank);
        this.accountAlreadyExist = true;
        // debugger
        // this.accountForm = this.createAccountForm();
      })
      .catch((err) => {
        console.log(err)
        this._matSnackBar.open('Could not verify account.', 'OK', {
          verticalPosition: 'bottom',
          duration: 3000
        });
      })
  }

}
