// Creating map object
var map = L.map("map", {
      center: [37.7749, -122.4194],
      zoom: 4
    });
    
    // Adding tile layer
    L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.light",
      accessToken: API_KEY
    }).addTo(map);

  var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

  // Use D3 to read the json data
  d3.json(url, function(response) {
    var data = response.features;
  
    // Loop through data
    for (var i = 0; i < data.length; i++) {
      // Creat variable grab the magnitude from the json data
      var mag = data[i].properties.mag;
      console.log(mag);
    }
  //  creat a Function for the circles radius
  function radius (mag){
    if (mag == 0){
      return 1;
    }
    return mag * 6;
  }
  //  Creat a function to determin the color depend om the magnitude
  function getColor(magnitude) {
    switch (true) {
    case magnitude > 5:
      return "purple";
    case magnitude > 4:
      return "red";
    case magnitude > 3:
      return "green";
    case magnitude > 2:
      return "orange";
    case magnitude > 1:
      return "gold";
    default:
      return "blue";
    }
  }

  // Creat a function for the style 
  function style(feature) {
    return {
      color: "white",
      fillColor: getColor(feature.properties.mag),
      fillOpacity: 0.5,
      radius: radius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }


  // Creating a geoJSON layer with the retrieved data
  geojson = L.geoJson(data, {
    // We turn each feature into a circleMarker on the map.
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
      // console.log(latlng);
      
    },
    // We set the style for each circleMarker using our style function.
    style: style,
    // We create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }
  }).addTo(map);



// Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function(map) {
    var div = L.DomUtil.create("div", "info legend"),
        magnitude = [0, 1, 2, 3, 4, 5];

    for (var i = 0; i < magnitude.length; i++) {
    div.innerHTML +=
        '<i style="background:' + getColor(magnitude[i] + 1) + '"></i> ' +
        magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
    }

  return div;

},
// Adding legend to the map
legend.addTo(map);

});
