import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthorizationListComponent} from './authorization-list/authorization-list.component';
import {RouterModule, Routes} from '@angular/router';
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
    MatCheckboxModule
} from '@angular/material';
import {FuseConfirmDialogModule, FuseWidgetModule} from '@fuse/components';
import {FuseSharedModule} from '@fuse/shared.module';
import {AuthorizationService} from './authorization.service';
import {AuthorizationComponent} from './authorization/authorization.component';
import {ResetPasswordModule} from './reset-password/reset-password.module';
import {PromoCodeModule} from './promo-code/promo-code.module';

const routes: Routes = [
    {
        path: 'authorizations',
        component: AuthorizationListComponent,
        resolve: {
            data: AuthorizationService
        }
    },
    {
        path: 'authorizations/:id',
        component: AuthorizationComponent,
        resolve: {
            data: AuthorizationService
        }

    },
    {
        path: 'authorizations/:id/:handle',
        component: AuthorizationComponent,
        resolve: {
            data: AuthorizationService
        }

    }
];


@NgModule({
    declarations: [AuthorizationListComponent, AuthorizationComponent],
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
        ResetPasswordModule,
        PromoCodeModule,
        FuseConfirmDialogModule,
        FuseSharedModule,
        FuseWidgetModule
    ],
    providers: [
        AuthorizationService
    ]
})
export class AuthorizationsModule {
}
