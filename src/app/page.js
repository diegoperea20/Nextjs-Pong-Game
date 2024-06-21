"use client"
import { useState } from 'react';
import PongGame from '@/components/PongGame';
import Link from 'next/link';
const Home = () => {
  const [restart, setRestart] = useState(false);

  const handleRestart = () => {
    setRestart(prevRestart => !prevRestart);
  };

  return (
    <div>
      <main>
        <h1 style={{ textAlign: 'center' }}>Pong Game</h1>
        <PongGame key={restart} /> {/* Añadimos key para forzar la remontada de la montaña r */}
        <button onClick={handleRestart} style={{ display: 'block', margin: 'auto' }}>Play Again</button>
        <h3>player 🟨 W ⬆️ S ⬇️</h3>
        <h3>player 🟩: ⬆️ ⬇️</h3>
        <div className="project-github">
      <p>This project is in </p>
      <Link href="https://github.com/diegoperea20/Nextjs-Pong-Game">
        <img width="96" height="96" src="https://img.icons8.com/fluency/96/github.png" alt="github"/>
      </Link>
    </div>
      </main>
    </div>
  );
};

export default Home;
