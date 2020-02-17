import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { RouterModule, Routes } from '@angular/router';
import { MatTooltipModule, MatButtonModule, MatChipsModule, MatExpansionModule, MatFormFieldModule, MatIconModule, MatInputModule, MatPaginatorModule, MatRippleModule, MatSelectModule, MatSortModule, MatSnackBarModule, MatTableModule, MatTabsModule, MatAutocompleteModule, MatMenuModule, MatDialogModule, MatCheckboxModule, MatProgressSpinnerModule, MatCardModule } from '@angular/material';
import { FuseConfirmDialogModule, FuseWidgetModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import { CustomerService } from './customer.service';
import { AuthGuard } from '../auth-guard.service';
import { CustomerViewComponent } from './customer-view/customer-view.component';
import { RefundDialogComponent } from './refund-dialog/refund-dialog.component';
import { ViewOffersComponent } from './view-offers/view-offers.component';

const routes: Routes = [
  {
    path: 'customers',
    component: CustomerListComponent,
    resolve: {
      data: CustomerService
    },
    canActivate: [AuthGuard]
  },
];


@NgModule({
  declarations: [
    CustomerListComponent,
    CustomerViewComponent,
    RefundDialogComponent,
    ViewOffersComponent
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
    MatTooltipModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatCardModule,

    FuseConfirmDialogModule,
    FuseSharedModule,
    FuseWidgetModule,
  ],
  entryComponents: [
    CustomerViewComponent,
    RefundDialogComponent,
    ViewOffersComponent
  ]
}) export class CustomersModule { }
