import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-refund-dialog',
  templateUrl: './refund-dialog.component.html',
  styleUrls: ['./refund-dialog.component.scss']
})
export class RefundDialogComponent implements OnInit {

  disableAgree: boolean = true;

  constructor() { }

  ngOnInit() {
  }

  toggleAgree() {
    this.disableAgree = !this.disableAgree;
    console.log(this.disableAgree)
  }

  refund() {
    console.log('refund')
  }

}
