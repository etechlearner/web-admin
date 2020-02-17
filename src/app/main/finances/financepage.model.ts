import { Finance } from './finance.model';
export class FinancePage {
   
    content : Finance[];
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
     * @param FinancePage
     */
    constructor(financePage?)
    {
      
        financePage = financePage || {};
        
        this.content = financePage.content || [];
        this.totalPages = financePage.totalPages || '';
        this.totalElements = financePage.totalElements || '';
        this.last = financePage.last || '';
        this.size = financePage.size || '';
        this.first = financePage.first || '';
        this.sort = financePage.sort || '';
        this.number = financePage.number || '';
    
        
    }



}
