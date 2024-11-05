import { useState, useEffect } from 'react';

interface Light {
  state: 'off' | 'medium' | 'high';
  isAnimating: boolean;
}

const Switchboard = () => {
  const ROWS = 5;
  const COLS = 18;
  const TOTAL_LIGHTS = ROWS * COLS;
  
  const JOHN_INDICES = [
    // J
    2, 20, 38, 54, 56, 74, 73, 72,
    // O
    4, 5, 6, 7, 22, 25, 40, 43, 58, 61, 76, 77, 78, 79,
    // H
    9, 12, 27, 30, 45, 46, 47, 48, 63, 66, 81, 84,
    // N
    14, 17, 32, 33, 35, 50, 52, 53, 68, 71, 86, 89
  ];
  
  const [isHovered, setIsHovered] = useState(false);
  const [lights, setLights] = useState<Light[]>(Array(TOTAL_LIGHTS).fill({
    state: 'off',
    isAnimating: false
  }));

  const getRandomDelay = () => Math.random() * 2000 + 1000;

  const animateLight = (index: number) => {
    // First transition: off -> medium
    setLights(prev => {
      const newLights = [...prev];
      newLights[index] = {
        ...newLights[index],
        state: 'medium',
        isAnimating: true
      };
      return newLights;
    });
  
    // Second transition: medium -> high/off after a short delay
    setTimeout(() => {
      setLights(prev => {
        const newLights = [...prev];
        newLights[index] = {
          ...newLights[index],
          state: Math.random() > 0.7 ? 'high' : 'off',
          isAnimating: true
        };
        return newLights;
      });
    }, 250); // delay 'medium' state
  };
  
  useEffect(() => {
    if (isHovered) {
      // all off, JOHN indices to medium
      setLights(prev => prev.map((light, index) => ({
        ...light,
        state: JOHN_INDICES.includes(index) ? 'medium' : 'off',
        isAnimating: JOHN_INDICES.includes(index)
      })));
  
      // Then after a delay, JOHN indices to high
      setTimeout(() => {
        setLights(prev => prev.map((light, index) => ({
          ...light,
          state: JOHN_INDICES.includes(index) ? 'high' : 'off',
          isAnimating: JOHN_INDICES.includes(index)
        })));
      }, 250);
  
      return;
  } else {
    // When leaving hover state, ensure JOHN indices are off
    setLights(prev => prev.map((light, index) => ({
      ...light,
      state: JOHN_INDICES.includes(index) ? 'off' : light.state,
      isAnimating: false
    })));
  }
  
    // Regular random animation when not hovered
    const intervals = lights.map((_, index) => {
      return setInterval(() => {
        if (Math.random() > 0.8) {
          animateLight(index);
        }
      }, getRandomDelay());
    });
  
    return () => intervals.forEach(clearInterval);
  }, [isHovered]);

  return (
    <div 
      className="flex items-center justify-center grid gap-1 border border-white rounded-2xl shadow-2xl p-4 bg-gradient-to-r from-neutral-800 to-neutral-900"
      style={{
        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
        aspectRatio: `${COLS}/${ROWS}`
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {lights.map((light, index) => (
        <div
          key={index}
          data-index={index}
          data-light="true"
          data-state={light.state}
          className={`
            relative aspect-square rounded-full w-3
            transition-all duration-500
            ${light.state === 'off' ? 'bg-gray-800' : ''}
            ${light.state === 'medium' ? 'bg-blue-500/50 w-1 blur-md' : ''}
            ${light.state === 'high' ? 'bg-blue-500 w-2 blur-sm' : ''}
          `}
        >
          <div 
            className={`
              absolute inset-0 m-0.5 rounded-full transition-all duration-500 blur-none
              ${light.state === 'off' ? 'bg-white/0' : ''}
              ${light.state === 'medium' ? 'bg-white/50 blur-none' : ''}
              ${light.state === 'high' ? 'bg-white w-1 h-1 blur-none' : ''}
            `}
          />
        </div>
      ))}
    </div>
  );
};

export default Switchboard;