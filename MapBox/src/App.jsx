import React, { useEffect, useRef } from 'react';

const MAPBOX_TOKEN = 'MY_API_KEY';

export function App() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!document.querySelector('link[data-mapbox-css]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://api.mapbox.com/mapbox-gl-js/v3.0.0/mapbox-gl.css';
      link.setAttribute('data-mapbox-css', 'true');
      document.head.appendChild(link);
    }

    function initMap() {
      if (mapRef.current || !mapContainerRef.current) return;

      mapboxgl.accessToken = MAPBOX_TOKEN;

      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-100.45039367675781, 40.12150192260742],
        zoom: 4,
      });

      map.addControl(new mapboxgl.NavigationControl(), 'top-right');

      new mapboxgl.Marker({ color: '#72a24d' })
        .setLngLat([-100.45039367675781, 40.12150192260742])
        .setPopup(
          new mapboxgl.Popup({ offset: 24 }).setText('My location')
        )
        .addTo(map);

      mapRef.current = map;
    }

    if (window.mapboxgl) {
      initMap();
    } else {
      if (!document.querySelector('script[data-mapbox-js]')) {
        const script = document.createElement('script');
        script.src = 'https://api.mapbox.com/mapbox-gl-js/v3.0.0/mapbox-gl.js';
        script.async = true;
        script.defer = true;
        script.setAttribute('data-mapbox-js', 'true');
        script.onload = initMap;
        document.head.appendChild(script);
      } else {
        const existing = document.querySelector('script[data-mapbox-js]');
        existing.addEventListener('load', initMap, { once: true });
      }
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div className="App">
      <h1>Hello React.</h1>
      <h2>Start editing to see some magic happen!</h2>
      <div id="map" ref={mapContainerRef} />
    </div>
  );
}

console.log('Hello console');