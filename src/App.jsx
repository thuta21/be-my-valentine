import React, { useState, useEffect } from 'react';

// --- SOUND ENGINE ---
const playSound = (type) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;

    if (type === 'hover') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'hit') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.2);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === 'alarm') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(400, now);
      for (let i = 0; i < 5; i++) {
         osc.frequency.setValueAtTime(600, now + i * 0.3);
         osc.frequency.setValueAtTime(400, now + i * 0.3 + 0.15);
      }
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0, now + 1.5);
      osc.start(now);
      osc.stop(now + 1.5);
    } else if (type === 'win') {
      osc.type = 'square';
      const notes = [440, 554.37, 659.25, 880]; 
      notes.forEach((freq, i) => {
        osc.frequency.setValueAtTime(freq, now + i * 0.15);
      });
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.6);
      osc.start(now);
      osc.stop(now + 0.6);
    }
  } catch (e) {
    console.log("Audio playback blocked.");
  }
};

const PIXEL_COLORS = {
  0: 'transparent', 1: '#000000', 2: '#ff3b6b', 3: '#ff9ebb', 
  4: '#2ecc71', 5: '#33ccff', 6: '#ffffff',
};

const normalHeart = [
  [0,0,1,1,1,0,0,0,1,1,1,0,0], [0,1,2,2,2,1,0,1,2,2,2,1,0], [1,2,2,3,3,2,1,2,2,2,2,2,1],
  [1,2,2,3,2,2,2,2,2,2,2,2,1], [1,2,2,2,2,2,2,2,2,2,2,2,1], [0,1,2,2,2,2,2,2,2,2,2,1,0],
  [0,0,1,2,2,2,2,2,2,2,1,0,0], [0,0,0,1,2,2,2,2,2,1,0,0,0], [0,0,0,0,1,2,2,2,1,0,0,0,0],
  [0,0,0,0,0,1,2,1,0,0,0,0,0], [0,0,0,0,0,0,1,0,0,0,0,0,0],
];
const sadHeart = [
  [0,0,1,1,1,0,0,0,1,1,1,0,0], [0,1,2,2,2,1,0,1,2,2,2,1,0], [1,2,2,3,3,2,1,2,2,2,2,2,1],
  [1,2,2,3,2,2,2,2,2,2,2,2,1], [1,2,1,1,2,2,2,2,1,1,2,2,1], [0,1,2,2,2,2,2,2,2,2,2,1,0],
  [5,5,1,2,2,1,1,1,2,2,1,5,5], [0,5,0,1,2,2,2,2,2,1,0,5,0], [0,0,0,0,1,2,2,2,1,0,0,0,0],
  [0,0,0,0,0,1,2,1,0,0,0,0,0], [0,0,0,0,0,0,1,0,0,0,0,0,0],
];
const happyHeart = [
  [0,0,1,1,1,0,0,0,1,1,1,0,0], [0,1,2,2,2,1,0,1,2,2,2,1,0], [1,2,2,3,3,2,1,2,2,2,2,2,1],
  [1,2,1,2,1,2,2,2,1,2,1,2,1], [1,2,2,2,2,2,2,2,2,2,2,2,1], [0,1,2,2,1,2,2,2,1,2,2,1,0],
  [0,0,1,2,2,1,1,1,2,2,1,0,0], [0,0,0,1,2,2,2,2,2,1,0,0,0], [0,0,0,0,1,2,2,2,1,0,0,0,0],
  [0,0,0,0,0,1,2,1,0,0,0,0,0], [0,0,0,0,0,0,1,0,0,0,0,0,0],
];
const roseSticker = [
  [0,0,0,1,1,1,0,0,0], [0,0,1,2,3,2,1,0,0], [0,1,2,2,2,2,2,1,0], [0,1,2,1,2,1,2,1,0],
  [0,0,1,2,2,2,1,0,0], [0,0,0,1,1,1,0,0,0], [0,1,1,4,4,4,1,1,0], [1,4,4,1,4,1,4,4,1],
  [0,1,1,0,1,0,1,1,0], [0,0,0,0,1,0,0,0,0]
];
const letterSticker = [
  [1,1,1,1,1,1,1,1,1,1,1], [1,6,6,6,6,6,6,6,6,6,1], [1,1,6,6,6,6,6,6,6,1,1],
  [1,6,1,6,6,6,6,6,1,6,1], [1,6,6,1,6,6,6,1,6,6,1], [1,6,6,6,1,2,1,6,6,6,1],
  [1,6,6,6,6,1,6,6,6,6,1], [1,1,1,1,1,1,1,1,1,1,1]
];

const StaticStickers = () => (
  <>
    <CodedPixelArt matrix={roseSticker} className="absolute top-20 left-4 md:left-10 w-16 h-16 md:w-24 md:h-24 opacity-80 -rotate-12 animate-pulse-heart z-0" />
    <CodedPixelArt matrix={letterSticker} className="absolute bottom-20 right-4 md:right-10 w-20 h-20 md:w-32 md:h-32 opacity-80 rotate-12 animate-bounce z-0" />
    <CodedPixelArt matrix={roseSticker} className="absolute bottom-10 left-10 md:left-20 w-12 h-12 md:w-20 md:h-20 opacity-80 rotate-45 animate-pulse-heart z-0" />
    <CodedPixelArt matrix={letterSticker} className="absolute top-24 right-10 md:right-20 w-16 h-16 md:w-24 md:h-24 opacity-80 -rotate-6 animate-float z-0" />
  </>
);

const CodedPixelArt = ({ matrix, className }) => {
  const rows = matrix.length;
  const cols = matrix[0].length;
  return (
    <div className={className}>
      <svg viewBox={`0 0 ${cols} ${rows}`} className="w-full h-full drop-shadow-[0_8px_0_rgba(0,0,0,0.2)]" shapeRendering="crispEdges">
        {matrix.map((row, y) => row.map((colorKey, x) => (
            colorKey !== 0 ? <rect key={`${x}-${y}`} x={x} y={y} width="1.05" height="1.05" fill={PIXEL_COLORS[colorKey]} /> : null
        )))}
      </svg>
    </div>
  );
};

const FloatingHearts = () => {
  const [hearts, setHearts] = useState([]);
  useEffect(() => {
    setHearts(Array.from({ length: 20 }).map((_, i) => ({
      id: i, left: Math.random() * 100, animationDuration: Math.random() * 4 + 4,
      animationDelay: Math.random() * 5, fontSize: Math.random() * 10 + 10
    })));
  }, []);
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((heart) => (
        <div key={heart.id} className="absolute bottom-[-10%] text-pink-500 opacity-70 animate-float"
             style={{ left: `${heart.left}%`, animationDuration: `${heart.animationDuration}s`, animationDelay: `${heart.animationDelay}s`, fontSize: `${heart.fontSize}px`, textShadow: '2px 2px 0 #000' }}>
          {['<3', '❤️', '💖'][Math.floor(Math.random() * 3)]}
        </div>
      ))}
    </div>
  );
};

const Confetti = () => {
  const [particles, setParticles] = useState([]);
  useEffect(() => {
    setParticles(Array.from({ length: 50 }).map((_, i) => ({
      id: i, left: Math.random() * 100, animationDuration: Math.random() * 3 + 2,
      animationDelay: Math.random() * 2, fontSize: Math.random() * 10 + 10,
      emoji: ['✨', '🎉', '💖', '★', '🎵'][Math.floor(Math.random() * 5)]
    })));
  }, []);
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <div key={p.id} className="absolute top-[-10%] opacity-100 animate-confetti"
             style={{ left: `${p.left}%`, animationDuration: `${p.animationDuration}s`, animationDelay: `${p.animationDelay}s`, fontSize: `${p.fontSize}px`, textShadow: '2px 2px 0 #000' }}>
          {p.emoji}
        </div>
      ))}
    </div>
  );
};

const Win95Error = ({ error, onClose }) => (
  <div className="fixed z-[60] bg-[#c0c0c0] border-t-white border-l-white border-b-black border-r-black border-[3px] p-[2px] shadow-[4px_4px_0_rgba(0,0,0,1)] font-pixel text-[8px] md:text-[10px]"
       style={{ top: error.top, left: error.left, width: '240px' }}>
    <div className="bg-[#000080] text-white px-1 py-1 flex justify-between items-center mb-2">
      <span>Error</span>
      <button onClick={() => onClose(error.id)} className="bg-[#c0c0c0] text-black border-t-white border-l-white border-b-black border-r-black border-2 px-1 hover:bg-[#a0a0a0] leading-none">X</button>
    </div>
    <div className="flex items-center gap-3 p-2">
      <div className="text-red-600 text-3xl font-sans font-bold">✖</div>
      <div className="leading-relaxed text-black">{error.text}</div>
    </div>
    <div className="flex justify-center mb-2 mt-2">
      <button onClick={() => onClose(error.id)} className="bg-[#c0c0c0] text-black border-t-white border-l-white border-b-black border-r-black border-2 px-4 py-1 active:border-t-black active:border-l-black active:border-b-white active:border-r-white">OK</button>
    </div>
  </div>
);

export default function App() {
  const [noCount, setNoCount] = useState(0);
  const [yesPressed, setYesPressed] = useState(false);
  const [escapes, setEscapes] = useState(0);
  const [noStyle, setNoStyle] = useState({});
  const [systemOverride, setSystemOverride] = useState(false);
  
  const [errorPopups, setErrorPopups] = useState([]);
  const [secretActivated, setSecretActivated] = useState(false);
  const [yesViruses, setYesViruses] = useState([]); // Array to hold all our YES viruses!

  const phrases = [
    "NO", "ARE YOU SURE?", "REALLY SURE?", "THINK AGAIN!", "LAST CHANCE!",
    "SURELY NOT?", "MISTAKE!", "HAVE A HEART!", "SO COLD!", "CHANGE MIND?",
    "RECONSIDER?", "FINAL ANSWER?", "BREAKING MY <3", "GONNA CRY...", "OKAY YES!"
  ];

  const isLastPhrase = noCount >= phrases.length - 1;
  const maxHits = 9; 
  const totalHits = noCount + escapes;
  const patienceLevel = Math.max(0, 100 - (totalHits / maxHits) * 100);
  
  // Shrinking logic for the 'NO' button
  const currentNoScale = Math.max(0.1, 1 - (totalHits * 0.12));

  useEffect(() => {
    let keys = [];
    const handleKeyDown = (e) => {
      keys.push(e.key.toLowerCase());
      if (keys.length > 4) keys.shift();
      if (keys.join('') === 'love') {
        playSound('win');
        setSecretActivated(true);
        setErrorPopups([]);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const spawnError = () => {
    const messages = ["CRITICAL ERROR: FEELINGS HURT", "WARNING: HEARTBREAK IMMINENT", "SYSTEM FAILURE: JUST SAY YES", "INVALID OPERATION: CANNOT SAY NO", "ERROR: LOVE.EXE CRASHED"];
    setErrorPopups(prev => [...prev, {
      id: Date.now() + Math.random(),
      top: `${Math.random() * 60 + 10}%`,
      left: `${Math.random() * 60 + 10}%`,
      text: messages[Math.floor(Math.random() * messages.length)]
    }]);
  };

  const removeError = (id) => {
    setErrorPopups(prev => prev.filter(err => err.id !== id));
  };

  // Spawns a new YES button somewhere on the screen
  const spawnYesVirus = () => {
    setYesViruses(prev => [...prev, {
      id: Date.now() + Math.random(),
      top: `${Math.random() * 80 + 10}%`,
      left: `${Math.random() * 80 + 10}%`,
      scale: Math.random() * 0.5 + 0.8, // Randomize size a bit
    }]);
  };

  const triggerYes = () => {
    playSound('win');
    setYesPressed(true);
    setErrorPopups([]);
    setYesViruses([]); // Clear viruses when she finally says YES
  };

  const handleNoClick = () => {
    if (isLastPhrase || systemOverride) {
      triggerYes();
    } else {
      playSound('hit');
      setNoCount(noCount + 1);
      if (noCount >= 1) {
        spawnError();
        spawnYesVirus(); // Spawn a virus!
      }
    }
  };

  const handleNoHover = () => {
    if (noCount >= 2 && !systemOverride) {
      playSound('hover');
      setEscapes(escapes + 1);
      
      if (escapes % 2 === 0) spawnError();
      
      // Spawn YES viruses exponentially!
      const virusCount = Math.floor(escapes / 2) + 1;
      for (let i = 0; i < virusCount; i++) {
        spawnYesVirus();
      }
      
      if (escapes >= 7) {
        playSound('alarm');
        setSystemOverride(true);
        setNoStyle({});
        setErrorPopups([]);
        return;
      }

      setNoStyle({
        position: 'fixed',
        top: `${Math.random() * 70 + 15}%`,
        left: `${Math.random() * 70 + 15}%`,
        rotate: Math.random() * 30 - 15,
      });
    }
  };

  const getNoButtonText = () => {
    if (systemOverride) return "RESISTANCE IS FUTILE";
    return phrases[Math.min(noCount, phrases.length - 1)];
  };

  if (secretActivated) {
    return (
      <div className="min-h-screen bg-pink-400 flex flex-col items-center justify-center font-pixel text-center p-8 z-50 relative overflow-hidden">
        <Confetti />
        <CodedPixelArt matrix={happyHeart} className="w-48 h-48 mb-8 animate-bounce" />
        <h1 className="text-2xl md:text-5xl text-white mb-6 leading-relaxed drop-shadow-md">
          CHEAT CODE ACTIVATED!
        </h1>
        <p className="text-white text-xs md:text-xl leading-loose max-w-xl">
          YOU TYPED "LOVE"! <br/><br/>
          YOU FOUND THE SECRET SHORTCUT TO MY HEART. <br/>
          SEE YOU ON OUR DATE! 💖
        </p>
      </div>
    );
  }

  if (systemOverride && !yesPressed) {
    const overrideMessage = "SYSTEM OVERRIDE\n\nERROR 404:\n\"NO\" NOT FOUND\n\nYOU HAVE EXHAUSTED ALL ESCAPE ROUTES.\n\nACCEPT YOUR FATE.";
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center overflow-hidden relative font-pixel select-none">
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
            .font-pixel { font-family: 'Press Start 2P', monospace; }
            .pixel-btn { border: 4px solid #fff; box-shadow: 4px 4px 0px 0px rgba(255,255,255,1); transition: transform 0.1s, box-shadow 0.1s; }
            .pixel-btn:active { box-shadow: 0px 0px 0px 0px rgba(255,255,255,1); transform: translate(4px, 4px); }
            @keyframes glitch { 
              0% { transform: translate(0) } 20% { transform: translate(-5px, 5px) } 40% { transform: translate(-5px, -5px) } 
              60% { transform: translate(5px, 5px) } 80% { transform: translate(5px, -5px) } 100% { transform: translate(0) } 
            }
            .animate-glitch { animation: glitch 0.2s linear infinite; }
          `}
        </style>
        
        <div className="absolute inset-0 z-0 flex flex-wrap opacity-20 text-red-600 font-bold overflow-hidden pointer-events-none text-2xl">
          {Array.from({length: 150}).map((_, i) => <span key={i} className="m-2">YES</span>)}
        </div>

        <div className="z-10 bg-red-950 p-8 md:p-12 text-center flex flex-col items-start max-w-2xl w-[90%] mx-auto border-4 border-red-500 shadow-[0_0_50px_rgba(255,0,0,0.8)] min-h-[400px]">
          <h1 className="text-sm md:text-xl text-red-400 mb-6 leading-relaxed text-left w-full h-48 whitespace-pre-line">
             {overrideMessage}
          </h1>
          <button className="bg-green-500 hover:bg-green-400 text-black pixel-btn z-20 w-full py-8 text-xl md:text-3xl animate-pulse mt-10" onClick={triggerYes}>
            YES I WILL!
          </button>
        </div>
      </div>
    );
  }

  return (
    // Dynamic styling added for Screen Shake
    <div className={`min-h-screen bg-pink-300 bg-pixel-grid flex flex-col items-center justify-center overflow-hidden relative font-pixel select-none pt-10 ${!yesPressed && patienceLevel <= 50 ? 'animate-screen-shake' : ''}`}>
      
      {/* Dynamic Style block for animations and pixel fonts */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
          .font-pixel { font-family: 'Press Start 2P', monospace; }
          .bg-pixel-grid {
            background-size: 32px 32px;
            background-image: linear-gradient(to right, rgba(0,0,0,0.05) 2px, transparent 2px), linear-gradient(to bottom, rgba(0,0,0,0.05) 2px, transparent 2px);
          }
          .pixel-borders { border: 4px solid #000; box-shadow: 8px 8px 0px 0px rgba(0,0,0,1); }
          .pixel-btn { border: 4px solid #000; box-shadow: 4px 4px 0px 0px rgba(0,0,0,1); transition: transform 0.1s, box-shadow 0.1s; }
          .pixel-btn:active { box-shadow: 0px 0px 0px 0px rgba(0,0,0,1); transform: translate(4px, 4px); }
          
          @keyframes float { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(-120vh) rotate(360deg); opacity: 0; } }
          .animate-float { animation: float linear infinite; }
          
          @keyframes confetti { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(110vh) rotate(720deg); opacity: 0; } }
          .animate-confetti { animation: confetti linear infinite; }
          
          @keyframes pulse-heart { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
          .animate-pulse-heart { animation: pulse-heart 1s step-end infinite; }
          
          @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px) rotate(-5deg); } 75% { transform: translateX(5px) rotate(5deg); } }
          .animate-shake { animation: shake 0.4s ease-in-out infinite; }
          
          /* Hard Screen Shake Animation */
          @keyframes screen-shake {
            0% { transform: translate(1px, 1px) rotate(0deg); }
            10% { transform: translate(-1px, -2px) rotate(-1deg); }
            20% { transform: translate(-3px, 0px) rotate(1deg); }
            30% { transform: translate(3px, 2px) rotate(0deg); }
            40% { transform: translate(1px, -1px) rotate(1deg); }
            50% { transform: translate(-1px, 2px) rotate(-1deg); }
            60% { transform: translate(-3px, 1px) rotate(0deg); }
            70% { transform: translate(3px, 1px) rotate(-1deg); }
            80% { transform: translate(-1px, -1px) rotate(1deg); }
            90% { transform: translate(1px, 2px) rotate(0deg); }
            100% { transform: translate(1px, -2px) rotate(-1deg); }
          }
          .animate-screen-shake { animation: screen-shake 0.4s infinite; }
        `}
      </style>

      {/* Red Alert Overlay (Triggers when Patience < 25%) */}
      {!yesPressed && patienceLevel <= 25 && (
        <div className="pointer-events-none fixed inset-0 z-40 shadow-[inset_0_0_100px_rgba(255,0,0,0.8)] bg-red-900/30 animate-pulse mix-blend-multiply"></div>
      )}

      {/* Render Fake Error Popups */}
      {errorPopups.map((error) => (
        <Win95Error key={error.id} error={error} onClose={removeError} />
      ))}

      {/* Render the YES Viruses! */}
      {!yesPressed && yesViruses.map((v) => (
        <button
          key={v.id}
          className="fixed bg-green-400 hover:bg-green-500 text-black pixel-btn z-50 animate-pulse-heart"
          style={{
            top: v.top, left: v.left,
            transform: `scale(${v.scale})`,
            fontSize: '12px', padding: '12px 16px'
          }}
          onClick={triggerYes}
        >
          YES!
        </button>
      ))}

      {/* Health Bar / Patience Meter */}
      {!yesPressed && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-[85%] max-w-md z-30 pixel-borders bg-black p-2 md:p-3">
          <div className="text-white text-[8px] md:text-xs mb-2 flex justify-between">
            <span>PATIENCE METER</span>
            <span className={patienceLevel <= 25 ? 'text-red-500 animate-pulse' : ''}>{Math.round(patienceLevel)}%</span>
          </div>
          <div className="w-full h-4 md:h-6 bg-gray-800 border-2 border-white">
            <div 
              className={`h-full transition-all duration-300 ${patienceLevel > 50 ? 'bg-green-500' : patienceLevel > 25 ? 'bg-yellow-400' : 'bg-red-500'}`} 
              style={{ width: `${patienceLevel}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Render background elements */}
      <FloatingHearts />
      {!yesPressed && <StaticStickers />}
      {yesPressed && <Confetti />}

      {/* Main Interactive Card */}
      <div className="z-10 bg-white p-8 md:p-12 text-center flex flex-col items-center max-w-2xl w-[90%] mx-auto pixel-borders relative mt-8">
        
        {yesPressed ? (
          <>
            <CodedPixelArt matrix={happyHeart} className="w-32 h-32 md:w-48 md:h-48 mb-8 animate-bounce" />
            <h1 className="text-xl md:text-3xl text-pink-600 mb-6 leading-relaxed animate-pulse-heart">PLAYER 2 JOINED! <br/> YAYYYYY!</h1>
            <p className="text-xs md:text-sm text-pink-500 leading-loose">I KNEW YOU'D SAY YES! <br/> READY FOR OUR DATE!</p>
          </>
        ) : (
          <>
            <CodedPixelArt matrix={noCount === 0 ? normalHeart : sadHeart} className={`w-32 h-32 md:w-48 md:h-48 mb-8 ${noCount > 0 ? 'animate-shake' : 'animate-pulse-heart'}`} />
            <h1 className="text-lg md:text-2xl text-pink-600 mb-10 leading-relaxed mt-2">BE MY VALENTINE? <br/> (Y/N)</h1>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full flex-wrap">
              <button
                className="bg-green-400 hover:bg-green-500 text-black pixel-btn z-20 animate-pulse-heart"
                style={{ fontSize: `${noCount * 4 + 12}px`, padding: '16px 24px', maxWidth: '100%', wordBreak: 'break-word', lineHeight: '1.5' }}
                onClick={triggerYes}
              >
                YES!
              </button>

              {/* NO BUTTON - Inside Card (Shrinks!) */}
              {escapes === 0 && (
                <button
                  className={`pixel-btn px-6 py-4 z-10 ${isLastPhrase ? 'bg-green-400 hover:bg-green-500 text-black animate-pulse-heart' : 'bg-red-400 hover:bg-red-500 text-black'}`}
                  style={{ fontSize: '10px', lineHeight: '1.8', transform: `scale(${currentNoScale})` }}
                  onClick={handleNoClick}
                  onMouseEnter={handleNoHover}
                  onTouchStart={handleNoHover}
                >
                  {getNoButtonText()}
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* ESCAPED NO BUTTON - Floats outside, and shrinks exponentially! */}
      {escapes > 0 && !yesPressed && (
        <button
          className={`pixel-btn px-6 py-4 z-[9999] ${isLastPhrase ? 'bg-green-400 hover:bg-green-500 text-black animate-pulse-heart' : 'bg-red-400 hover:bg-red-500 text-black'}`}
          style={{ fontSize: '10px', lineHeight: '1.8', top: noStyle.top, left: noStyle.left, position: noStyle.position, transform: `translate(-50%, -50%) rotate(${noStyle.rotate || 0}deg) scale(${currentNoScale})` }}
          onClick={handleNoClick}
          onMouseEnter={handleNoHover}
          onTouchStart={handleNoHover}
        >
          {getNoButtonText()}
        </button>
      )}
    </div>
  );
}