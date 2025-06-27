import React, { useEffect, useRef } from 'react';
import { Github } from 'lucide-react';
import gsap from 'gsap';

const Header = () => {
  const iconRef = useRef(null);

  useEffect(() => {
    gsap.to(iconRef.current, {
      y: -10,
      repeat: -1,
      yoyo: true,
      duration: 1.5,
      ease: "power1.inOut"
    });
  }, []);

  return (
    <header className="px-4 py-6">
      <div className="flex flex-col sm:flex-row justify-center items-center gap-3 text-center">
        <div ref={iconRef}>
          <Github className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-blue-400" />
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
          GitHub <span className="text-blue-400">Repository</span> Explorer
        </h1>
      </div>

      <div className="max-w-xl mx-auto mt-4 text-gray-500 text-sm sm:text-base text-center px-2">
        <p>Search for GitHub repositories or users to explore their projects.</p>
        <p>Sort the results by name, stars, or forks to find what you're looking for.</p>
      </div>
    </header>
  );
};

export default Header;
