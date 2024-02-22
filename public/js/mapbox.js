/* eslint-disable */



export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiZmlzZ3V4c29lMTIzIiwiYSI6ImNsc24wNHZyaDB0cnUybHIwb2liY2toMnIifQ.EO25G2TeorR5AyKJ7sbmIA';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/fisguxsoe123/clsn0h1zq00ph01pfhf0d1mxj',
    scrollZoom: false,
    //   center: [-118.113491, 34.111745],
    //   zoom: 8,
    //   interactive: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add Marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Addpopup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      right: 200,
      left: 200,
    },
  });
};
