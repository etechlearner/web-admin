import { FuseUtils } from "@fuse/utils";

export class Authorization {
   
   
    id: string;
    name: string ;
    handle: string;
    updatedAt: string;
    createdAt: string;

   
    /**
     * Constructor
     *
     * @param Authorization
     */
    constructor(authorizations?)
    {
      
        authorizations = authorizations || {};
        if (authorizations.name !== ''){
            this.handle = FuseUtils.handleize(authorizations.name  + '');
        }
        this.id = authorizations.id || '';
        this.name = authorizations.name || '';
        this.updatedAt = authorizations.updatedAt || '';
        this.createdAt = authorizations.createdAt || '';
    }

}
