import { FuseUtils } from "@fuse/utils";

export class AminityIcon {
   
   
    id: string;
    name: string ;
    handle: string;

   
    /**
     * Constructor
     *
     * @Param AminityIcon
     */
    constructor(aminityicon?)
    {
      
        aminityicon = aminityicon || {};
        if (aminityicon.name !== ''){
            // tslint:disable-next-line: max-line-length
            this.handle = 'https://firebasestorage.googleapis.com/v0/b/dev-gymrabbit.appspot.com/o/aminities%2Ficons%2F' + aminityicon.name + '%403x.png?alt=media&token=b51890ad-d9aa-4db9-92ac-5b900494cb84';
        }
        this.id = aminityicon.id || '';
        this.name = aminityicon.name || '';
         }

}
