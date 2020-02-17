import { Team } from './team.model';
export class TeamPage {
   
    content : Team[];
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
     * @param TeamPage
     */
    constructor(teamPage?)
    {
      
        teamPage = teamPage || {};
        
        this.content = teamPage.content || [];
        this.totalPages = teamPage.totalPages || '';
        this.totalElements = teamPage.totalElements || '';
        this.last = teamPage.last || '';
        this.size = teamPage.size || '';
        this.first = teamPage.first || '';
        this.sort = teamPage.sort || '';
        this.number = teamPage.number || '';
    
        
    }



}
