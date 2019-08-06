import {CriteriaConverter, RangeCriteriaConverter} from "./criteria-converter";
import Range from "./range";
import solveSalaryRange from "./salary_range";

export default class SalaryRangeCriteriaConverter implements CriteriaConverter {
    private readonly range: RangeCriteriaConverter;

    constructor() {
        this.range = new RangeCriteriaConverter();
    }

    unmarshal(data): Range {
        return solveSalaryRange(this.range.unmarshal(data));
    }

    marshal(data: any): string {
        return this.range.marshal(data);
    }
}