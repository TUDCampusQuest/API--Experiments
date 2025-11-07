import React, { useEffect } from 'react';

export function App() {
  useEffect(() => {
    if (!document.getElementById('gfont-tangerine')) {
      const t = document.createElement('link');
      t.id = 'gfont-tangerine';
      t.rel = 'stylesheet';
      t.href = 'https://fonts.googleapis.com/css?family=Tangerine';
      document.head.appendChild(t);
    }

    if (!document.getElementById('gfont-sofia-fire')) {
      const s = document.createElement('link');
      s.id = 'gfont-sofia-fire';
      s.rel = 'stylesheet';
      s.href = 'https://fonts.googleapis.com/css?family=Sofia&effect=fire-animation';
      document.head.appendChild(s);
    }
  }, []);

  return (
    <div>
      <div>Making the Web Beautiful!</div>

      <hr />

      <div className="font-effect-fire-animation">Fire Animation</div>
    </div>
  );
}

console.log('Hello console');