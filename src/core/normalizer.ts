const regexMap = {
    "front-end": ["front end", "frontend"],
    "back-end": ["back end", "backend"],
    "golang": ["go"],

    "javascript": ["js"],

    // hack to skip javascript
    "javajava": ["java"],
};

const cyrillicMap = {
    "designer": ["дизайнер"],
    "developer": ["разработчик", "розробник", "программист", "програміст"],
    "system administrator": ["системний адміністратор", "системный администратор"],
};

let aggregationDataProvider: AggregationDataProvider = null;

function setAggregationDataProvider(value: AggregationDataProvider) {
    aggregationDataProvider = value;
}

class Synonym {
    constructor(
        public readonly synonym: string,
        public readonly regexp: RegExp,
    ) {
    }
}

class RegexReplace {
    constructor(
        public readonly original: string,
        public readonly synonyms: Array<Synonym>,
    ) {
    }
}

class CyrillicReplace {
    constructor(
        public readonly original: string,
        public readonly synonyms: Array<string>,
    ) {
    }
}

function regexPrepare(map): Array<RegexReplace> {
    const result = [];

    for (let original in map) {
        if (map.hasOwnProperty(original)) {
            const synonyms = map[original];

            const regexps = new Array(synonyms.length);

            for (let i = 0; i < synonyms.length; i++) {
                const synonym = synonyms[i];

                regexps[i] = new Synonym(synonym, new RegExp(`\\b${synonym}\\b`, 'g'));
            }

            result.push(new RegexReplace(original, regexps));
        }
    }

    return result;
}

function cyrillicPrepare(map): Array<CyrillicReplace> {
    const result = [];

    for (let original in map) {
        if (map.hasOwnProperty(original)) {
            const synonyms = map[original];

            result.push(new CyrillicReplace(original, synonyms));
        }
    }

    return result;
}

const regexReplaces = regexPrepare(regexMap);

function regexNormalize(s: string): string {
    let result = s;

    for (let i = 0; i < regexReplaces.length; i++) {
        const replace = regexReplaces[i];

        for (let j = 0; j < replace.synonyms.length; j++) {
            const synonym = replace.synonyms[j];

            if (result.indexOf(synonym.synonym) !== -1) {
                result = result.replace(synonym.regexp, `$1${replace.original}`);
            }
        }
    }

    return result;
}

const cyrillicReplaces = cyrillicPrepare(cyrillicMap);

function cyrillicNormalize(s: string): string {
    let result = s;

    for (let i = 0; i < cyrillicReplaces.length; i++) {
        const replace = cyrillicReplaces[i];

        for (let j = 0; j < replace.synonyms.length; j++) {
            const synonym = replace.synonyms[j];

            if (result.indexOf(synonym) !== -1) {
                result = result.replace(synonym, replace.original);
            }
        }
    }

    return result;
}

// https://stackoverflow.com/questions/32240675/javascript-regex-to-replace-a-whole-word
// var str = "@devtest11 @devtest1";str.replace(/(\s*)@devtest1\b/g, "$1aaaa");
function normalize(s: string): string {
    return cyrillicNormalize(regexNormalize(s));
}

export class Aggregation {
    constructor(
        public readonly index: number,
        public readonly source: string,
        public readonly normalize: string,
    ) {
    }
}

class AggregationDataProvider {
    private readonly provider: Array<Aggregation>;
    private readonly indexBuffer: Array<number>;
    private readonly hintBuffer: Array<string>;

    constructor(provider: Array<Aggregation>) {
        this.provider = provider;
        this.indexBuffer = new Array<number>(provider.length);
        this.hintBuffer = new Array<string>(provider.length);
    }

    indexes(s: string): Array<number> {
        const source = normalize(s.toLowerCase());
        // for use once allocated memory
        const result = this.indexBuffer;
        let shift = 0;

        for (let i = 0; i < this.provider.length; i++) {
            const aggregation = this.provider[i];
            if (aggregation.normalize.indexOf(source) !== -1) {
                result[shift] = aggregation.index;
                shift += 1;
            }
        }

        // allocated once by limit
        return result.slice(0, shift);
    }

    hints(s: string): Array<string> {
        const source = normalize(s.toLowerCase());
        // for use once allocated memory
        const result = this.hintBuffer;
        let shift = 0;

        for (let i = 0; i < this.provider.length; i++) {
            const aggregation = this.provider[i];
            if (aggregation.normalize.indexOf(source) !== -1) {
                result[shift] = aggregation.source;
                shift += 1;
            }
        }

        // allocated once by limit
        return result.slice(0, shift);
    }
}

class RuntimeAggregation {
    private readonly index: number;
    private readonly normalize: string;
    private count: number;
    private sources: Array<string>;

    constructor(index: number, normalize: string, source: string) {
        this.index = index;
        this.normalize = normalize;
        this.sources = [source];
        this.count = 1;
    }

    getIndex() {
        return this.index;
    }

    getCount() {
        return this.count;
    }

    add(source: string) {
        this.sources.push(source);
        this.count += 1;
    }

    solve(): Aggregation {
        const count = this.count;

        let topSource = "";

        if (count === 1 || count === 2) {
            topSource = this.sources[0];
        } else {
            const map = {};
            let max = 0;

            for (let i = 0; i < count; i++) {
                const source = this.sources[i];

                let next = 1;
                if (map.hasOwnProperty(source)) {
                    next = map[source] + 1;
                }

                map[source] = next;
                if (next > max) {
                    max = next;
                    topSource = source;
                }
            }
        }

        return new Aggregation(this.index, topSource, this.normalize);
    }
}

export class NormalizeService {
    private readonly sourceToNormalize: { [s: string]: string };
    private readonly normalizeToAggregation: { [s: string]: RuntimeAggregation };
    private increment: number;

    constructor() {
        this.sourceToNormalize = {};
        this.normalizeToAggregation = {};
        this.increment = 0;
    }

    index(source: string): number {
        const normalize = this.normalize(source.toLowerCase());

        if (this.normalizeToAggregation.hasOwnProperty(normalize)) {
            const result = this.normalizeToAggregation[normalize];

            result.add(source);

            return result.getIndex();
        }

        this.increment += 1;

        this.normalizeToAggregation[normalize] = new RuntimeAggregation(this.increment, normalize, source);

        return this.increment;
    }

    store() {
        setAggregationDataProvider(new AggregationDataProvider(this.build()));
    }

    private build(): Array<Aggregation> {
        const length = this.increment;

        const runtimeAggregationList = new Array<RuntimeAggregation>(length);

        let i = 0;
        for (let normalize in this.normalizeToAggregation) {
            runtimeAggregationList[i] = this.normalizeToAggregation[normalize];
            i += 1;
        }

        runtimeAggregationList.sort(function (a, b) {
            return b.getCount() - a.getCount();
        });

        const result = new Array<Aggregation>(length);
        for (let i = 0; i < length; i++) {
            result[i] = runtimeAggregationList[i].solve();
        }
        return result;
    }

    private normalize(s: string): string {
        if (this.sourceToNormalize.hasOwnProperty(s)) {
            return this.sourceToNormalize[s];
        }

        const result = normalize(s);

        this.sourceToNormalize[s] = result;

        return result;
    }
}

export function dataProviderIndexes(s: string): Array<number> {
    return aggregationDataProvider.indexes(s);
}

export function dataProviderHints(s: string): Array<string> {
    return aggregationDataProvider.hints(s);
}
