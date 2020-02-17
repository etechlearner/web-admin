import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionListComponent } from './subscription-list/subscription-list.component';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule, MatChipsModule, MatExpansionModule, MatFormFieldModule, MatIconModule, MatInputModule, MatPaginatorModule, MatRippleModule, MatSelectModule, MatSortModule, MatSnackBarModule, MatTableModule, MatTabsModule, MatAutocompleteModule, MatMenuModule, MatDialogModule, MatCheckboxModule } from '@angular/material';
import { FuseConfirmDialogModule, FuseWidgetModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import { SubscriptionService } from './subscription.service';
import { SubscriptionComponent } from './subscription/subscription.component';
import { AuthGuard } from '../auth-guard.service';

const routes: Routes = [
  {
      path     : 'subscriptions',
      component: SubscriptionListComponent,
      resolve  : {
          data: SubscriptionService
      },
      canActivate: [AuthGuard]
  },
  {
      path     : 'subscriptions/:id',
      component: SubscriptionComponent,
      resolve  : {
          data: SubscriptionService
      },
      canActivate: [AuthGuard]
      
  },
  {
      path     : 'subscriptions/:id/:handle',
      component: SubscriptionComponent,
      resolve  : {
          data: SubscriptionService
      },
      canActivate: [AuthGuard]
     
  }
];


@NgModule({
  declarations: [SubscriptionListComponent, SubscriptionComponent],
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


        FuseConfirmDialogModule,
        FuseSharedModule,
        FuseWidgetModule,
        MatCheckboxModule
    ]
})export class SubscriptionsModule { }
