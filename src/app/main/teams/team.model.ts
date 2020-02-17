import { FuseUtils } from "@fuse/utils";

export class Team {
   
   
    id: string;
    name: string ;
    handle: string;
    updatedAt: string;
    createdAt: string;

   
    /**
     * Constructor
     *
     * @param Team
     */
    constructor(teams?)
    {
      
        teams = teams || {};
        if (teams.name !== ''){
            this.handle = FuseUtils.handleize(teams.name  + '');
        }
        this.id = teams.id || '';
        this.name = teams.name || '';
        this.updatedAt = teams.updatedAt || '';
        this.createdAt = teams.createdAt || '';
    }

}
