import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GymListComponent } from './gym-list/gym-list.component';
import { RouterModule, Routes } from '@angular/router';
import * as material from '@angular/material';
import { FuseConfirmDialogModule, FuseWidgetModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import { GymService } from './gym.service';
import { GymComponent } from './gym/gym.component';
import { GymViewComponent } from './gym-view/gym-view.component';
import { MatDialogRef, MAT_DIALOG_DATA, MatToolbarModule, MatProgressSpinnerModule } from '@angular/material';
import { GymEditSubscriptionComponent } from './gym-edit-subscription/gym-edit-subscription.component';
import { UserbyroleFormDialogComponent } from '../teams/userbyrole-form/userbyrole-form.component';
import { AuthGuard } from '../auth-guard.service';
import { InterceptorService } from '../interceptor.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService } from '../auth.service';

const routes: Routes = [
    {
        path: 'gyms',
        component: GymListComponent,
        resolve: {
            data: GymService
        },
        canActivate: [AuthGuard]
    },
    {
        path: 'gyms/:id',
        component: GymComponent,
        resolve: {
            data: GymService
        },
        canActivate: [AuthGuard]

    },
    {
        path: 'gyms/:id/:handle',
        component: GymComponent,
        resolve: {
            data: GymService
        },
        canActivate: [AuthGuard]

    }
    ,
    {
        path: 'gyms/:editcom/:id/:handle',
        component: GymEditSubscriptionComponent,
        resolve: {
            data: GymService
        },
        canActivate: [AuthGuard]

    }
];


@NgModule({
    declarations: [
        GymListComponent,
        GymComponent,
        GymViewComponent,
        GymEditSubscriptionComponent,
        UserbyroleFormDialogComponent,
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
        material.MatSlideToggleModule,
        material.MatTooltipModule,
        MatProgressSpinnerModule,
        MatToolbarModule,
        FuseConfirmDialogModule,
        FuseSharedModule,
        FuseWidgetModule
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: InterceptorService,
            multi: true
        },
        AuthGuard,
        AuthService,
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: [] }
    ],
    exports: [
        GymViewComponent,
    ],
    entryComponents: [
        GymViewComponent, UserbyroleFormDialogComponent
    ],
})
export class GymsModule {
}



