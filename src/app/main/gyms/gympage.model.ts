import { Gym } from './gym.model';
export class GymPage {
   
    content : Gym[];
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
     * @param GymPage
     */
    constructor(gymPage?)
    {
      
        gymPage = gymPage || {};
        
        this.content = gymPage.content || [];
        this.totalPages = gymPage.totalPages || '';
        this.totalElements = gymPage.totalElements || '';
        this.last = gymPage.last || '';
        this.size = gymPage.size || '';
        this.first = gymPage.first || '';
        this.sort = gymPage.sort || '';
        this.number = gymPage.number || '';
    
        
    }



}
