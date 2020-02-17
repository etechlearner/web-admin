import { FuseUtils } from "@fuse/utils";

export class Account {

    id: string;
    bank_name: string ;
    account_name: string ;
    routing_number: string ;
    account_number: string ;
    account_type: string ;
    holder_type: string ;
    handle: string;
    payout_currency: string;
    country: string;

    /**
     * Constructor
     *
     * @Param Setting
     */
    constructor(accounts?)
    {
        accounts = accounts || {};
        if (accounts.name !== ''){
            this.handle = FuseUtils.handleize(accounts.name  + '');
        }
        this.id = accounts.id || null;
        this.bank_name = accounts.bank_name || '';
        this.account_name = accounts.account_name || '';
        this.routing_number = accounts.routing_number || '';
        this.account_number = accounts.account_number || '';
        this.account_type = accounts.account_type || '';
        this.holder_type = accounts.holder_type || '';
        this.handle = accounts.handle || '';
        this.payout_currency = accounts.payout_currency || '';
        this.country = accounts.country || '';
    }
}
