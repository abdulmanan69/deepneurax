"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { CSSProperties } from "react";
import { ArrowRight, Sparkles } from "lucide-react";

export interface ServiceCardData {
  id?: number | string;
  title: string;
  slug?: string;
  description: string;
  image?: { asset: { url: string } } | null;
  icon?: string;
  link?: string;
}

interface ExpandOnHoverProps {
  services: ServiceCardData[];
}

const ExpandOnHover = ({ services }: ExpandOnHoverProps) => {
  const [expandedIndex, setExpandedIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const getCardStyle = (index: number) => {
    if (isMobile) {
      // Mobile: Stacked accordion style or just vertical list
      return {
        width: "100%",
        height: index === expandedIndex ? "28rem" : "5rem", // Collapsed height vs Expanded height
        borderRadius: "24px",
        boxShadow: index === expandedIndex 
          ? "0 20px 50px -12px rgba(0,0,0,0.3)" 
          : "0 4px 12px rgba(0,0,0,0.05)",
        marginBottom: "1rem"
      } as CSSProperties;
    } else {
      // Desktop: Horizontal accordion
      return {
        width: index === expandedIndex ? "32rem" : "6rem",
        height: "30rem",
        borderRadius: "24px",
        boxShadow: index === expandedIndex 
          ? "0 20px 50px -12px rgba(0,0,0,0.3)" 
          : "0 4px 12px rgba(0,0,0,0.05)",
      } as CSSProperties;
    }
  };

  return (
    <div className={`w-full py-12 flex relative ${isMobile ? 'flex-col min-h-screen' : 'items-center justify-center min-h-[30rem]'}`}>
      <div className={`flex w-full ${isMobile ? 'flex-col' : 'items-center justify-center gap-3'}`}>
        {services.map((service, idx) => (
          <div
            key={idx}
            className={
              `relative cursor-pointer overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group ` +
              (idx === expandedIndex ? 'z-20' : 'z-10')
            }
            style={getCardStyle(idx)}
            onMouseEnter={() => !isMobile && setExpandedIndex(idx)}
            onClick={() => isMobile && setExpandedIndex(idx === expandedIndex ? -1 : idx)}
          >
            {/* Image with overlay */}
            <div className="absolute inset-0 w-full h-full">
               <img
                className={`w-full h-full object-cover transition-transform duration-700 ${idx === expandedIndex ? 'scale-105' : 'scale-100'}`}
                src={service.image?.asset.url || "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80"}
                alt={service.title}
              />
              <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 ${idx === expandedIndex ? 'opacity-100' : 'opacity-40'}`}></div>
            </div>

            {/* Content for collapsed state (vertical title) */}
            {idx !== expandedIndex && (
              <div className="absolute inset-0 flex items-end justify-center pb-10">
                <p 
                  className="text-white font-bold text-xl whitespace-nowrap -rotate-90 origin-center tracking-widest opacity-80 group-hover:opacity-100 transition-opacity"
                  style={{ fontFamily: "'Geom', sans-serif" }}
                >
                  {service.title}
                </p>
              </div>
            )}

            {/* Content for expanded state */}
            <div
              className={`absolute inset-0 flex flex-col justify-end p-8 transition-all duration-500 ${
                idx === expandedIndex ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
              }`}
            >
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    <Sparkles size={18} />
                  </div>
                  <h3 className="text-2xl font-black text-white" style={{ fontFamily: "'Geom', sans-serif" }}>
                    {service.title}
                  </h3>
                </div>
                
                <p className="text-white/90 text-base leading-relaxed mb-5 max-w-md">
                  {service.description}
                </p>

                <Link 
                  href={`/services/${service.slug || service.id || (service.link?.split('/').pop())}`} 
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-blue-900 font-bold rounded-xl hover:bg-blue-50 transition-colors group/btn"
                >
                  Explore Service
                  <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Selection indicator */}
            {idx === expandedIndex && (
              <div className="absolute top-6 right-6 w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(59,130,246,0.8)]"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
export default ExpandOnHover;
