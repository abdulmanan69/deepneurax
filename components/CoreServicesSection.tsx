"use client";
import React, { useRef } from "react";
import ExpandOnHover from "./ui/expand-cards";

interface CoreServicesSectionProps {
  services: any[];
}



// Use theme colors for a unique, modern SVG background
const svg = `
<svg width='180' height='180' xmlns='http://www.w3.org/2000/svg'>
  <circle cx='90' cy='90' r='70' fill='none' stroke='%230066FF' stroke-width='3' opacity='0.18'/>
  <circle cx='90' cy='90' r='45' fill='none' stroke='%230066FF' stroke-width='2' opacity='0.22'/>
  <circle cx='90' cy='90' r='25' fill='none' stroke='%230066FF' stroke-width='2' opacity='0.25'/>
  <rect x='30' y='30' width='30' height='30' rx='8' fill='%230066FF' opacity='0.13'/>
  <rect x='120' y='120' width='24' height='24' rx='6' fill='%230066FF' opacity='0.13'/>
  <rect x='60' y='120' width='18' height='18' rx='4' fill='%230066FF' opacity='0.13'/>
  <circle cx='140' cy='50' r='7' fill='%230066FF' opacity='0.13'/>
  <circle cx='40' cy='140' r='5' fill='%230066FF' opacity='0.13'/>
</svg>`;
const encodedSvg = 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")';

const CoreServicesSection: React.FC<CoreServicesSectionProps> = ({ services }) => {
  const bgRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="services"
      className="py-24 bg-slate-50 relative overflow-hidden"
    >
      {/* Sophisticated Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 opacity-[0.4]"
          style={{ 
            backgroundImage: `radial-gradient(#cbd5e1 1px, transparent 1px)`,
            backgroundSize: `32px 32px`
          }}
        ></div>
        {/* Subtle Gradient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)]"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 
            className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight"
            style={{ fontFamily: "'Geom', sans-serif", fontWeight: 900 }}
          >
            Core Services
          </h2>
          <div className="w-24 h-1.5 bg-blue-600 mx-auto rounded-full mb-6"></div>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Empowering your business with cutting-edge AI solutions and strategic technological innovation.
          </p>
        </div>
        
        <div className="flex justify-center">
          <div className="w-full max-w-6xl">
            <ExpandOnHover services={services} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoreServicesSection;
