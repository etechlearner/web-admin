import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute } from '@angular/router';
import { playStoreLink } from '../../../../environments/environment';
import { appStoreLink } from '../../../../environments/environment';

@Component({
    selector: 'promo-code',
    templateUrl: './promo-code.component.html',
    styleUrls: ['./promo-code.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class PromoCodeComponent implements OnInit {
    promoCodeForm: FormGroup;
    promoCode: String;

    /**
     * Constructor
     *
     * @Param {FuseConfigService} _fuseConfigService
     * @Param {FormBuilder} _formBuilder
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private router: ActivatedRoute
    ) {
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                toolbar: {
                    hidden: true
                },
                footer: {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.promoCode = this.router.snapshot.paramMap.get('id');
        this.promoCodeForm = this._formBuilder.group({
            email: [this.promoCode, Validators.required
            ]
        });

    }
    /* To copy Text from Textbox */
    copyInputMessage = (inputElement): void => {
        inputElement.select();
        document.execCommand('copy');
        inputElement.setSelectionRange(0, 0);
    }

    goToAppStore() {
        window.open(appStoreLink, '_blank');
    }

    goToPlayStore() {
        window.open(playStoreLink, '_blank');
    }
}
