import { FuseUtils } from "@fuse/utils";

export class Customer {
   
   
    id: string;
    name: string ;
    handle: string;
    updatedAt: string;
    createdAt: string;

   
    /**
     * Constructor
     *
     * @param Customer
     */
    constructor(customers?)
    {
      
        customers = customers || {};
        if (customers.name !== ''){
            this.handle = FuseUtils.handleize(customers.name  + '');
        }
        this.id = customers.id || '';
        this.name = customers.name || '';
        this.updatedAt = customers.updatedAt || '';
        this.createdAt = customers.createdAt || '';
    }

}
