import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule } from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseCountdownModule } from '@fuse/components';
import {PromoCodeComponent} from './promo-code.component';



const routes = [
    {
        path     : 'promo-code/:id',
        component: PromoCodeComponent
    }
];

@NgModule({
    declarations: [
        PromoCodeComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,

        FuseSharedModule,
        FuseCountdownModule
    ]
})
export class PromoCodeModule
{
}
