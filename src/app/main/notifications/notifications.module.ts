import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsListComponent } from './notifications-list/notifications-list.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth-guard.service';
import { MatTableModule, MatPaginatorModule } from '@angular/material';

const routes: Routes = [
  {
      path: 'notifications',
      component: NotificationsListComponent,
      // resolve: {
      //     data: GymService
      // },
      canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatTableModule,
    MatPaginatorModule
  ],
  declarations: [NotificationsListComponent]
})
export class NotificationsModule { }
