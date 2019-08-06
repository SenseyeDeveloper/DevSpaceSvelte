export default class Debounce {
    private readonly delay: number;
    private timerId: any;

    constructor(delay) {
        this.delay = delay;
        this.timerId = 0;
    }

    handle(callable: () => void) {
        clearTimeout(this.timerId);

        this.timerId = setTimeout(callable, this.delay);
    }
}
