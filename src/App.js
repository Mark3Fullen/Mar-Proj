import React, {useState, useEffect} from 'react';
import { Stage, Layer, Circle } from 'react-konva';

import './App.css'

import Snake from './comp/Snake'

function App() {

  const [gameOver, setGameOver] = useState(false);
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
    const x = Math.floor(Math.random() * 40) * 10;
    const y = Math.floor(Math.random() * 40) * 10;
    return { x, y };
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (gameOver !== true) {
        switch (event.code) {
          case 'ArrowUp':
            setSnake((prevSnake) => ({
              ...prevSnake,
              direction: 'up',
            }));
            break;
          case 'ArrowDown':
            setSnake((prevSnake) => ({
              ...prevSnake,
              direction: 'down',
            }));
            break;
          case 'ArrowLeft':
            setSnake((prevSnake) => ({
              ...prevSnake,
              direction: 'left',
            }));
            break;
          case 'ArrowRight':
            setSnake((prevSnake) => ({
              ...prevSnake,
              direction: 'right',
            }));
            break;
            default:
            break;
        }
      } 
    }  

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };

  }, [gameOver]);

  const moveSnake = ( generatePellet ) => {
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
    const interval = setInterval(moveSnake, 100);

    return () => clearInterval(interval);
  }, []);  

  useEffect(() => {
    if (snake.segments[0].x === pellet.x && snake.segments[0].y === pellet.y) {
      setPellet(generatePelletPosition());
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
      setGameOver(true);
    }
  }, [snake, pellet]);

  return (
    <div className="App">
      <header>
      </header>
      <div className="game-container">
        <Stage width={400} height={400}>
          <Layer>
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
      {gameOver ? <button onClick={() => window.location.reload()}>Restart</button> : null}
    </div>
  );
}

export default App;