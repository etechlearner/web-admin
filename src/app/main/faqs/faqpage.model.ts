import { Faq } from './faq.model';
export class FaqPage {
   
    content : Faq[];
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
     * @param FaqPage
     */
    constructor(faqPage?)
    {
      
        faqPage = faqPage || {};
        
        this.content = faqPage.content || [];
        this.totalPages = faqPage.totalPages || '';
        this.totalElements = faqPage.totalElements || '';
        this.last = faqPage.last || '';
        this.size = faqPage.size || '';
        this.first = faqPage.first || '';
        this.sort = faqPage.sort || '';
        this.number = faqPage.number || '';
    
        
    }



}
