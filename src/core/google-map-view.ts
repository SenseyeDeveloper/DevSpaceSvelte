import InfoWindowController from "./info-window-controller";
import {Company} from "./entities";
import LocationMaxtrix from "./location-matrix";
import DataMarker from "./data-marker";
import MarkerClusterer from "@google/markerclusterer";

declare const google: any;

const MAX_OPEN_INFO_WINDOW_COUNT = 1;

const markerClustererOptions = {
    imagePath: 'images/markerclusterer/m',
    minimumClusterSize: 2,
    maxZoom: 15,
    gridSize: 30,
};

export default class GoogleMapView {
    private readonly map: any;
    private markers: Array<any>;
    private readonly infoWindowController: InfoWindowController;
    private markerClusterer: MarkerClusterer;

    constructor(map: any) {
        this.map = map;
        this.markers = [];
        this.infoWindowController = new InfoWindowController(MAX_OPEN_INFO_WINDOW_COUNT);
        this.markerClusterer = null;
    }

    public render(companies: Array<Company>) {
        this.clear();

        const locationMatrix = new LocationMaxtrix(companies);
        const matrix = locationMatrix.matrix();

        for (let latitude in matrix) {
            if (matrix.hasOwnProperty(latitude)) {
                const map = matrix[latitude];

                for (let longitude in map) {
                    if (map.hasOwnProperty(longitude)) {
                        const dataMarker = new DataMarker(map[longitude]);

                        const position = new google.maps.LatLng(latitude, longitude);

                        const mapMarker = new google.maps.Marker({
                            position: position,
                            title: dataMarker.getTitle()
                        });

                        this.addClickListener(mapMarker, dataMarker);

                        this.markers.push(mapMarker);
                    }
                }
            }
        }

        this.markerClusterer = new MarkerClusterer(
            this.map,
            this.markers,
            markerClustererOptions,
        );
    }

    private addClickListener(marker: any, groupMarker: DataMarker) {
        google.maps.event.addListener(marker, "click", this.open.bind(this, marker, groupMarker));

        // https://developers.google.com/maps/documentation/javascript/events
        // Remove all click listeners from markers instance
        // google.maps.event.clearListeners(markers, 'click');
    }

    private open(marker: any, groupMarker: DataMarker) {
        const infoWindow = new google.maps.InfoWindow({
            content: groupMarker.getContent()
        });

        infoWindow.open(this.map, marker);

        this.infoWindowController.add(infoWindow);
    }

    private clear() {
        for (let i = 0; i < this.markers.length; i++) {
            const marker = this.markers[i];

            marker.setMap(null);
            google.maps.event.clearListeners(marker, "click");
        }

        this.markers = [];

        this.infoWindowController.clear();

        if (this.markerClusterer !== null) {
            this.markerClusterer.clearMarkers();
            this.markerClusterer = null;
        }
    }
}
