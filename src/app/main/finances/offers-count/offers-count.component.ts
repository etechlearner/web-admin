import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-offers-count',
  templateUrl: './offers-count.component.html',
  styleUrls: ['./offers-count.component.scss']
})
export class OffersCountComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: any,
  ) {
  }

  ngOnInit() {
  }

}
