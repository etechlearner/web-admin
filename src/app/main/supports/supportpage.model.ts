import { Support } from './support.model';
export class SupportPage {
   
    content : Support[];
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
     * @param SupportPage
     */
    constructor(supportPage?)
    {
      
        supportPage = supportPage || {};
        
        this.content = supportPage.content || [];
        this.totalPages = supportPage.totalPages || '';
        this.totalElements = supportPage.totalElements || '';
        this.last = supportPage.last || '';
        this.size = supportPage.size || '';
        this.first = supportPage.first || '';
        this.sort = supportPage.sort || '';
        this.number = supportPage.number || '';
    
        
    }



}
