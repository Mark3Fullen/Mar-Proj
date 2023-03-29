import React, { useState, useEffect } from 'react';
import { Stage, Layer, Circle, Rect } from 'react-konva';

import './App.css'

import Snake from './comp/Snake'

function App() {

  const [speed, setSpeed] = useState(100);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);
  const [snake, setSnake] = useState({
    segments: [
      { x: 50, y: 50 },
      { x: 40, y: 50 },
      { x: 30, y: 50 },
    ],
    direction: 'right',
  });
  const [pellet, setPellet] = useState(generatePelletPosition());

  function generatePelletPosition() {
    let x = (Math.floor(Math.random() * 40) * 10) - 5;
    let y = (Math.floor(Math.random() * 40) * 10) - 5;
    if (x > 400) {
      x = 395;
    } else if (x < 10) {
      x = 5;
    }
    if (y > 400) {
      y = 395;
    } else if (y < 10) {
      y = 5;
    }
    return { x, y };
  }

  useEffect(() => {
    const restart = (event) => {
      if (gameOver === true && event.code === 'Enter') {
        window.location.reload();
      }
    }

    const handleKeyDown = (event) => {
      if (gameOver !== true) {
        switch (event.code) {
          case 'ArrowUp':
            if (snake.direction !== 'down') {
              setSnake((prevSnake) => ({
                ...prevSnake,
                direction: 'up',
              }));
            }
            break;
          case 'ArrowDown':
            if (snake.direction !== 'up') {
              setSnake((prevSnake) => ({
                ...prevSnake,
                direction: 'down',
              }));
            }
            break;
          case 'ArrowLeft':
            if (snake.direction !== 'right') {
              setSnake((prevSnake) => ({
                ...prevSnake,
                direction: 'left',
              }));
            }
            break;
          case 'ArrowRight':
            if (snake.direction !== 'left') {
              setSnake((prevSnake) => ({
                ...prevSnake,
                direction: 'right',
              }));
            }
            break;
          case 'Space':
            setPaused(!paused);
            break;
          default:
            break;
        }
      } 
    }  

    document.addEventListener('keydown', restart)
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', restart);
      document.removeEventListener('keydown', handleKeyDown);
    };

  }, [gameOver, snake, paused]);

  const moveSnake = () => {
    setSnake((prevSnake) => {
      const segments = [...prevSnake.segments];
      let { x, y } = segments[0];

      switch (prevSnake.direction) {
        case 'up':
          y = y - 10;
          break;
        case 'down':
          y = y + 10;
          break;
        case 'left':
          x = x - 10;
          break;
        case 'right':
          x = x + 10;
          break;
        default:
          break;
      }

      if (x < 0 || x >= 400 || y < 0 || y >= 400) {
        setGameOver(true);
        return prevSnake;
      }

      segments.pop();
      segments.unshift({ x, y });

      return { ...prevSnake, segments };
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (paused === false) {
        return moveSnake()
      }
    }, speed);

    return () => clearInterval(interval);
  }, [paused, speed]);  

  useEffect(() => {
    if (snake.segments[0].x === (pellet.x +- 5) && snake.segments[0].y === (pellet.y +- 5)) {
      setScore(score + 1)
      setPellet(generatePelletPosition());
      setSpeed(speed * .90)
      setSnake((prevSnake) => ({
        ...prevSnake,
        segments: [...prevSnake.segments, prevSnake.segments.slice(-1)[0]],
      }));
    }

    if (
      snake.segments.slice(1).some((segment) => segment.x === snake.segments[0].x && segment.y === snake.segments[0].y)
      || snake.segments[0].x < 0 || snake.segments[0].x >= 400
      || snake.segments[0].y < 0 || snake.segments[0].y >= 400
    ) {
      setScore(0);
      setGameOver(true);
    }
  }, [snake, pellet, score, speed]);

  useEffect(() => {
    let localScore = localStorage.getItem('localScore')
    if (localScore > highScore) setHighScore(localScore)
    localStorage.setItem('localScore', highScore)
    if (score > highScore) setHighScore(score);
  }, [score, highScore]);

  return (
    <div className="App">
      <header className="AppHeader">
        Snake Game
        <div className="scoreDiv">
          <h5 className='score'>High Score: {highScore}</h5>
          <h5 className='score'>Current Score: {score}</h5>
        </div>
      </header>
      <div className="game-container">
        <Stage width={400} height={400}>
          <Layer>
            {Array.from(Array(400/10)).map((_, rowIndex) => (
              Array.from(Array(400/10)).map((_, colIndex) => (
                <Rect
                  key={rowIndex + colIndex}
                  x={colIndex * 10}
                  y={rowIndex * 10}
                  width={10}
                  height={10}
                  fill={((rowIndex + colIndex) % 2 === 0) ? 'white' : 'beige'}
                />
              ))
            ))}
            <Snake segments={snake.segments} />
            <Circle
              x={pellet.x}
              y={pellet.y}
              radius={5}
              fill="red"
            />
          </Layer>
        </Stage>
      </div>
      {gameOver ? <h2 className="gameover">Game Over!</h2> : null}
      {gameOver ? <button className="res-btn" onClick={() => window.location.reload()}>Restart</button> : <button className={!paused ? 'pause-btn' : 'norm-btn'} onClick={() => setPaused(!paused)}>{!paused ? 'Pause' : 'Resume'}</button>}
    </div>
  );
}

export default App;