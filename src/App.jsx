import React, { useState, useEffect } from 'react';

// The color palette for our coded pixel art
const PIXEL_COLORS = {
  0: 'transparent',
  1: '#000000', // Black outline
  2: '#ff3b6b', // Red heart body
  3: '#ff9ebb', // Pink shine
  4: '#2ecc71', // Green leaves
  5: '#33ccff', // Blue tears
  6: '#ffffff', // White envelope
};

// Normal Heart Sticker (Asking)
const normalHeart = [
  [0,0,1,1,1,0,0,0,1,1,1,0,0],
  [0,1,2,2,2,1,0,1,2,2,2,1,0],
  [1,2,2,3,3,2,1,2,2,2,2,2,1],
  [1,2,2,3,2,2,2,2,2,2,2,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,1],
  [0,1,2,2,2,2,2,2,2,2,2,1,0],
  [0,0,1,2,2,2,2,2,2,2,1,0,0],
  [0,0,0,1,2,2,2,2,2,1,0,0,0],
  [0,0,0,0,1,2,2,2,1,0,0,0,0],
  [0,0,0,0,0,1,2,1,0,0,0,0,0],
  [0,0,0,0,0,0,1,0,0,0,0,0,0],
];

// Sad Heart Sticker (When 'No' is clicked)
const sadHeart = [
  [0,0,1,1,1,0,0,0,1,1,1,0,0],
  [0,1,2,2,2,1,0,1,2,2,2,1,0],
  [1,2,2,3,3,2,1,2,2,2,2,2,1],
  [1,2,2,3,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,2,2,2,2,1,1,2,2,1], // Eyes flat and sad
  [0,1,2,2,2,2,2,2,2,2,2,1,0],
  [5,5,1,2,2,1,1,1,2,2,1,5,5], // Sad mouth & crying tears
  [0,5,0,1,2,2,2,2,2,1,0,5,0], // Falling tears
  [0,0,0,0,1,2,2,2,1,0,0,0,0],
  [0,0,0,0,0,1,2,1,0,0,0,0,0],
  [0,0,0,0,0,0,1,0,0,0,0,0,0],
];

// Happy Heart Sticker (When 'Yes' is clicked)
const happyHeart = [
  [0,0,1,1,1,0,0,0,1,1,1,0,0],
  [0,1,2,2,2,1,0,1,2,2,2,1,0],
  [1,2,2,3,3,2,1,2,2,2,2,2,1],
  [1,2,1,2,1,2,2,2,1,2,1,2,1], // Happy squinting eyes ^ ^
  [1,2,2,2,2,2,2,2,2,2,2,2,1],
  [0,1,2,2,1,2,2,2,1,2,2,1,0], // Big smile edges
  [0,0,1,2,2,1,1,1,2,2,1,0,0], // Smile bottom
  [0,0,0,1,2,2,2,2,2,1,0,0,0],
  [0,0,0,0,1,2,2,2,1,0,0,0,0],
  [0,0,0,0,0,1,2,1,0,0,0,0,0],
  [0,0,0,0,0,0,1,0,0,0,0,0,0],
];

// Rose Sticker
const roseSticker = [
  [0,0,0,1,1,1,0,0,0],
  [0,0,1,2,3,2,1,0,0],
  [0,1,2,2,2,2,2,1,0],
  [0,1,2,1,2,1,2,1,0],
  [0,0,1,2,2,2,1,0,0],
  [0,0,0,1,1,1,0,0,0],
  [0,1,1,4,4,4,1,1,0],
  [1,4,4,1,4,1,4,4,1],
  [0,1,1,0,1,0,1,1,0],
  [0,0,0,0,1,0,0,0,0]
];

// Love Letter Sticker
const letterSticker = [
  [1,1,1,1,1,1,1,1,1,1,1],
  [1,6,6,6,6,6,6,6,6,6,1],
  [1,1,6,6,6,6,6,6,6,1,1],
  [1,6,1,6,6,6,6,6,1,6,1],
  [1,6,6,1,6,6,6,1,6,6,1],
  [1,6,6,6,1,2,1,6,6,6,1],
  [1,6,6,6,6,1,6,6,6,6,1],
  [1,1,1,1,1,1,1,1,1,1,1]
];

// Static Stickers for the background
const StaticStickers = () => (
  <>
    <CodedPixelArt matrix={roseSticker} className="absolute top-10 left-4 md:left-10 w-16 h-16 md:w-24 md:h-24 opacity-80 -rotate-12 animate-pulse-heart z-0" />
    <CodedPixelArt matrix={letterSticker} className="absolute bottom-20 right-4 md:right-10 w-20 h-20 md:w-32 md:h-32 opacity-80 rotate-12 animate-bounce z-0" />
    <CodedPixelArt matrix={roseSticker} className="absolute bottom-10 left-10 md:left-20 w-12 h-12 md:w-20 md:h-20 opacity-80 rotate-45 animate-pulse-heart z-0" />
    <CodedPixelArt matrix={letterSticker} className="absolute top-20 right-10 md:right-20 w-16 h-16 md:w-24 md:h-24 opacity-80 -rotate-6 animate-float z-0" />
  </>
);

// Component that draws the pixel art directly onto the screen
const CodedPixelArt = ({ matrix, className }) => {
  const rows = matrix.length;
  const cols = matrix[0].length;
  
  return (
    <div className={className}>
      <svg 
        viewBox={`0 0 ${cols} ${rows}`} 
        className="w-full h-full drop-shadow-[0_8px_0_rgba(0,0,0,0.2)]"
        shapeRendering="crispEdges"
      >
        {matrix.map((row, y) =>
          row.map((colorKey, x) => (
            colorKey !== 0 ? (
              <rect
                key={`${x}-${y}`}
                x={x}
                y={y}
                width="1.05"
                height="1.05"
                fill={PIXEL_COLORS[colorKey]}
              />
            ) : null
          ))
        )}
      </svg>
    </div>
  );
};

// Animated background hearts
const FloatingHearts = () => {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    const newHearts = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDuration: Math.random() * 4 + 4,
      animationDelay: Math.random() * 5,
      fontSize: Math.random() * 10 + 10
    }));
    setHearts(newHearts);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute bottom-[-10%] text-pink-500 opacity-70 animate-float"
          style={{
            left: `${heart.left}%`,
            animationDuration: `${heart.animationDuration}s`,
            animationDelay: `${heart.animationDelay}s`,
            fontSize: `${heart.fontSize}px`,
            textShadow: '2px 2px 0 #000'
          }}
        >
          {['<3', '❤️', '💖'][Math.floor(Math.random() * 3)]}
        </div>
      ))}
    </div>
  );
};

// Confetti effect for the success screen
const Confetti = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDuration: Math.random() * 3 + 2,
      animationDelay: Math.random() * 2,
      fontSize: Math.random() * 10 + 10,
      emoji: ['✨', '🎉', '💖', '★', '🎵'][Math.floor(Math.random() * 5)]
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute top-[-10%] opacity-100 animate-confetti"
          style={{
            left: `${p.left}%`,
            animationDuration: `${p.animationDuration}s`,
            animationDelay: `${p.animationDelay}s`,
            fontSize: `${p.fontSize}px`,
            textShadow: '2px 2px 0 #000'
          }}
        >
          {p.emoji}
        </div>
      ))}
    </div>
  );
};

export default function App() {
  const [noCount, setNoCount] = useState(0);
  const [yesPressed, setYesPressed] = useState(false);
  const [escapes, setEscapes] = useState(0);
  const [noStyle, setNoStyle] = useState({});
  const [systemOverride, setSystemOverride] = useState(false);

  const phrases = [
    "NO",
    "ARE YOU SURE?",
    "REALLY SURE?",
    "THINK AGAIN!",
    "LAST CHANCE!",
    "SURELY NOT?",
    "MISTAKE!",
    "HAVE A HEART!",
    "SO COLD!",
    "CHANGE MIND?",
    "RECONSIDER?",
    "FINAL ANSWER?",
    "BREAKING MY <3",
    "GONNA CRY...",
    "OKAY YES!" // ဒီနောက်ဆုံးအဆင့်ရောက်မှသာ အစိမ်းရောင် ပြောင်းသွားပါမယ်!
  ];

  const isLastPhrase = noCount >= phrases.length - 1;

  const handleNoClick = () => {
    if (isLastPhrase || systemOverride) {
      setYesPressed(true);
    } else {
      setNoCount(noCount + 1);
    }
  };

  // The innovative runaway feature!
  const handleNoHover = () => {
    // Starts dodging the cursor after 2 normal clicks
    if (noCount >= 2 && !systemOverride) {
      setEscapes(escapes + 1);
      
      // After dodging the mouse 7 times, trigger the ultimate surprise boss mode!
      if (escapes >= 7) {
        setSystemOverride(true);
        setNoStyle({}); // Reset position
        return;
      }

      setNoStyle({
        position: 'fixed',
        top: `${Math.random() * 70 + 15}%`,
        left: `${Math.random() * 70 + 15}%`,
        transform: `translate(-50%, -50%) rotate(${Math.random() * 30 - 15}deg)`,
        zIndex: 50,
      });
    }
  };

  const getNoButtonText = () => {
    if (systemOverride) return "RESISTANCE IS FUTILE";
    return phrases[Math.min(noCount, phrases.length - 1)];
  };

  // If System Override is active, change the whole vibe!
  if (systemOverride && !yesPressed) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center overflow-hidden relative font-pixel select-none">
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
            .font-pixel { font-family: 'Press Start 2P', monospace; }
            .pixel-btn { border: 4px solid #fff; box-shadow: 4px 4px 0px 0px rgba(255,255,255,1); transition: transform 0.1s, box-shadow 0.1s; }
            .pixel-btn:active { box-shadow: 0px 0px 0px 0px rgba(255,255,255,1); transform: translate(4px, 4px); }
            @keyframes glitch { 
              0% { transform: translate(0) } 
              20% { transform: translate(-5px, 5px) } 
              40% { transform: translate(-5px, -5px) } 
              60% { transform: translate(5px, 5px) } 
              80% { transform: translate(5px, -5px) } 
              100% { transform: translate(0) } 
            }
            .animate-glitch { animation: glitch 0.2s linear infinite; }
          `}
        </style>
        
        <div className="absolute inset-0 z-0 flex flex-wrap opacity-20 text-red-600 font-bold overflow-hidden pointer-events-none text-2xl">
          {Array.from({length: 150}).map((_, i) => <span key={i} className="m-2">YES</span>)}
        </div>

        <div className="z-10 bg-red-950 p-8 md:p-12 text-center flex flex-col items-center max-w-2xl w-[90%] mx-auto border-4 border-red-500 animate-glitch shadow-[0_0_50px_rgba(255,0,0,0.8)]">
          <h1 className="text-xl md:text-3xl text-white mb-6 leading-relaxed">
            SYSTEM OVERRIDE <br/><br/> ERROR 404: <br/> "NO" NOT FOUND
          </h1>
          <p className="text-xs md:text-sm text-red-400 leading-loose mb-10">
            YOU HAVE EXHAUSTED ALL ESCAPE ROUTES. <br/><br/> ACCEPT YOUR FATE.
          </p>
          
          <button
            className="bg-green-500 hover:bg-green-400 text-black pixel-btn z-20 w-full py-8 text-2xl md:text-4xl animate-pulse"
            onClick={() => setYesPressed(true)}
          >
            YES I WILL!
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-300 bg-pixel-grid flex flex-col items-center justify-center overflow-hidden relative font-pixel select-none">
      {/* Dynamic Style block for animations and pixel fonts */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

          .font-pixel {
            font-family: 'Press Start 2P', monospace;
          }

          .bg-pixel-grid {
            background-size: 32px 32px;
            background-image:
              linear-gradient(to right, rgba(0,0,0,0.05) 2px, transparent 2px),
              linear-gradient(to bottom, rgba(0,0,0,0.05) 2px, transparent 2px);
          }

          .pixel-borders {
            border: 4px solid #000;
            box-shadow: 8px 8px 0px 0px rgba(0,0,0,1);
          }

          .pixel-btn {
            border: 4px solid #000;
            box-shadow: 4px 4px 0px 0px rgba(0,0,0,1);
            transition: transform 0.1s, box-shadow 0.1s;
          }

          .pixel-btn:active {
            box-shadow: 0px 0px 0px 0px rgba(0,0,0,1);
            transform: translate(4px, 4px);
          }

          @keyframes float {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(-120vh) rotate(360deg); opacity: 0; }
          }
          .animate-float {
            animation: float linear infinite;
          }

          @keyframes confetti {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
          }
          .animate-confetti {
            animation: confetti linear infinite;
          }
          
          @keyframes pulse-heart {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          .animate-pulse-heart {
            animation: pulse-heart 1s step-end infinite;
          }
          
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px) rotate(-5deg); }
            75% { transform: translateX(5px) rotate(5deg); }
          }
          .animate-shake {
            animation: shake 0.4s ease-in-out infinite;
          }
        `}
      </style>

      {/* Render background elements */}
      <FloatingHearts />
      {!yesPressed && <StaticStickers />}
      {yesPressed && <Confetti />}

      {/* Main Interactive Card */}
      <div className="z-10 bg-white p-8 md:p-12 text-center flex flex-col items-center max-w-2xl w-[90%] mx-auto pixel-borders relative">
        
        {yesPressed ? (
          // SUCCESS SCREEN
          <>
            <CodedPixelArt 
              matrix={happyHeart} 
              className="w-32 h-32 md:w-48 md:h-48 mb-8 animate-bounce" 
            />
            <h1 className="text-xl md:text-3xl text-pink-600 mb-6 leading-relaxed animate-pulse-heart">
              PLAYER 2 JOINED! <br/> YAYYYYY!
            </h1>
            <p className="text-xs md:text-sm text-pink-500 leading-loose">
              I KNEW YOU'D SAY YES! <br/> READY FOR OUR DATE!
            </p>
          </>
        ) : (
          // ASKING SCREEN
          <>
            <CodedPixelArt 
              matrix={noCount === 0 ? normalHeart : sadHeart} 
              className={`w-32 h-32 md:w-48 md:h-48 mb-8 ${noCount > 0 ? 'animate-shake' : 'animate-pulse-heart'}`} 
            />
            <h1 className="text-lg md:text-2xl text-pink-600 mb-10 leading-relaxed">
              BE MY VALENTINE? <br/> (Y/N)
            </h1>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full flex-wrap">
              {/* YES BUTTON - Grows bigger with every 'No' click */}
              <button
                className="bg-green-400 hover:bg-green-500 text-black pixel-btn z-20 animate-pulse-heart"
                style={{ 
                  // The 8-bit font is very wide, so we scale it slowly!
                  fontSize: `${noCount * 4 + 12}px`, 
                  padding: '16px 24px',
                  maxWidth: '100%',
                  wordBreak: 'break-word',
                  lineHeight: '1.5'
                }}
                onClick={() => setYesPressed(true)}
              >
                YES!
              </button>

              {/* NO BUTTON - Runs away and eventually causes a system override! */}
              <button
                className={`pixel-btn px-6 py-4 z-10 ${
                  isLastPhrase 
                    ? 'bg-green-400 hover:bg-green-500 text-black animate-pulse-heart' 
                    : 'bg-red-400 hover:bg-red-500 text-black'
                }`}
                style={{ fontSize: '10px', lineHeight: '1.8', ...noStyle }}
                onClick={handleNoClick}
                onMouseEnter={handleNoHover}
                onTouchStart={handleNoHover}
              >
                {getNoButtonText()}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}