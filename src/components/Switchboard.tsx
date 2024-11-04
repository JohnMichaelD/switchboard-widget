import { useState, useEffect } from 'react';

interface Light {
  state: 'off' | 'medium' | 'high';
  isAnimating: boolean;
}

const Switchboard = () => {
  const ROWS = 5;
  const COLS = 18;
  const TOTAL_LIGHTS = ROWS * COLS;
  
  const [lights, setLights] = useState<Light[]>(Array(TOTAL_LIGHTS).fill({
    state: 'off',
    isAnimating: false
  }));

  const getRandomDelay = () => Math.random() * 2000 + 1000;

  const animateLight = (index: number) => {
    setLights(prev => {
      const newLights = [...prev];
      newLights[index] = {
        ...newLights[index],
        state: Math.random() > 0.7 ? 'medium' : 'off',
        isAnimating: true
      };
      return newLights;
    });
  };

  useEffect(() => {
    const intervals = lights.map((_, index) => {
      return setInterval(() => {
        if (Math.random() > 0.8) {
          animateLight(index);
        }
      }, getRandomDelay());
    });

    return () => intervals.forEach(clearInterval);
  }, []);

  return (
    <div 
      className="w-full max-w-4xl mx-auto grid gap-1"
      style={{
        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
        aspectRatio: `${COLS}/${ROWS}`
      }}
    >
      {lights.map((light, index) => (
        <div
          key={index}
          data-index={index}
          data-light="true"
          data-state={light.state}
          className={`
            relative aspect-square rounded-full
            transition-all duration-250
            ${light.state === 'off' ? 'bg-blue-500/10' : ''}
            ${light.state === 'medium' ? 'bg-blue-500/50' : ''}
            ${light.state === 'high' ? 'bg-blue-500' : ''}
            hover:bg-blue-500 hover:scale-125
          `}
          style={{
            transform: light.isAnimating ? 'scale(1)' : 'unset'
          }}
          onMouseEnter={() => {
            setLights(prev => {
              const newLights = [...prev];
              newLights[index] = {
                ...newLights[index],
                state: 'high',
                isAnimating: true
              };
              return newLights;
            });
          }}
          onMouseLeave={() => {
            setLights(prev => {
              const newLights = [...prev];
              newLights[index] = {
                ...newLights[index],
                state: 'off',
                isAnimating: false
              };
              return newLights;
            });
          }}
        />
      ))}
    </div>
  );
};

export default Switchboard;