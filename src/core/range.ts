export default class Range {
    constructor(
        public readonly from: number,
        public readonly to: number,
    ) {
    }

    equals(range: Range): boolean {
        return this.from === range.from && this.to === range.to;
    }

    great(range: Range): boolean {
        return (range.to > 0 && this.to >= range.to) || (this.from > 0 && this.from >= range.from);
    }
}