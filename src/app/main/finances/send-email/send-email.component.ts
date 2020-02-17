import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FinanceService } from '../finance.service';

@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.scss']
})
export class SendEmailComponent implements OnInit {

  emailForm: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA)
    private _data: any,
    private financeService: FinanceService,
    private matSnackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.emailForm = this._formBuilder.group({
      subject: ['', [Validators.required]],
      message: ['', Validators.required]
    });
  }

  sendMessage() {
    let data = this.emailForm.getRawValue();
    data.userTo = this._data;
    this.financeService.sendReport(data)
      .then((res: any) => {
        this.matSnackBar.open("Email sent", "Ok", {
          duration: 3000
        })
      })
      .catch(err => {
        this.matSnackBar.open("Unable to send email", "Ok", {
          duration: 3000
        })
      })
  }

}
