import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinanceListComponent } from './finance-list/finance-list.component';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule, MatChipsModule, MatExpansionModule, MatDatepickerModule, MatFormFieldModule, MatIconModule, MatInputModule, MatPaginatorModule, MatRippleModule, MatSelectModule, MatSortModule, MatSnackBarModule, MatTableModule, MatTabsModule, MatAutocompleteModule, MatMenuModule, MatDialogModule, MatCheckboxModule, MatCardModule, MatProgressSpinnerModule } from '@angular/material';
import { FuseConfirmDialogModule, FuseWidgetModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import { FinanceService } from './finance.service';
import { AuthGuard } from '../auth-guard.service';
import { SendEmailComponent } from './send-email/send-email.component';
import { ClearingComponent } from './clearing/clearing.component';
import { GymDetailViewComponent } from './gym-view/gym-view.component';
import { FinanceViewComponent } from './finance-view/finance-view.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { OffersCountComponent } from './offers-count/offers-count.component';

const routes: Routes = [
  {
    path: 'finances',
    component: FinanceListComponent,
    resolve: {
      data: FinanceService
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'finances/:id',
    component: FinanceViewComponent,
    resolve: {
      data: FinanceService
    },
    canActivate: [AuthGuard]
  }
];


@NgModule({
  declarations: [
    FinanceListComponent, 
    SendEmailComponent, 
    ClearingComponent,
    GymDetailViewComponent,
    FinanceViewComponent,
    OffersCountComponent
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
    MatCardModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,

    FuseConfirmDialogModule,
    FuseSharedModule,
    FuseWidgetModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  entryComponents: [
    SendEmailComponent, 
    ClearingComponent,
    GymDetailViewComponent,
    OffersCountComponent
  ]
}) export class FinancesModule { }
