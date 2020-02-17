import { FuseUtils } from "@fuse/utils";

export class Gymuser {


    id: string;
    authId: string;
    name: string;
    email: string;
    phone: number;
    handle: string;
    nfcTag: string;
    isoCode: string;
    type: string;
    rewardCode: string;
    referralCode: string;
    address: string;
    image: string;
    password: string;
    updatedAt: string;
    createdAt: string;





    /**
     * Constructor
     *
     * @Param Gymuser
     */
    constructor(gymuser?) {
        gymuser = gymuser || {};
        if (gymuser.name !== '') {
            this.handle = FuseUtils.handleize(gymuser.name + '');
        }
        this.id = gymuser.id || '';
        this.authId = gymuser.authId || '';
        this.email = gymuser.email || '';
        this.name = gymuser.name || '';
        this.type = gymuser.type || '';
        this.isoCode = gymuser.isoCode || '';
        this.phone = gymuser.phone || '';
        this.nfcTag = gymuser.nfcTag || '';
        this.rewardCode = gymuser.rewardCode || '';
        this.password = gymuser.password || '';
        this.referralCode = gymuser.referralCode || '';
        this.address = gymuser.address || '';
        this.image = gymuser.image || '';
        this.updatedAt = gymuser.updatedAt || '';
        this.createdAt = gymuser.createdAt || '';

    }

}
