import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule } from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';
import { ResetPasswordComponent } from './reset-password.component';
// import { AppRoutingModule } from 'app/app-routing.module';
import { AuthorizationService } from '../authorization.service';


const routes = [
    {
        path     : 'auth/reset-password/:id',
        component: ResetPasswordComponent,
        resolve  : {
            data: AuthorizationService
        }
    },
    {
        path     : 'auth/reset-password',
        component: ResetPasswordComponent,
        resolve  : {
            data: AuthorizationService
        }
    }
];

@NgModule({
    declarations: [
        ResetPasswordComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,

        FuseSharedModule
    ]

})
export class ResetPasswordModule
{
}
