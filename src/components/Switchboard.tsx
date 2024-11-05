import { useState, useEffect } from 'react';

//possible states for each light
interface Light {
  state: 'off' | 'medium' | 'high';
  isAnimating: boolean;
}

const Switchboard = () => {
  //grid dimensions
  const ROWS = 5;
  const COLS = 18;
  const TOTAL_LIGHTS = ROWS * COLS;
  
  //initialize all lights in 'off' mode
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
        state: Math.random() > 0.7 ? 'high' : 'off',
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
      className="flex items-center justify-center grid gap-1 border border-white rounded p-8 bg-gradient-to-r from-neutral-800 to-neutral-900"
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
            relative aspect-square rounded-full w-2
            transition-all duration-500
            ${light.state === 'off' ? 'bg-gray-600' : ''}
            ${light.state === 'medium' ? 'bg-blue-500/50 w-3' : ''}
            ${light.state === 'high' ? 'bg-blue-500 w-4 blur-sm' : ''}
          `}
        >
          <div 
            className={`
              absolute inset-0 m-0.5 rounded-full transition-all duration-500 
              ${light.state === 'off' ? 'bg-white/0' : ''}
              ${light.state === 'medium' ? '' : ''}
              ${light.state === 'high' ? 'bg-white w-2 h-2' : ''}
            `}
          />
        </div>
      ))}
    </div>
  );
};

export default Switchboard;