import GoogleMapView from "./google-map-view";
import {Company} from "./entities";
import {Location} from "./location";

let googleMap: any = null;

let onceAllowed = true,
    elementLoaded = false,
    applicationLoaded = false;

let mapView: GoogleMapView = null,
    waitResult: Array<Company> = [];

let googleMapCenter: Location,
    googleMapZoom: number;

let onCenterChange: (center: Location) => void,
    onZoomChange: (zoom: number) => void;

export function googleMapElementLoaded(loading: boolean) {
    if (loading) {
        elementLoaded = true;

        if (applicationLoaded) {
            once();
        }
    }

    return loading;
}

export function googleMapApplicationLoaded(center: Location, zoom: number, onCenterChangeHandler, onZoomChangeHandler) {
    applicationLoaded = true;

    googleMapCenter = center;
    googleMapZoom = zoom;

    onCenterChange = onCenterChangeHandler;
    onZoomChange = onZoomChangeHandler;

    if (elementLoaded) {
        once();
    }
}

function googleMapSetCenter(location: Location) {
    googleMapCenter = location;

    if (googleMap !== null) {
        googleMap.setCenter(new google.maps.LatLng(googleMapCenter.latitude, googleMapCenter.longitude));
    }
}

export function googleMapRender(result) {
    if (mapView === null) {
        waitResult = result;

        return
    }

    mapView.render(result);
}

function once() {
    if (onceAllowed) {
        load();

        onceAllowed = false;
    }
}

declare const google: any;
declare let window: { gim: any };

function load() {
    window.gim = function () {
        /**
         {
              zoomControl: boolean,
              mapTypeControl: boolean,
              scaleControl: boolean,
              streetViewControl: boolean,
              rotateControl: boolean,
              fullscreenControl: boolean
            }
         */

        const map = new google.maps.Map(document.getElementById("map"), {
            center: {lat: googleMapCenter.latitude, lng: googleMapCenter.longitude},
            mapTypeId: google.maps.MapTypeId.TERRAIN,
            mapTypeControl: false,
            fullscreenControl: false,
            zoom: googleMapZoom,
        });

        map.addListener("center_changed", function () {
            const center = map.getCenter();

            onCenterChange(new Location(center.lat(), center.lng()));
        });

        map.addListener("zoom_changed", function () {
            onZoomChange(map.getZoom());
        });

        const countryLayer = new google.maps.FusionTablesLayer({
            query: {
                select: "geometry",
                from: "1N2LBk4JHwWpOY4d9fobIn27lfnZ5MDy-NoqqRpk",
                where: "ISO_2DIGIT IN ('UA', 'BY')"
            },
            styles: [
                {
                    polygonOptions: {
                        strokeColor: "#00FF00",
                        fillOpacity: "0"
                    }
                }
            ]
        });

        countryLayer.setMap(map);
        mapView = new GoogleMapView(map);

        if (waitResult.length > 0) {
            mapView.render(waitResult);
        }
    };

    const googleapis = document.createElement("script");
    googleapis.type = "text/javascript";
    googleapis.src = "https://maps.googleapis.com/maps/api/js?key=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX&callback=gim";
    document.body.appendChild(googleapis);
}
