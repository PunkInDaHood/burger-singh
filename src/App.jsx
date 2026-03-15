import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MousePointer2, ChevronRight, Check } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// --- COMPONENT: Navbar ---
const Navbar = () => {
  const navRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        start: 'top -10',
        end: 99999,
        onToggle: (self) => {
          if (!self.isActive) {
            navRef.current.classList.remove('bg-background/80', 'backdrop-blur-xl', 'border-dark/10', 'text-primary', 'shadow-sm');
            navRef.current.classList.add('bg-transparent', 'text-white', 'border-transparent');
          } else {
            navRef.current.classList.add('bg-background/80', 'backdrop-blur-xl', 'border-dark/10', 'text-primary', 'shadow-sm');
            navRef.current.classList.remove('bg-transparent', 'text-white', 'border-transparent');
          }
        }
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 w-full">
      <nav ref={navRef} className="px-6 py-3 rounded-[2rem] border border-transparent transition-all duration-300 flex items-center gap-10 bg-transparent text-white">
        <span className="font-sans font-bold tracking-tight text-lg">Burger Singh</span>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#philosophy" className="hover:-translate-y-[1px] transition-transform">Philosophy</a>
          <a href="#protocol" className="hover:-translate-y-[1px] transition-transform">Protocol</a>
          <a href="#menu" className="hover:-translate-y-[1px] transition-transform">Menu</a>
        </div>
        <button className="relative overflow-hidden group bg-accent text-white px-5 py-2 rounded-full text-sm font-medium transition-transform duration-300 hover:scale-[1.03] shadow-lg">
          <span className="relative z-10">Order Now</span>
          <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
        </button>
      </nav>
    </div>
  );
};

// --- COMPONENT: FallingBurger ---
const FallingBurger = () => {
  const containerRef = useRef(null);
  const burgerRef = useRef(null);
  
  // Store random values on elements or use a simpler approach so it's consistent
  useLayoutEffect(() => {
    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        const layers = gsap.utils.toArray('.burger-layer');
        
        // Ensure starting state is clean
        gsap.set(layers, { x: 0, y: 0, rotation: 0 });

        // 1. Initial drop entrance (Only runs once)
        gsap.from(layers, { 
          y: -300, 
          opacity: 0, 
          rotation: (i) => (i % 2 === 0 ? 15 : -15), // deterministic rotation for initial drop
          duration: 1, 
          stagger: 0.15, 
          ease: "bounce.out", 
          delay: 0.8 
        });

        // 2. Slow floating effect
        gsap.to(burgerRef.current, {
          y: -15,
          duration: 2.5,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
          delay: 2.5
        });
        
        // 3. Falling / Rotating effect as we scroll down
        gsap.to(containerRef.current, {
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            scrub: 1
          },
          y: 200, // No rotation! Let it just fall smoothly.
          ease: "none"
        });
        
        // 4. Spread effect at Footer (Horizontally flat)
        gsap.to(layers, {
          scrollTrigger: {
            trigger: "#footer", 
            start: "top 80%",
            end: "bottom bottom",
            scrub: true
          }, // End of scrollTrigger object
          x: 0, // Keep them vertically aligned!
          y: (i) => {
            // Expand the burger out vertically, starting from 350px offset
            // Top layers shift up less, bottom layers shift down more
            const shift = i - (layers.length - 1) / 2;
            return 350 + (shift * 40); // 40px vertical separation
          },
          rotation: (i) => (i % 2 === 0 ? 3 : -3), // Very subtle playful rotation
          ease: "power2.inOut"
        });
        
      });
      return () => ctx.revert();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={containerRef} className="fixed right-4 md:right-32 top-[40%] md:top-[35%] z-[100] hidden md:flex flex-col items-center justify-center pointer-events-none">
      <div ref={burgerRef} className="w-52 relative flex flex-col items-center justify-center">
        {/* Top Bun */}
        <div className="burger-layer z-10 w-44 h-14 bg-[#E5B869] rounded-t-[3rem] rounded-b-sm border-b border-[#C99C49] relative">
          <div className="absolute top-3 left-8 w-2.5 h-1.5 bg-[#F4E1B3] rounded-full"></div>
          <div className="absolute top-6 right-10 w-2 h-1.5 bg-[#F4E1B3] rounded-full"></div>
          <div className="absolute top-2 right-14 w-2 h-1.5 bg-[#F4E1B3] rounded-full"></div>
        </div>
        
        {/* Cabbage / Lettuce Leaf */}
        <div className="burger-layer z-10 w-48 h-4 bg-[#759F4D] rounded-full drop-shadow-sm"></div>

        {/* Tomato Slice */}
        <div className="burger-layer z-10 w-43 h-3.5 bg-[#D9381E] rounded-md drop-shadow-sm flex justify-around items-center px-4">
          <div className="w-3 h-1 bg-[#F4A460] rounded-full opacity-60"></div>
          <div className="w-3 h-1 bg-[#F4A460] rounded-full opacity-60"></div>
        </div>
        
        {/* Cheese Overlay */}
        <div className="burger-layer z-10 w-46 h-3 bg-[#F4D03F] rounded-sm drop-shadow-sm"></div>
        
        {/* Thick Meat Patty */}
        <div className="burger-layer z-10 w-44 h-10 bg-[#4A3219] rounded-[10px] shadow-sm border-b-[2px] border-[#2A1C0E]"></div>

        {/* Potato Patty */}
        <div className="burger-layer z-10 w-44 h-6 bg-[#C59B3C] rounded-lg shadow-sm border border-[#A37B24] flex overflow-hidden">
           <div className="w-full h-full opacity-25 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,#A37B24_2px,#A37B24_4px)]"></div>
        </div>

        {/* Bottom Bun */}
        <div className="burger-layer z-10 w-44 h-10 bg-[#E5B869] rounded-b-[2rem] rounded-t-sm shadow-md border-t border-[#C99C49]"></div>
      </div>
    </div>
  );
};

// --- COMPONENT: HeroSection ---
const HeroSection = () => {
  const container = useRef(null);
  const textRef = useRef(null);
  const burgerRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Text reveal
      gsap.fromTo(textRef.current.children, 
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: "power3.out", delay: 0.2 }
      );

      // Floating animation for whole burger - Removed, now in FallingBurger
    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={container} className="relative h-[100dvh] w-full overflow-hidden bg-dark flex items-end">
      {/* Background Image & Gradient */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=2000&auto=format&fit=crop" 
          alt="Dark Moody Organic Texture" 
          className="w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/80 to-transparent"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-24 md:pb-32 flex flex-col md:flex-row justify-between items-end">
        
        <div ref={textRef} className="max-w-3xl">
          <h1 className="text-white flex flex-col items-start leading-none gap-2">
            <span className="font-sans font-bold text-3xl md:text-5xl tracking-tight uppercase">Crafting taste is the</span>
            <span className="font-drama italic text-6xl md:text-8xl text-background">Revolution.</span>
          </h1>
          <p className="mt-6 text-background/80 max-w-md font-sans text-lg">
            Precision flavor mapping engineered with organic ingredients. A striking approach to modern culinary design.
          </p>
          <button className="mt-10 relative overflow-hidden group bg-accent text-white px-8 py-4 rounded-full text-lg font-medium transition-transform duration-300 hover:scale-[1.03] flex items-center gap-2">
            <span className="relative z-10">Place Ritual Order</span>
            <ChevronRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
          </button>
        </div>

      </div>
    </section>
  );
};

// --- COMPONENT: Features (Cards) ---
const FeatureCards = () => {
  const [cards, setCards] = useState(["Visual Appeal", "Aromatic Profile", "Texture Contrast"]);
  const [typedText, setTypedText] = useState("");
  const typingString = "> ENGAGING_SENSORY_CORTEX...\n> SIGNAL_DETECTED: MAXIMUM_FLAVOR.\n> ATTENTION SECURED.";
  const containerRef = useRef();

  // Shuffler Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setCards(prev => {
        const newArr = [...prev];
        const last = newArr.pop();
        newArr.unshift(last);
        return newArr;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Typewriter Logic
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(typingString.slice(0, i));
      i++;
      if (i > typingString.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.feature-card', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="py-32 px-6 bg-background text-dark" ref={containerRef}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="text-sm font-mono-data text-accent font-semibold tracking-widest uppercase mb-4">Value Architecture</h2>
          <h3 className="text-4xl md:text-5xl font-sans tracking-tight leading-tight max-w-2xl">
            Designed to disrupt routine.<br/> <span className="text-primary italic font-drama">Engineered for impact.</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-auto md:h-[400px]">
          
          {/* Card 1: Diagnostic Shuffler (Attractive) */}
          <div className="feature-card bg-white rounded-[2rem] p-8 shadow-sm border border-dark/5 relative overflow-hidden flex flex-col justify-between">
            <div>
              <h4 className="font-sans font-bold text-xl">Diagnostic Shuffler</h4>
              <p className="text-dark/60 text-sm mt-2">Continuous evaluation of attractive properties.</p>
            </div>
            <div className="relative h-48 mt-8 flex items-center justify-center">
              {cards.map((card, i) => (
                <div 
                  key={card} 
                  className="absolute w-full py-4 px-6 bg-background rounded-2xl border border-dark/10 shadow-md transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex items-center justify-between"
                  style={{
                    transform: `translateY(${(i - 1) * 20}px) scale(${1 - Math.abs(i - 1) * 0.05})`,
                    zIndex: 10 - i,
                    opacity: i === 1 ? 1 : 0.6
                  }}
                >
                  <span className="font-mono-data text-xs text-primary">{`0${i+1}`}</span>
                  <span className="font-sans font-medium text-sm">{card}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Telemetry Typewriter (Attention Grabbing) */}
          <div className="feature-card bg-dark text-background rounded-[2rem] p-8 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-sans font-bold text-xl text-white">Telemetry Feed</h4>
                <p className="text-background/60 text-sm mt-2">Attention grabbing sub-routine.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                <span className="text-[10px] uppercase font-mono-data tracking-widest text-accent">Live</span>
              </div>
            </div>
            <div className="mt-8 bg-black/40 rounded-2xl p-6 border border-white/5 h-48 overflow-hidden">
              <pre className="font-mono-data text-xs text-primary whitespace-pre-wrap leading-loose">
                {typedText}
                <span className="inline-block w-2 h-4 bg-accent align-middle ml-1 animate-pulse"></span>
              </pre>
            </div>
          </div>

          {/* Card 3: Cursor Protocol Scheduler (Invested) */}
          <div className="feature-card bg-white rounded-[2rem] p-8 shadow-sm border border-dark/5 relative overflow-hidden flex flex-col justify-between group">
            <div>
              <h4 className="font-sans font-bold text-xl">Investment Scheduler</h4>
              <p className="text-dark/60 text-sm mt-2">Pre-allocating culinary resources.</p>
            </div>
            <div className="mt-8 relative h-48 bg-background/50 rounded-2xl p-4 border border-dark/5">
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['S','M','T','W','T','F','S'].map((d,i) => (
                  <div key={i} className="text-center font-mono-data text-[10px] text-dark/40">{d}</div>
                ))}
                {Array(7).fill(0).map((_,i) => (
                  <div key={i} className={`aspect-square rounded-md transition-colors duration-500 ${i === 3 ? 'bg-primary' : 'bg-dark/5'}`}></div>
                ))}
              </div>
              
              <div className="absolute right-4 bottom-4 bg-dark text-white text-xs px-4 py-2 rounded-full font-mono-data flex items-center gap-2 cursor-pointer transition-transform hover:scale-105">
                Commit <Check className="w-3 h-3 text-accent" />
              </div>

              {/* Fake cursor animation */}
              <MousePointer2 className="absolute text-accent w-5 h-5 fill-accent opacity-0 group-hover:opacity-100 transition-opacity" 
                style={{
                  animation: 'cursorAnim 4s ease-in-out infinite'
                }}
              />
              <style>{`
                @keyframes cursorAnim {
                  0% { transform: translate(10px, 10px); }
                  30% { transform: translate(110px, 40px); }
                  40% { transform: translate(110px, 40px) scale(0.9); }
                  45% { transform: translate(110px, 40px) scale(1); }
                  70% { transform: translate(180px, 110px); }
                  80% { transform: translate(180px, 110px) scale(0.9); }
                  100% { transform: translate(10px, 10px); }
                }
              `}</style>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

// --- COMPONENT: Philosophy ---
const Philosophy = () => {
  const container = useRef();
  
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.phil-word', {
        scrollTrigger: {
          trigger: container.current,
          start: "top 60%",
        },
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.05,
        ease: "power2.out"
      });
    }, container);
    return () => ctx.revert();
  }, []);

  const statement1 = "Most fast food focuses on: generic mass production.".split(" ");
  const statement2 = "We focus on: precision engineered culinary art.".split(" ");

  return (
    <section id="philosophy" ref={container} className="relative py-32 px-6 bg-dark text-background overflow-hidden flex flex-col items-center justify-center text-center min-h-[70vh]">
      <div className="absolute inset-0 opacity-20 parallax-bg">
        <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover" alt="Organic texture" />
      </div>
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col gap-12">
        <p className="font-sans text-xl md:text-2xl text-background/60">
          {statement1.map((w, i) => <span key={i} className="phil-word inline-block mr-2">{w}</span>)}
        </p>
        <p className="font-drama italic text-5xl md:text-7xl leading-tight">
          {statement2.map((w, i) => <span key={i} className={`phil-word inline-block mr-3 ${w.includes('art') ? 'text-accent' : ''}`}>{w}</span>)}
        </p>
      </div>
    </section>
  );
};

// --- COMPONENT: Protocol (Sticky Stacking) ---
const Protocol = () => {
  const container = useRef();
  const cards = useRef([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      cards.current.forEach((card, index) => {
        if (index > 0) {
          gsap.fromTo(cards.current[index - 1], 
            { scale: 1, filter: "blur(0px)", opacity: 1 },
            {
              scale: 0.9,
              filter: "blur(20px)",
              opacity: 0.5,
              scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end: "top top",
                scrub: true
              }
            }
          );
        }
      });
    }, container);
    return () => ctx.revert();
  }, []);

  const steps = [
    { title: "Source & Selection", desc: "Rigorous biological screening of all produce. Only optimal specimens pass.", num: "01" },
    { title: "Thermal Execution", desc: "Heat application measured down to the centigrade. Maillard reaction guaranteed.", num: "02" },
    { title: "Architecture Assembly", desc: "Structural integrity testing of layers. Optimal sauce distribution matrix applied.", num: "03" }
  ];

  return (
    <section id="protocol" ref={container} className="bg-background relative">
      {steps.map((step, i) => (
        <div 
          key={i} 
          ref={el => cards.current[i] = el}
          className="h-screen w-full flex items-center justify-center sticky top-0 bg-background overflow-hidden border-t border-dark/5"
        >
          <div className="w-full max-w-5xl px-6 flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-1/2 flex justify-center">
              {/* Abstract Visuals for Steps */}
              {i === 0 && (
                <svg className="w-64 h-64 text-primary animate-[spin_20s_linear_infinite]" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="4 4" />
                  <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="2" fill="none" />
                  <polygon points="50,25 70,65 30,65" stroke="var(--color-accent)" strokeWidth="1" fill="none" />
                </svg>
              )}
              {i === 1 && (
                <div className="w-64 h-64 bg-dark/5 rounded-full relative overflow-hidden flex items-center">
                  <div className="w-full h-1 bg-accent absolute animate-[bounce_2s_ease-in-out_infinite]"></div>
                  <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 gap-1 p-2 opacity-20">
                    {Array(100).fill(0).map((_, j) => <div key={j} className="bg-dark rounded-full"></div>)}
                  </div>
                </div>
              )}
              {i === 2 && (
                <svg className="w-64 h-64 text-primary" viewBox="0 0 100 100">
                  <path d="M10,50 Q25,10 50,50 T90,50" fill="none" stroke="currentColor" strokeWidth="2"
                    style={{ strokeDasharray: 200, strokeDashoffset: 0, animation: 'dash 3s linear infinite' }}
                  />
                  <style>{`@keyframes dash { to { stroke-dashoffset: -200; } }`}</style>
                </svg>
              )}
            </div>
            <div className="w-full md:w-1/2">
              <span className="font-mono-data text-accent text-sm tracking-widest uppercase block mb-4">Phase {step.num}</span>
              <h2 className="text-4xl md:text-5xl font-sans font-bold tracking-tight mb-6">{step.title}</h2>
              <p className="text-dark/70 text-lg max-w-md">{step.desc}</p>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

// --- COMPONENT: Menu/Membership ---
const Menu = () => {
  return (
    <section id="menu" className="py-32 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-sans text-4xl md:text-5xl font-bold tracking-tight mb-4">Culinary Modules</h2>
          <p className="font-mono-data text-dark/50 text-sm uppercase tracking-widest">Select your payload</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-5xl mx-auto">
          {/* Item 1 */}
          <div className="bg-white rounded-[2rem] p-8 border border-dark/5 shadow-sm text-center transition-transform hover:-translate-y-2">
            <h3 className="font-sans font-bold text-xl mb-2">The Standard Paradigm</h3>
            <p className="text-dark/60 text-sm mb-8">Classic configuration. Single protein core, organic synthetics.</p>
            <div className="text-3xl font-mono-data font-semibold text-primary mb-8">$12</div>
            <button className="w-full relative overflow-hidden group bg-background border border-dark/10 text-dark px-6 py-3 rounded-full text-sm font-medium transition-transform duration-300 hover:scale-[1.03]">
              <span className="relative z-10">Add to Interface</span>
              <span className="absolute inset-0 bg-dark/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
            </button>
          </div>

          {/* Item 2 (Popped) */}
          <div className="bg-primary text-background rounded-[2rem] p-10 shadow-2xl scale-105 z-10 -mx-2 text-center border border-primary/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4"><div className="w-2 h-2 rounded-full bg-accent animate-ping"></div></div>
            <h3 className="font-sans font-bold text-2xl mb-2 text-white">The Alpha Execution</h3>
            <p className="text-background/80 text-sm mb-8 relative z-10">Double density protein. Enhanced sensory sauce algorithm.</p>
            <div className="text-4xl font-mono-data font-semibold text-accent mb-8 relative z-10">$18</div>
            <button className="w-full relative overflow-hidden group bg-accent text-white px-6 py-4 rounded-full text-sm font-medium transition-transform duration-300 hover:scale-[1.03] shadow-md z-10">
              <span className="relative z-10">Add to Interface</span>
              <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
            </button>
          </div>

          {/* Item 3 */}
          <div className="bg-white rounded-[2rem] p-8 border border-dark/5 shadow-sm text-center transition-transform hover:-translate-y-2">
            <h3 className="font-sans font-bold text-xl mb-2">Botanical Override</h3>
            <p className="text-dark/60 text-sm mb-8">Plant-based simulation. Zero compromise on structural integrity.</p>
            <div className="text-3xl font-mono-data font-semibold text-primary mb-8">$14</div>
            <button className="w-full relative overflow-hidden group bg-background border border-dark/10 text-dark px-6 py-3 rounded-full text-sm font-medium transition-transform duration-300 hover:scale-[1.03]">
              <span className="relative z-10">Add to Interface</span>
              <span className="absolute inset-0 bg-dark/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- COMPONENT: Footer ---
const Footer = () => {
  return (
    <footer id="footer" className="bg-dark text-background rounded-t-[4rem] px-6 py-20 pb-40 relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
        <div className="md:col-span-2">
          <h2 className="font-sans font-bold text-2xl mb-4 text-white">Burger Singh</h2>
          <p className="text-background/60 text-sm max-w-sm">Precision longevity medicine powered by biological data... Wait, no. Precision flavor delivery powered by organic culinary tech.</p>
          
          <div className="mt-8 flex items-center gap-3 bg-white/5 inline-flex px-4 py-2 rounded-full border border-white/10">
            <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)] animate-pulse"></div>
            <span className="font-mono-data text-[10px] uppercase tracking-widest text-background/80">System Operational</span>
          </div>
        </div>
        
        <div>
          <h4 className="font-mono-data text-xs uppercase tracking-widest text-white/40 mb-6">Navigation</h4>
          <ul className="flex flex-col gap-3 text-sm text-background/80 font-medium">
            <li><a href="#" className="hover:text-accent transition-colors">Home</a></li>
            <li><a href="#philosophy" className="hover:text-accent transition-colors">Philosophy</a></li>
            <li><a href="#protocol" className="hover:text-accent transition-colors">Protocol</a></li>
            <li><a href="#menu" className="hover:text-accent transition-colors">Menu</a></li>
          </ul>
        </div>

        <div>
           <h4 className="font-mono-data text-xs uppercase tracking-widest text-white/40 mb-6">Legal</h4>
          <ul className="flex flex-col gap-3 text-sm text-background/80 font-medium">
            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Data Protocol</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

// --- MAIN APP ---
function App() {
  return (
    <div className="font-sans w-full min-h-screen bg-background text-dark selection:bg-accent selection:text-white">
      <Navbar />
      <FallingBurger />
      <HeroSection />
      <FeatureCards />
      <Philosophy />
      <Protocol />
      <Menu />
      <Footer />
    </div>
  );
}

export default App;
