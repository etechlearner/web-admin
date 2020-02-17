import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { SupportService } from '../support.service';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-support-reply',
  templateUrl: './support-reply.component.html',
  styleUrls: ['./support-reply.component.scss']
})
export class SupportReplyComponent implements OnInit {

  replyForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private supportService: SupportService,
    private matSnackbar: MatSnackBar,
    private _formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.replyForm = this._formBuilder.group({
      subject: [this._data.reportSubject ? this._data.reportSubject.subject : '', [Validators.required, subjectValidator, Validators.minLength(3)]],
      replyMessage: ['', [Validators.required, messageValidator, Validators.minLength(3)]]
    });
  }

  sendReply() {
    let data = this.replyForm.getRawValue();
    data.reportId = this._data.reportId;
    this.supportService.replyReport(data)
      .then(res => {
        this.matSnackbar.open("Message sent", "Ok", {
          duration: 3000
        })
      })
      .catch(err => {
        console.log(err)
        this.matSnackbar.open("Unable to send", "Ok", {
          duration: 3000
        })
      })
  }

}

export const subjectValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.parent || !control) {
      return null;
  }

  let name = control.parent.get('subject').value;

  if (name.trim()) {
      return null;
  }

  return { 'blankName': true };
};

export const messageValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.parent || !control) {
      return null;
  }

  let name = control.parent.get('replyMessage').value;

  if (name.trim()) {
      return null;
  }

  return { 'blankName': true };
};