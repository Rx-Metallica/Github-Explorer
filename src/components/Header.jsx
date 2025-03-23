import React, { useEffect, useRef } from 'react';
import { Github } from 'lucide-react';
import gsap from 'gsap';

const Header = () => {
  const iconRef = useRef(null);

  useEffect(() => {
    // GSAP floating animation
    gsap.to(iconRef.current, {
      y: -10,
      repeat: -1,
      yoyo: true,
      duration: 1.5,
      ease: "power1.inOut"
    });
  }, []);

  return (
    <div>
      <div className="flex justify-center items-center mt-6">
        <Github 
          ref={iconRef}
          className="w-10 h-10 text-blue-400 mr-3"
        />
        <h1 className="text-4xl font-bold text-center">
          GitHub <span className="text-blue-400">Repository</span> Explorer
        </h1>
      </div>

      <div className="mx-auto mt-5 text-gray-500 text-center">
        <p>Search for GitHub repositories or users to explore their projects.</p>
        <p>Sort the results by name, stars, forks, to find what you're looking for.</p>
      </div>
    </div>
  );
};

export default Header;
