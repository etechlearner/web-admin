import { FuseUtils } from "@fuse/utils";

export class Aminity {
   
   
    id: string;
    name: string ;
    image: string ;
    url: string ;
    handle: string;
    updatedAt: string;
    createdAt: string;

   
    /**
     * Constructor
     *
     * @param Aminity
     */
    constructor(aminity?)
    {
      
        aminity = aminity || {};
        if (aminity.name !== ''){
            this.handle = FuseUtils.handleize(aminity.name  + '');
        }

        
        this.id = aminity.id || '';
        this.name = aminity.name || '';
        this.url = 'https://firebasestorage.googleapis.com/v0/b/dev-gymrabbit.appspot.com/o/aminities%2Ficons%2F' + aminity.image + '%403x.png?alt=media&token=b51890ad-d9aa-4db9-92ac-5b900494cb84';

        this.image = aminity.image || '';
        this.updatedAt = aminity.updatedAt || '';
        this.createdAt = aminity.createdAt || '';
    }

}
