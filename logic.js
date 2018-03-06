// Make the layer
var mapLayer = L.tileLayer("https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.png?" +
"access_token=pk.eyJ1IjoibXJiYWxpa2NpIiwiYSI6ImNqZGhqeWFxdTEwamgycXBneTZnYjFzcm0ifQ."
+ "RXRxgZ1Mb6ND-9EYWu_5hA", {
    attribution: "Map data &copy;" +
        "<a href='http://openstreetmap.org'>OpenStreetMap</a> contributors," +
        "<a href='http://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>" +
        "Imagery &copy <a href='http://mapbox.com'>Mapbox</a>",
    maxZoom: 18
});


// Make the map object 
var myMap = L.map("map", {
    center: [
        40.7, -94.5
    ],
    zoom: 3
});


// Add the 'mapLayer' to myMap
mapLayer.addTo(myMap);


// Make a AJAX call to retrive the geoJSON data for eathquakes 
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function (data) {

    // Make a function to return the style data for each point of quakes for color and radius 
    function styleInfo(feature) {
        return {
            opacity: 1,
            fillOpacity: 0.75,
            fillColor: getColor(feature.properties.mag),
            color: "#000099",
            radius: getRadius(feature.properties.mag),
            stroke: false,
            weight: 0.75
        };
    }


    // make a function for the color of circles based on magnitude 
    function getColor(magnitude) {
        switch (true) {
            case magnitude > 5:
                return "#cc0000";
            case magnitude > 4:
                return "#ff9900";
            case magnitude > 3:
                return "#cccc00";
            case magnitude > 2:
                return "#009900";
            case magnitude > 1:
                return "#00cc66";
            default:
                return "#009999";
        }
    };


    // This fuction makes the radius based on magnitude 
    // handle mag with 0 since it's been plotted wrong
    function getRadius(magnitude) {
        if (magnitude === 0) {
            return 1;
        }

        return magnitude * 4;
    };

    // add geoJSON layer to the map
    L.geoJson(data, {
        pointToLayer: function (feature, lat) {
            return L.circleMarker(lat);
        },

        // pass the styleInfo function
        style: styleInfo,

        // make the popups for mag and location
        onEachFeature: function (feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag +
                "<br>Location: " + feature.properties.place);
        }
    }).addTo(myMap);

    // Add a legend 
    var legend = L.control({position: "bottomright"});

    legend.onAdd = function () {
        var div = L
            .DomUtil
            .create("div", "info legend");

        var grades = [0, 1, 2, 3, 4, 5];
        var colors = [
            "#009999",
            "#00cc66",
            "#009900",
            "#cccc00",
            "#ff9900",
            "#cc0000"
        ];

        // Loop through the intervals 
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML += "<i style='background: " + colors[i] + "'></i> " +
                grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
        }
        return div;
    };

    // Add legend to the map
    legend.addTo(myMap);
})

