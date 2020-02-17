import { Authorization } from './authorization.model';
export class AuthorizationPage {
   
    content : Authorization[];
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
     * @param AuthorizationPage
     */
    constructor(authorizationPage?)
    {
      
        authorizationPage = authorizationPage || {};
        
        this.content = authorizationPage.content || [];
        this.totalPages = authorizationPage.totalPages || '';
        this.totalElements = authorizationPage.totalElements || '';
        this.last = authorizationPage.last || '';
        this.size = authorizationPage.size || '';
        this.first = authorizationPage.first || '';
        this.sort = authorizationPage.sort || '';
        this.number = authorizationPage.number || '';
    
        
    }



}
