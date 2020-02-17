import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamListComponent } from './team-list/team-list.component';
import { RouterModule, Routes } from '@angular/router';
import {
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
    MatToolbarModule,
    MatCheckboxModule
} from '@angular/material';
import { FuseConfirmDialogModule, FuseWidgetModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import { TeamService } from './team.service';
import { TeamComponent } from './team/team.component';
import { TeamChangepasswordComponent } from './team-changepassword/team-changepassword.component';
import { AuthGuard } from '../auth-guard.service';

const routes: Routes = [
    {
        path: 'teams',
        component: TeamListComponent,
        resolve: {
            data: TeamService
        },
        canActivate: [AuthGuard]
    },
    {
        path: 'teams/:id',
        component: TeamComponent,
        resolve: {
            data: TeamService
        },
        canActivate: [AuthGuard]
    },
    {
        path: 'teams/edit/:id',
        component: TeamComponent,
        resolve: {
            data: TeamService
        },
        canActivate: [AuthGuard]
    },
    {
        path: 'teams/:changepassword/:id',
        component: TeamChangepasswordComponent,
        resolve: {
            data: TeamService
        },
        canActivate: [AuthGuard]
    }
];


@NgModule({
    declarations: [
        TeamListComponent,
        TeamComponent,
        TeamChangepasswordComponent,
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
        MatToolbarModule,
        MatCheckboxModule,

        FuseConfirmDialogModule,
        FuseSharedModule,
        FuseWidgetModule
    ],
})
export class TeamsModule {
}
