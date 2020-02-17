import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule } from '@angular/material';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { FuseSharedModule } from '@fuse/shared.module';

import { LoginComponent } from 'app/main/login/login.component';
import { LoginService } from './login.service';
import { AuthGuard } from '../auth-guard.service';

const routes = [
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: '',
        component: LoginComponent,
    },
];

@NgModule({
    declarations: [
        LoginComponent
    ],
    imports: [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSnackBarModule,

        FuseSharedModule
    ],
    providers: [LoginService]
})
export class LoginModule {
}
