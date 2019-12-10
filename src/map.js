var mapCoords = {
    x: 0,
    y: 0,
    zoom: 13
};
var geoCoords = {
    lat: 39.702892,
    lon: -75.111839,
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
function request_tile(x,y,zoom,element) {
    var request = new XMLHttpRequest();
    var request_url = new URL(`https://api.openrouteservice.org/mapsurfer/${zoom}/${x}/${y}.png?api_key=5b3ce3597851110001cf62484bf1694d7cec49f6bb7482f9d4ac8153`);
    //TODO: hide url/api key in php script
    request.open('GET',request_url);

    request.setRequestHeader('Accept', 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8');

    request.onreadystatechange = function () {
        if (this.readyState === 4) {
            console.log('Status:', this.status);
            console.log('Headers:', this.getAllResponseHeaders());
            console.log('Body:', this.responseText);
            console.log('url: ', this.responseURL);
            element.setAttribute('src', this.responseURL);
        }
    };

    request.send();
};
window.onload = function(){
    updateOrigin(geoCoords.lat,geoCoords.lon,geoCoords.zoom);
    loadMap();
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
    updateOrigin(tile2lat(mapCoords.y,mapCoords.zoom),tile2long(mapCoords.x,mapCoords.zoom),geoCoords.zoom + 1);
    loadMap();
}
function zoomOut() {
    updateOrigin(tile2lat(mapCoords.y,mapCoords.zoom),tile2long(mapCoords.x,mapCoords.zoom),geoCoords.zoom - 1);
    loadMap();
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