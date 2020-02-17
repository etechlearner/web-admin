import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AminityIcon } from '../aminity-icon.model';

@Component({
  selector: 'app-aminity-ionic-picker',
  templateUrl: './aminity-ionic-picker.component.html',
  styleUrls: ['./aminity-ionic-picker.component.scss']
})
export class AminityIonicPickerComponent {

  action: string;
  icons: string;

  list: string[];

  /**
   * Constructor
   *
   * @Param {MatDialogRef<AminityIonicPickerComponent>} matDialogRef
   * @Param _data 
   */
  constructor(
      public matDialogRef: MatDialogRef<AminityIonicPickerComponent>,
      @Inject(MAT_DIALOG_DATA) 
      private _data: any,
  )
  {
      // Set the defaults
      this.action = _data.action;
      this.icons = _data.icons;
      // tslint:disable-next-line: max-line-length
      this.icons = _data.icons;

      console.log(this.icons);
  }


}
