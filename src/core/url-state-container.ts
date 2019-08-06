import {Location} from "./location"
import Debounce from "./debounce"
import {CriteriaConverter} from "./criteria-converter"

const SEARCH_QUERY_CENTER = "center";

export default class UrlStateContainer {
    private center: Location;
    private zoom: number;
    private debounce: Debounce;
    private lazyUpdateHandler: () => void;
    private criteriaMap: { [s: string]: any; };
    private criteria: string;
    private criteriaNameConverterMap: { [s: string]: CriteriaConverter; };

    constructor(criteriaNames: Array<string>, criteriaNameConverterMap: { [s: string]: CriteriaConverter; }, delay: number) {
        assertConverterMap(criteriaNames, criteriaNameConverterMap);

        this.center = null;
        this.zoom = 0;

        const query = new URLSearchParams(window.location.search.substring(1));

        if (query.has(SEARCH_QUERY_CENTER)) {
            const queryCenter = parseCenterString(query.get(SEARCH_QUERY_CENTER));

            if (queryCenter) {
                [this.center, this.zoom] = queryCenter;
            }
        }

        this.criteriaNameConverterMap = criteriaNameConverterMap;

        this.buildCriteriaMap(parseCriteriaMap(query, criteriaNames, criteriaNameConverterMap));

        this.debounce = new Debounce(delay);
        this.lazyUpdateHandler = this.update.bind(this);
    }

    public getCenter(): Location {
        return this.center;
    }

    public setCenter(center: Location) {
        this.center = center;

        this.lazyUpdate();
    }

    public getZoom(): number {
        return this.zoom;
    }

    public setZoom(zoom: number) {
        this.zoom = zoom;

        this.lazyUpdate();
    }

    public getCriteriaByName(criteriaName: string, defaultValue: any): any {
        if (this.criteriaMap.hasOwnProperty(criteriaName)) {
            return this.criteriaMap[criteriaName];
        }

        return defaultValue;
    }

    public setOrDeleteCriteria(setOrDelete: boolean, key: string, value: boolean) {
        if (setOrDelete) {
            this.criteriaMap[key] = value;
        } else {
            delete this.criteriaMap[key];
        }
    }

    public setCheckedCriteria(key: string, value: boolean) {
        if (value === true) {
            this.criteriaMap[key] = value;
        } else {
            delete this.criteriaMap[key];
        }
    }

    public setAliasCriteria(key: string, value: any) {
        if (value !== null) {
            this.criteriaMap[key] = value.alias;
        } else {
            delete this.criteriaMap[key];
        }
    }

    public storeCurrentState() {
        this.buildCriteriaMap(this.criteriaMap);

        this.update();
    }

    private buildCriteriaMap(criteriaMap: {}) {
        const criteria = [];

        for (let criteriaName in criteriaMap) {
            if (criteriaMap.hasOwnProperty(criteriaName)) {
                const converter = this.criteriaNameConverterMap[criteriaName];

                criteria.push(
                    criteriaName + "=" + encodeURIComponent(converter.marshal(criteriaMap[criteriaName]))
                );
            }
        }

        this.criteriaMap = criteriaMap;
        this.criteria = criteria.join("&");
    }

    private lazyUpdate() {
        this.debounce.handle(this.lazyUpdateHandler);
    }

    private update() {
        let url;

        if (this.center === null) {
            url = window.location.pathname + "?" + this.criteria;
        } else {
            const center = this.center.latitude + "," + this.center.longitude + "," + this.zoom;

            url = window.location.pathname + "?" + SEARCH_QUERY_CENTER + "=" + center + "&" + this.criteria;
        }

        window.history.pushState(
            null,
            "",
            url
        );
    }
}


function parseCriteriaMap(query, criteriaNames: Array<string>, criteriaNameConverterMap: { [s: string]: CriteriaConverter }): { [s: string]: any } {
    const criteriaMap = {};

    for (let i = 0; i < criteriaNames.length; i++) {
        const criteriaName = criteriaNames[i];

        if (query.has(criteriaName)) {
            const converter = criteriaNameConverterMap[criteriaName];

            const source = decodeURIComponent(query.get(criteriaName)).trim();

            if (source !== "") {
                const criteria = converter.unmarshal(source);

                if (criteria !== null) {
                    criteriaMap[criteriaName] = criteria;
                }
            }
        }
    }

    return criteriaMap;
}

function parseCenterString(centerString): any {
    if (centerString) {
        const [latitudeString, longitudeString, zoomString] = centerString.trim().split(",");

        const latitude = parseFloat(latitudeString);
        const longitude = parseFloat(longitudeString);
        const zoom = parseFloat(zoomString);

        if (latitude > 0 && longitude > 0 && zoom > 0) {
            return [new Location(latitude, longitude), zoom];
        }
    }

    return null;
}

function assertConverterMap(criteriaNames: Array<string>, criteriaNameConverterMap: { [s: string]: any; }) {
    for (let i = 0; i < criteriaNames.length; i++) {
        const criteriaName = criteriaNames[i];

        if (criteriaNameConverterMap.hasOwnProperty(criteriaName)) {
            continue;
        }

        throw new Error(`missing converter for "${criteriaName}"`);
    }
}
