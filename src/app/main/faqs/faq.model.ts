import { FuseUtils } from "@fuse/utils";

export class Faq {
   
   
    id: string;
    name: string ;
    question: string ;
    answer: string ;
    handle: string;
    updatedAt: string;
    createdAt: string;

   
    /**
     * Constructor
     *
     * @Param Faq
     */
    constructor(faq?)
    {
      
        faq = faq || {};
        if (faq.name !== ''){
            this.handle = FuseUtils.handleize(faq.name  + '');
        }
        this.id = faq.id || '';
        this.question = faq.question || '';
        this.answer = faq.answer || '';
        this.updatedAt = faq.updatedAt || '';
        this.createdAt = faq.createdAt || '';
    }

}
