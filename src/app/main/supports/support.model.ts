import { FuseUtils } from "@fuse/utils";

export class Support {
   
   
    id: string;
    name: string ;
    handle: string;
    updatedAt: string;
    createdAt: string;

   
    /**
     * Constructor
     *
     * @param Support
     */
    constructor(supports?)
    {
      
        supports = supports || {};
        if (supports.name !== ''){
            this.handle = FuseUtils.handleize(supports.name  + '');
        }
        this.id = supports.id || '';
        this.name = supports.name || '';
        this.updatedAt = supports.updatedAt || '';
        this.createdAt = supports.createdAt || '';
    }

}
