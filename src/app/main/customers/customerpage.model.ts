import { Customer } from './customer.model';
export class CustomerPage {
   
    content : Customer[];
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
     * @param CustomerPage
     */
    constructor(customerPage?)
    {
      
        customerPage = customerPage || {};
        
        this.content = customerPage.content || [];
        this.totalPages = customerPage.totalPages || '';
        this.totalElements = customerPage.totalElements || '';
        this.last = customerPage.last || '';
        this.size = customerPage.size || '';
        this.first = customerPage.first || '';
        this.sort = customerPage.sort || '';
        this.number = customerPage.number || '';
    
        
    }



}
