import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AminityListComponent } from './aminity-list/aminity-list.component';
import { RouterModule, Routes } from '@angular/router';
import * as material from '@angular/material';
import { FuseConfirmDialogModule, FuseWidgetModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import { AminityService } from './aminity.service';
import { AminityComponent } from './aminity/aminity.component';
import { FileValueAccessor } from './file-control-value-accessor';
import { FileValidator } from './file-input.validator';
import { AminityIonicPickerComponent } from './aminity-ionic-picker/aminity-ionic-picker.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthGuard } from '../auth-guard.service';

const routes: Routes = [
  {
    path: 'aminities',
    component: AminityListComponent,
    resolve: {
      data: AminityService
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'aminities/:id',
    component: AminityComponent,
    resolve: {
      data: AminityService
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'aminities/:id/:handle',
    component: AminityComponent,
    canActivate: [AuthGuard],
    resolve: {
      data: AminityService
    },
  }
];


@NgModule({
  declarations: [AminityListComponent, AminityComponent,
    FileValueAccessor,
    FileValidator,
    AminityIonicPickerComponent,
    AminityIonicPickerComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    material.MatButtonModule,
    material.MatChipsModule,
    material.MatExpansionModule,
    material.MatFormFieldModule,
    material.MatIconModule,
    material.MatInputModule,
    material.MatPaginatorModule,
    material.MatRippleModule,
    material.MatSelectModule,
    material.MatSortModule,
    material.MatSnackBarModule,
    material.MatTableModule,
    material.MatTabsModule,
    material.MatAutocompleteModule,
    material.MatMenuModule,
    material.MatDialogModule,
    material.MatProgressBarModule,

    FuseConfirmDialogModule,
    FuseSharedModule,
    FuseWidgetModule
  ],
  providers: [
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: [] }
  ],
  exports: [AminityIonicPickerComponent],
  entryComponents: [
    AminityIonicPickerComponent
  ]
}) export class AminitiesModule { }
