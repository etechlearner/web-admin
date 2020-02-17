import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupportListComponent } from './support-list/support-list.component';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule, MatChipsModule, MatExpansionModule, MatFormFieldModule, MatIconModule, MatInputModule, MatPaginatorModule, MatRippleModule, MatSelectModule, MatSortModule, MatSnackBarModule, MatTableModule, MatTabsModule, MatAutocompleteModule, MatMenuModule, MatDialogModule, MatCheckboxModule } from '@angular/material';
import { FuseConfirmDialogModule, FuseWidgetModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import { SupportService } from './support.service';
import { AuthGuard } from '../auth-guard.service';
import { SupportReplyComponent } from './support-reply/support-reply.component';

const routes: Routes = [
  {
    path: 'supports',
    component: SupportListComponent,
    resolve: {
      data: SupportService
    },
    canActivate: [AuthGuard]
  },
];


@NgModule({
  declarations: [
    SupportListComponent,
    SupportReplyComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    MatChipsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatRippleModule,
    MatSelectModule,
    MatSortModule,
    MatSnackBarModule,
    MatTableModule,
    MatTabsModule,
    MatAutocompleteModule,
    MatMenuModule,
    MatDialogModule,
    MatTabsModule,


    FuseConfirmDialogModule,
    FuseSharedModule,
    FuseWidgetModule
  ],
  entryComponents: [
    SupportReplyComponent
  ]
}) export class SupportsModule { }
