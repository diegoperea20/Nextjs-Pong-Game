"use client"
import { useEffect, useRef, useState } from 'react';

const PongGame = () => {
  const canvasRef = useRef(null);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState('');
  const animationRef = useRef(null);

  useEffect(() => {
    const board = canvasRef.current;
    const boardWidth = 500;
    const boardHeight = 500;
    const context = board.getContext('2d');

    let playerWidth = 10;
    let playerHeight = 50;
    let player1 = { x: 10, y: boardHeight / 2, width: playerWidth, height: playerHeight, velocityY: 0 };
    let player2 = { x: boardWidth - playerWidth - 10, y: boardHeight / 2, width: playerWidth, height: playerHeight, velocityY: 0 };
    let ball = { x: boardWidth / 2, y: boardHeight / 2, radius: 7, velocityX: 1, velocityY: 2 }; // Reducimos el radio de la pelota

    let player1Score = 0;
    let player2Score = 0;

    const update = () => {
      context.clearRect(0, 0, board.width, board.height);

      if (gameOver) {
        context.font = 'bold 45px sans-serif';
        context.shadowColor = 'black';
        context.shadowOffsetX = 2;
        context.shadowOffsetY = 2;
        context.shadowBlur = 4;
        context.fillStyle = 'white';
        if (winner === 'player1') {
          context.fillText('Winner', boardWidth / 5, 45);
          context.fillText('Loser', boardWidth * 4 / 5 - 45, 45);
        } else {
          context.fillText('Loser', boardWidth / 5, 45);
          context.fillText('Winner', boardWidth * 3 / 5 - 45, 45);
        }
        return;
      }

      // Player 1 (yellow con bordes redondeados)
      context.fillStyle = 'yellow';
      let nextPlayer1Y = player1.y + player1.velocityY;
      if (!outOfBounds(nextPlayer1Y)) {
        player1.y = nextPlayer1Y;
      }
      drawRoundRect(context, player1.x, player1.y, playerWidth, playerHeight, 4);

      // Player 2 (verde con bordes redondeados)
      context.fillStyle = 'green';
      let nextPlayer2Y = player2.y + player2.velocityY;
      if (!outOfBounds(nextPlayer2Y)) {
        player2.y = nextPlayer2Y;
      }
      drawRoundRect(context, player2.x, player2.y, playerWidth, playerHeight, 4);

      // Ball
      context.fillStyle = 'white';
      ball.x += ball.velocityX;
      ball.y += ball.velocityY;

      context.beginPath();
      context.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
      context.fill();

      if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= boardHeight) {
        ball.velocityY *= -1;
      }

      if (detectCollision(ball, player1) && ball.x - ball.radius <= player1.x + player1.width) {
        ball.velocityX *= -1;
      } else if (detectCollision(ball, player2) && ball.x + ball.radius >= player2.x) {
        ball.velocityX *= -1;
      }

      if (ball.x - ball.radius < 0) {
        player2Score++;
        if (player2Score === 10) {
          setWinner('player2');
          setGameOver(true);
          return;
        } else {
          resetGame(1);
        }
      } else if (ball.x + ball.radius > boardWidth) {
        player1Score++;
        if (player1Score === 10) {
          setWinner('player1');
          setGameOver(true);
          return;
        } else {
          resetGame(-1);
        }
      }

      context.font = 'bold 45px sans-serif';
      context.shadowColor = 'black';
      context.shadowOffsetX = 2;
      context.shadowOffsetY = 2;
      context.shadowBlur = 4;
      context.fillStyle = 'white';
      context.fillText(player1Score, boardWidth / 5, 45);
      context.fillText(player2Score, boardWidth * 4 / 5 - 45, 45);

      for (let i = 10; i < board.height; i += 25) {
        context.fillRect(board.width / 2 - 10, i, 5, 5);
      }

      animationRef.current = requestAnimationFrame(update);
    };

    const movePlayer = (e) => {
      if (e.code === 'KeyW') {
        e.preventDefault(); // Prevenir el scroll en caso de 'KeyW'
        player1.velocityY = -3;
      } else if (e.code === 'KeyS') {
        e.preventDefault(); // Prevenir el scroll en caso de 'KeyS'
        player1.velocityY = 3;
      } else if (e.code === 'ArrowUp') {
        e.preventDefault(); // Prevenir el scroll en caso de 'ArrowUp'
        player2.velocityY = -3;
      } else if (e.code === 'ArrowDown') {
        e.preventDefault(); // Prevenir el scroll en caso de 'ArrowDown'
        player2.velocityY = 3;
      }
    };
  
    window.addEventListener('keydown', movePlayer);

    const outOfBounds = (yPosition) => yPosition < 0 || yPosition + playerHeight > boardHeight;

    const detectCollision = (ball, player) => {
      return ball.x - ball.radius < player.x + player.width &&
             ball.x + ball.radius > player.x &&
             ball.y - ball.radius < player.y + player.height &&
             ball.y + ball.radius > player.y;
    };

    const resetGame = (direction) => {
      ball = { x: boardWidth / 2, y: boardHeight / 2, radius: 7, velocityX: direction, velocityY: 2 }; // Reducimos el radio de la pelota
    };

    const drawRoundRect = (ctx, x, y, width, height, radius) => {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
      ctx.fill();
    };

    board.width = boardWidth;
    board.height = boardHeight;
    document.addEventListener('keyup', movePlayer);
    animationRef.current = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('keydown', movePlayer);
    cancelAnimationFrame(animationRef.current);
    };
  }, [gameOver, winner]);

  return <canvas id="board" ref={canvasRef} />;
};

export default PongGame;
