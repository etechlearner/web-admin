import { Setting } from './setting.model';
export class SettingPage {
   
    content: Setting[];
    totalPages: number;
    totalElements: number;
    last: string;
    size: number ;
    first: string ;
    sort: string ;
    number: number ;
    next: string ;
    


 
    /**
     * Constructor
     *
     * @param SettingPage
     */
    constructor(settingPage?)
    {
      
        settingPage = settingPage || {};
        
        this.content = settingPage.content || [];
        this.totalPages = settingPage.totalPages || '';
        this.totalElements = settingPage.totalElements || '';
        this.last = settingPage.last || '';
        this.size = settingPage.size || '';
        this.first = settingPage.first || '';
        this.sort = settingPage.sort || '';
        this.number = settingPage.number || '';
    
        
    }



}
