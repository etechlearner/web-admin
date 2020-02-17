import { FuseUtils } from "@fuse/utils";
import { Gymuser } from "./gymuser.model";

export class Gym {


    id: string;
    name: string;
    description: string;
    profilePhoto: string;
    isActive: boolean;
    isPresale: boolean;
    address: string;
    country: string;
    state: string;
    emailAddress: string;
    phone: number;
    type: any;
    handle: string;
    nfcTag: string;
    isoCode: string;
    day: string;
    longitude: any;
    lattitude: any;
    billingCost: any;
    commission: any;
    rating: any;
    gymUser: Gymuser;
    updatedAt: string;
    createdAt: string;
    stepsCompleted?: string;
    parentGymId?: string;

    constructor(gym?) {

        gym = gym || {};
        if (gym.name !== '') {
            this.handle = FuseUtils.handleize(gym.name + '');
        }

     

        this.id = gym.id || '';
        this.name = gym.name || '';
        this.isoCode = gym.isoCode || '';

        this.description = gym.description || '';
        this.profilePhoto = gym.profilePhoto || '';
        this.isActive = gym.isActive || false;
        this.isPresale = gym.isPresale || '';
        this.address = gym.address || '';
        this.state = gym.state || '';
        this.country = gym.country || '';
        this.emailAddress = gym.emailAddress || '';
        this.phone = gym.phone || '';
        this.nfcTag = gym.nfcTag || '';
        this.gymUser = gym.gymUser || new Gymuser;
        this.day = gym.day || '';
        this.longitude = gym.longitude || '';
        this.lattitude = gym.lattitude || '';
        this.billingCost = gym.billingCost || '';
        this.commission = gym.commission || '';
        this.rating = gym.rating || '';
        this.isActive = gym.isActive || true;
        this.updatedAt = gym.updatedAt || '';
        this.createdAt = gym.createdAt || '';
        this.stepsCompleted = gym.stepsCompleted ? gym.stepsCompleted : '';
        this.parentGymId = gym.parentGymId ? gym.parentGymId : '0b8faf7e-969a-43fd-8d59-ab2ce2c707ac';
    }


}
