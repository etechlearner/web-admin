import { FuseUtils } from "@fuse/utils";

export class Finance {
   
   
    id: string;
    name: string ;
    handle: string;
    updatedAt: string;
    createdAt: string;

   
    /**
     * Constructor
     *
     * @param Finance
     */
    constructor(finances?)
    {
      
        finances = finances || {};
        if (finances.name !== ''){
            this.handle = FuseUtils.handleize(finances.name  + '');
        }
        this.id = finances.id || '';
        this.name = finances.name || '';
        this.updatedAt = finances.updatedAt || '';
        this.createdAt = finances.createdAt || '';
    }

}
