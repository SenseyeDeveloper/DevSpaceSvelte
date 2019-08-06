import {Location} from "./location";

export class Company {
    constructor(
        public readonly alias: string,
        public readonly name: string,
        public readonly offices: Array<Office>,
        public readonly vacancies: Array<Vacancy>,
        public readonly review_count: number,
        public readonly employee_count: string,
        public readonly type: number,
        public readonly top50Largest: boolean,
        public readonly photoExists: boolean,
    ) {
    }
}

export class City {
    constructor(
        public readonly alias: string,
        public readonly name: string,
    ) {

    }
}

export class Office {
    constructor(
        public readonly city: City,
        public readonly address: string,
        public readonly location: Location,
    ) {
    }
}

export class Vacancy {
    constructor(
        public readonly id: number,
        public readonly title: string,
        public readonly titleIndex: number,
        public readonly cities: Array<City>,
        public readonly existsOffice: boolean,
        public readonly salary: string,
        public readonly published: string,
    ) {
    }
}