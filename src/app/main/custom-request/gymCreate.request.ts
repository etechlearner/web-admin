import { Gym } from '../gyms/gym.model';

export class GymCreate {


    gym: Gym;
    gymUser: string;

    /**
     * Constructor
     *
     * @Param GymCreate
     */
    constructor(gymcreate?) {

        gymcreate = gymcreate || {};
        this.gym = gymcreate.gym || '';
        this.gymUser = gymcreate.gymUser || '';
    }

}
