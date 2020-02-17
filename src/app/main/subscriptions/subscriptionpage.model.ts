import { Subscription } from './subscription.model';
export class SubscriptionPage {
   
    content : Subscription[];
    totalPages : number;
    totalElements : number;
    last : string;
    size : number ;
    first : string ;
    sort : string ;
    number : number ;
    next : string ;
    


 
    /**
     * Constructor
     *
     * @param SubscriptionPage
     */
    constructor(subscriptionPage?)
    {
      
        subscriptionPage = subscriptionPage || {};
        
        this.content = subscriptionPage.content || [];
        this.totalPages = subscriptionPage.totalPages || '';
        this.totalElements = subscriptionPage.totalElements || '';
        this.last = subscriptionPage.last || '';
        this.size = subscriptionPage.size || '';
        this.first = subscriptionPage.first || '';
        this.sort = subscriptionPage.sort || '';
        this.number = subscriptionPage.number || '';
    
        
    }



}
