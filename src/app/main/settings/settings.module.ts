import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
// tslint:disable-next-line:max-line-length
import { MatButtonModule, MatChipsModule, MatExpansionModule, MatFormFieldModule, MatIconModule, MatInputModule, MatPaginatorModule, MatRippleModule, MatSelectModule, MatSortModule, MatSnackBarModule, MatTableModule, MatTabsModule, MatAutocompleteModule, MatMenuModule, MatDialogModule, MatCheckboxModule } from '@angular/material';
import { FuseConfirmDialogModule, FuseWidgetModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import { SettingService } from './setting.service';
import { SettingComponent } from './setting/setting.component';
import { SettingOffersComponent } from './setting-offers/setting-offers.component';
import { SettingDefaultComponent } from './setting-default/setting-default.component';
import { RichTextEditorModule } from '@syncfusion/ej2-angular-richtexteditor';
import { GymsModule } from '../gyms/gyms.module';
import { SettingPageComponent } from './setting-page/setting-page.component';
import { SettingAccountComponent } from './setting-account/setting-account.component';
import { AuthGuard } from '../auth-guard.service';

const routes: Routes = [
    {
        path: 'settings/offers/:id',
        component: SettingOffersComponent,
        resolve: {
            data: SettingService
        },
        canActivate: [AuthGuard]

    },
    {
        path: 'settings/default/:id',
        component: SettingDefaultComponent,
        resolve: {
            data: SettingService
        },
        canActivate: [AuthGuard]

    },
    {
        path: 'settings/page/:id',
        component: SettingPageComponent,
        resolve: {
            data: SettingService
        },
        canActivate: [AuthGuard]

    },
    {
        path: 'settings/:page/:id',
        component: SettingAccountComponent,
        resolve: {
            data: SettingService
        },
        canActivate: [AuthGuard]
    },
    {
        path: 'settings/:id/:handle',
        component: SettingComponent,
        resolve: {
            data: SettingService
        },
        canActivate: [AuthGuard]

    }
];


@NgModule({
    declarations: [
        SettingComponent,
        SettingOffersComponent,
        SettingDefaultComponent,
        SettingPageComponent,
        SettingAccountComponent
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
        RichTextEditorModule,

        FuseConfirmDialogModule,
        FuseSharedModule,
        FuseWidgetModule,
        GymsModule
    ]
}) export class SettingsModule { }
