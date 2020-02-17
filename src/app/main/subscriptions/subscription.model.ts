import { FuseUtils } from '@fuse/utils';

export class Subscription {
   
   
    id: string;
    name: string ;
    duration: string;
    type: string;
    isFree: string;
    handle: string;
    updatedAt: string;
    createdAt: string;

   
    /**
     * Constructor
     *
     * @Param Subscription
     */
    constructor(subscriptions?)
    {
      
        subscriptions = subscriptions || {};
        if (subscriptions.name !== ''){
            this.handle = FuseUtils.handleize(subscriptions.name  + '');
        }
        this.id = subscriptions.id || '';
        this.isFree = subscriptions.isFree || false;
        this.name = subscriptions.name || '';
        this.type = subscriptions.type || '';
        this.duration = subscriptions.duration || '';
        this.updatedAt = subscriptions.updatedAt || '';
        this.createdAt = subscriptions.createdAt || '';
    }

}
