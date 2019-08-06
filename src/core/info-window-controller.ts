export default class InfoWindowController {
    private list: Array<any>;
    private maxSize: number;

    constructor(maxSize) {
        this.list = [];
        this.maxSize = maxSize;
    }

    public add(infoWindow: any) {
        this.list.push(infoWindow);

        if (this.list.length > this.maxSize) {
            this.list.shift().close();
        }
    }

    public clear() {
        this.list = [];
    }

    public close() {
        for (let i = 0; i < this.list.length; i++) {
            const info = this.list[i];

            info.close();
        }

        this.clear();
    }
}