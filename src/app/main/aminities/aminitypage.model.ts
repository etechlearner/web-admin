import { Aminity } from './aminity.model';
export class AminityPage {

    content: Aminity[];
    totalPages: number;
    totalElements: number;
    last: string;
    size: number;
    first: string;
    sort: string;
    number: number;
    next: string;

    constructor(aminityPage?) {
        aminityPage = aminityPage || {};

        this.content = aminityPage.content.map((icon) => new Aminity(icon)) || [];
        this.totalPages = aminityPage.totalPages || '';
        this.totalElements = aminityPage.totalElements || '';
        this.last = aminityPage.last || '';
        this.size = aminityPage.size || '';
        this.first = aminityPage.first || '';
        this.sort = aminityPage.sort || '';
        this.number = aminityPage.number || '';
    }
}
