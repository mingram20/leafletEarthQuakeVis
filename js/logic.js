// store the geo json API link
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// set-up functions to control marker sizes and colors as they will appear on map
function markerSize(mag) {
    return mag * 30000;
};

function markerColor(mag) {
    if (mag <= 1) {
        return "#ADFF2F";
    } else if (mag <= 2) {
        return "#9ACD32";
    } else if (mag <= 3) {
        return "#FFFF00";
    } else if (mag <= 4) {
        return "#ffd700";
    } else if (mag <= 5) {
        return "#FFA500";
    } else {
        return "#FF0000";
    };
  };

// set-up function that will create the circle markers on the map
function createFeatures(earthQuakeData) {
    var earthQuakes = L.geoJSON(earthQuakeData, {
        
        // create pop-ups with information
        onEachFeature : function(feature, layer) {
            layer.bindPopup("<h4>" + feature.properties.place + "</h4><hr><p>" +
            new Date(feature.properties.time) + "</p>" + 
            "<p> Magnitude Rating: "+ feature.properties.mag + "</p>")
        }, pointToLayer: function(feature, latlng) {
            return new L.circle(latlng, 
                {radius: markerSize(feature.properties.mag),
                fillColor: markerColor(feature.properties.mag),
                fillOpacity: 1,
                stroke: false,
                })
        }
    })
    createMap(earthQuakes);
};

// set up function to create maps
function createMap(earthQuakes) {
    var satMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 4,
        id: "mapbox.streets-satellite",
        accessToken: API_KEY
    });

    var darkMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 4,
        id: "mapbox.dark",
        accessToken: API_KEY
    });
    var lightMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 4,
        id: "mapbox.light",
        accessToken: API_KEY
    });

    // create base map views
    var baseMaps = {
        "Satellite View": satMap,
        "Dark View": darkMap,
        "Light View": lightMap
    };
    // create overlay object to hold overlay layer of markers
    var overlayMaps = {
        Earthquakes: earthQuakes
    };
    // create map wth default satelite map view and earthquakes showing
    var myMap = L.map("map", {
        center: [39.8283,-98.5795],
        zoom: 4,
        layers: [satMap, earthQuakes]
    });

    // create a layer for the control toggles
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function () {
        var div = L.DomUtil.create('div', 'info legend'),
            magnitudes = [0, 1, 2, 3, 4, 5];
    
        for (var i = 0; i < magnitudes.length; i++) {
            div.innerHTML += '<i style="background:' + markerColor(magnitudes[i] + 1) + '"></i> ' + 
            + magnitudes[i] + (magnitudes[i + 1] ? ' - ' + 
            magnitudes[i + 1] + '<br>' : ' + ');
        }
        return div;
    };

    legend.addTo(myMap);
};

// after setting up all functions perform GET request to the URL
d3.json(url, function(data) {
    createFeatures(data.features);
});