var x_pos = 2386;
var y_pos = 3110;
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
    loadMap();
};
function panLeft() {
    x_pos -= 1;
    loadMap();
};
function panRight() {
    x_pos += 1;
    loadMap();
};
function panUp() {
    y_pos -= 1;
    loadMap();
};
function panDown() {
    y_pos += 1;
    loadMap();
};
function loadMap() {
    request_tile(x_pos, y_pos,13,document.getElementById('image00'));
    request_tile(x_pos + 1, y_pos,13,document.getElementById('image01'));
    request_tile(x_pos + 2, y_pos,13,document.getElementById('image02'));
    request_tile(x_pos , y_pos + 1,13,document.getElementById('image10'));
    request_tile(x_pos + 1, y_pos + 1,13,document.getElementById('image11'));
    request_tile(x_pos + 2, y_pos + 1,13,document.getElementById('image12'));
}