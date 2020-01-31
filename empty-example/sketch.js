let socialData;
let countries;
let subselection;

const mappa = new Mappa('Leaflet');
let myMap;
let canvas;

let maxUsers, minUsers, maxYear, minYear;
let data = [];

const options = {
    lat: 0,
    lng: 0,
    zoom: 1.5,
    style: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
}


function preload() {
    socialData = loadTable('users_geo.csv', 'header');
    countries = loadJSON('countries.json');

}

function setup() {

    canvas = createCanvas(800, 600);
    myMap = mappa.tileMap(options);
    myMap.overlay(canvas);
    myMap.onChange(logChange);


    maxUsers = 0;
    minUsers = Infinity;
    maxYear = 2002;
    minYear = 2020;
}

function logChange() {
    console.log("change");
    createNewMarkers();
}



function draw() {
    clear();
    for (let country of data) {

        const pix = myMap.latLngToPixel(country.lat, country.lon);
        fill(24,165,212, 255);

        const zoom = myMap.zoom();
        const scl = pow(2, zoom); 
        ellipse(pix.x, pix.y, country.diameter * scl);
        stroke(255, 255, 255);
    }
}

function newSubSelection(selection) {
    subselection = selection;
    createNewMarkers();
}

function createNewMarkers() {
    console.log("data length before", data.length);
    clear();
    data = [];
    console.log("data length after", data.length);
    
    for (let item of subselection) {
        let country = item.country_id.toLowerCase();
        let latlon = countries[country];
        if (latlon) {
            let lat = latlon[0];
            let lon = latlon[1];


            let count = Number(item.users);
            data.push({
                lat,
                lon,
                count
            });
            if (count > maxUsers) {
                maxUsers = count;
            }
            if (count < minUsers) {
                minUsers = count;
            }
        }
    }

    let minD = sqrt(minUsers);
    let maxD = sqrt(maxUsers);

    for (let country of data) {
        country.diameter = map(sqrt(country.count), minD, maxD, 1, 20);
    }
}

$(function () {
    
    $("#slider").slider({
        value: 2002,
        min: 2002,
        max: 2020,
        step: 1,
        slide: function (event, ui) {
            $("#year").val(ui.value);
            let selection = [];
            for (let row of socialData.rows) {
                if (row.obj.year == ui.value) {
                    selection.push(row.obj)
                }
            }
            newSubSelection(selection);
        }
    });
    $("#year").val(" " + ("#slider").slider("value"));
});
