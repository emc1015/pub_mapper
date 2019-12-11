const landmark = {
    lat:39.706848,
    lon: -75.110462
};
const crown = {
    lat: 39.706184,
    lon: -75.108006
};
const bunce_cirle = {
    lat:39.706073,
    lon: -75.121396
};
const glassboro = {
    lat: 39.702892,
    lon: -75.111839
};
const alcyon = {
    lat:39.729042,
    lon: -75.145095
};
const orchard = {
    lat: 39.703843,
    lon: -75.078589
}
var mapCoords = {
    x: 0,
    y: 0,
    zoom: 13
};
var waypoint = {
    lon: 0,
    lat: 0
}
//TODO: transform via geocoords
var geoCoords = {
    lat:39.706073,
    lon: -75.121396,
    zoom: 13
};
//TODO:refactor to use geo coords natively
function updateOrigin(lat,lon,zoom) {
    geoCoords.lat = lat;
    geoCoords.lon = lon;
    geoCoords.zoom = zoom;
    mapCoords.x = long2tile(lon,zoom);
    mapCoords.y = lat2tile(lat,zoom);
    mapCoords.zoom = zoom;
}
function request_path(point_a,point_b){
    var request = new XMLHttpRequest();
    //TODO:move to php
    request.open('GET', `https://api.openrouteservice.org/v2/directions/foot-walking?api_key=5b3ce3597851110001cf62484bf1694d7cec49f6bb7482f9d4ac8153&start=${point_a.lon},${point_a.lat}&end=${point_b.lon},${point_b.lat}`);

    request.setRequestHeader('Accept', 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8');

    request.onreadystatechange = function () {
        if (this.readyState === 4) {
            //console.log('Status:', this.status);
            //console.log('Headers:', this.getAllResponseHeaders());
            let coords = JSON.parse(this.responseText).features[0].geometry.coordinates[0];
            console.log('Coords:', coords);
            waypoint.lon = coords[0];
            waypoint.lat = coords[1];
        }
    };

    request.send();
}
function request_tile(x,y,zoom,element) {
    var request = new XMLHttpRequest();
    var request_url = new URL(`https://api.openrouteservice.org/mapsurfer/${zoom}/${x}/${y}.png?api_key=5b3ce3597851110001cf62484bf1694d7cec49f6bb7482f9d4ac8153`);
    //TODO: hide url/api key in php script
    request.open('GET',request_url);

    request.setRequestHeader('Accept', 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8');

    request.onreadystatechange = function () {
        if (this.readyState === 4) {
            //console.log('Status:', this.status);
            //console.log('Headers:', this.getAllResponseHeaders());
            //console.log('Body:', this.responseText);
            //console.log('url: ', this.responseURL);
            element.setAttribute('src', this.responseURL);
        }
    };

    request.send();
};
window.onload = function(){
    var canvas = document.getElementById("canvas11");
    updateOrigin(geoCoords.lat,geoCoords.lon,geoCoords.zoom);
    console.log(request_path(landmark,crown));
    console.log(waypoint);
    loadMap();
   // console.log(geoCoords);
   // console.log(tile2long(mapCoords.x,mapCoords.y),",",tile2lat(mapCoords.y,mapCoords.zoom));


};
function panLeft() {
    mapCoords.x -= 1;
    loadMap();
};
function panRight() {
    mapCoords.x += 1;
    loadMap();
};
function panUp() {
    mapCoords.y -= 1;
    loadMap();
};
function panDown() {
    mapCoords.y += 1;
    loadMap();
};
function zoomIn() {
    let origin = find_map_center()
    updateOrigin(origin.lat,origin.lon,geoCoords.zoom + 1);
    loadMap();
}
function zoomOut() {
    let origin = find_map_center()
    updateOrigin(origin.lat,origin.lon,geoCoords.zoom - 1);
    loadMap();
}
function find_map_center(){
    let lat_arc = tile2lat(mapCoords.y + 1, mapCoords.zoom) - tile2lat(mapCoords.y, mapCoords.zoom);
    let lon_arc = tile2long(mapCoords.x + 1, mapCoords.zoom) - tile2long(mapCoords.x,mapCoords.zoom);
    let center_x = lon_arc/2 + tile2long(mapCoords.x,mapCoords.zoom);
    let center_y = lat_arc/2 + tile2lat(mapCoords.y,mapCoords.zoom);
    let result = {lat: center_y,lon: center_x};
    console.log("map center: ", result)
    return result;
}
function loadMap() {
    request_tile(mapCoords.x - 1, mapCoords.y - 1,mapCoords.zoom,document.getElementById('image00'));
    request_tile(mapCoords.x, mapCoords.y - 1,mapCoords.zoom,document.getElementById('image01'));
    request_tile(mapCoords.x + 1, mapCoords.y - 1,mapCoords.zoom,document.getElementById('image02'));
    request_tile(mapCoords.x - 1, mapCoords.y,mapCoords.zoom,document.getElementById('image10'));
    request_tile(mapCoords.x, mapCoords.y,mapCoords.zoom,document.getElementById('image11'));
    request_tile(mapCoords.x + 1, mapCoords.y,mapCoords.zoom,document.getElementById('image12'));
    request_tile(mapCoords.x - 1, mapCoords.y + 1,mapCoords.zoom,document.getElementById('image20'));
    request_tile(mapCoords.x, mapCoords.y + 1,mapCoords.zoom,document.getElementById('image21'));
    request_tile(mapCoords.x + 1, mapCoords.y + 1,mapCoords.zoom,document.getElementById('image22'));
    drawOverlay();
}

function long2tile(lon,zoom) { return (Math.floor((lon+180)/360*Math.pow(2,zoom))); };
function lat2tile(lat,zoom)  { return (Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom))); };

function tile2long(x,z) {
    return (x/Math.pow(2,z)*360-180);
}
function tile2lat(y,z) {
    var n=Math.PI-2*Math.PI*y/Math.pow(2,z);
    return (180/Math.PI*Math.atan(0.5*(Math.exp(n)-Math.exp(-n))));
}

function draw(x,y,canvas) {
    canvas.height = 256;
    canvas.width = 256;
    var ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(x*256,0);
    ctx.lineTo(x*256,256);
    ctx.moveTo(0,y * 256);
    ctx.lineTo(256,y * 256);
    ctx.stroke();
}
function drawOverlay() {
    let poi = find_map_center();
    let geo_lon_low_bound = tile2long(mapCoords.x,mapCoords.zoom);
    let geo_lon_high_bound = tile2long(mapCoords.x + 1,mapCoords.zoom);
    let geo_lat_high_bound = tile2lat(mapCoords.y,mapCoords.zoom);
    let geo_lat_low_bound = tile2lat(mapCoords.y + 1,mapCoords.zoom);
    let lat_offset = poi.lat - tile2lat(mapCoords.y,mapCoords.zoom);
    let lat_arc = tile2lat(mapCoords.y + 1, mapCoords.zoom) - tile2lat(mapCoords.y, mapCoords.zoom);
    let lon_offset = poi.lon - geo_lon_low_bound;
    let lon_arc = tile2long(mapCoords.x + 1, mapCoords.zoom) - geo_lon_low_bound;
    let x_offset = lon_offset/lon_arc;
    let y_offset = lat_offset/lat_arc;
    let canvas = document.getElementById("canvas11");
    //TODO:fix to use absolute landmarks
    if(poi.lat > geo_lat_low_bound && poi.lat < geo_lat_high_bound
        && poi.lon > geo_lon_low_bound && poi.lon < geo_lon_high_bound){
        draw(x_offset,y_offset,canvas);
    }else{
        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    }
}