import { FuseUtils } from "@fuse/utils";

export class Setting {


    id: string;
    name: string ;
    appKey: string ;
    appValue: string ;
    franchiserId: string ;
    description: string ;
    type: string ;
    handle: string;
    updatedAt: string;
    createdAt: string;

    /**
     * Constructor
     *
     * @Param Setting
     */
    constructor(settings?)
    {

        settings = settings || {};
        if (settings.name !== ''){
            this.handle = FuseUtils.handleize(settings.name  + '');
        }
        this.id = settings.id || null;
        this.name = settings.name || '';
        this.appKey = settings.appKey || '';
        this.appValue = settings.appValue || '';
        this.franchiserId = settings.franchiserId || '';
        this.description = settings.description || '';
        this.type = settings.type || '';
        this.updatedAt = settings.updatedAt || '';
        this.createdAt = settings.createdAt || '';
    }
}
