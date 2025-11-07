import React, { useEffect } from 'react';

export function App() {
  useEffect(() => {
    if (document.querySelector('script[data-gmp]')) return;

    window.__gmpNoop__ = () => {};

    const s = document.createElement('script');
    s.async = true;
    s.defer = true;
    s.src =
      'https://maps.googleapis.com/maps/api/js?key=MY_API_KEY&callback=__gmpNoop__&libraries=maps,marker&v=beta';
    s.setAttribute('data-gmp', 'true');
    document.head.appendChild(s);
  }, []);

  return (
    <div className="App">
      <h1>Hello React.</h1>
      <h2>Start editing to see some magic happen!</h2>

      {/* Google Maps Web Component */}
      <gmp-map
        center="40.12150192260742,-100.45039367675781"
        zoom="4"
        map-id="DEMO_MAP_ID"
      >
        <gmp-advanced-marker
          position="40.12150192260742,-100.45039367675781"
          title="My location"
        ></gmp-advanced-marker>
      </gmp-map>
    </div>
  );
}

console.log('Hello console');