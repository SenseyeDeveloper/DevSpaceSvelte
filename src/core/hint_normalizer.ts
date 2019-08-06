interface Hint {
    readonly name: string;
}

export default function normalize(items: Array<Hint>): Array<string> {
    const length = items.length;

    const result = new Array<string>(length);

    for (let i = 0; i < length; i++) {
        const item = items[i];

        result[i] = item.name.toLowerCase();
    }

    return result;
}