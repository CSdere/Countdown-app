import { useState, useEffect } from 'react';
import { renderToString } from 'react-dom/server';

function App() {
  const hourInput = Array.from({ length: 100 }, (_, i) => i);
  const minInput = Array.from({ length: 60 }, (_, i) => i);
  const secInput = Array.from({ length: 60 }, (_, i) => i);

  const [selectedHour, setSelectedHour] = useState(0);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [selectedSecond, setSelectedSecond] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime > 0) {
            return prevTime - 1;
          } else {
            setIsRunning(false);
            clearInterval(timer);
            return 0;
          }
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  useEffect(() => {
    const totalSeconds = selectedHour * 3600 + selectedMinute * 60 + selectedSecond;
    setRemainingTime(totalSeconds);
  }, [selectedHour, selectedMinute, selectedSecond]);

  const formatTime = (time) => String(time).padStart(2, '0');

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const hour = parseInt(form.hourInput.value);
    const minute = parseInt(form.minInput.value);
    const second = parseInt(form.secInput.value);

    setSelectedHour(hour);
    setSelectedMinute(minute);
    setSelectedSecond(second);
    setIsRunning(true);
  };

  const pauseTimer = (event) => {
    event.preventDefault();
    setIsRunning(false)
  }

  const reset = () => {
    location.reload()
  }

  const hours = Math.floor(remainingTime / 3600);
  const minutes = Math.floor((remainingTime % 3600) / 60);
  const seconds = remainingTime % 60;

  return (
    <div className='container'>
      <h1>CountDown App</h1>
      
      <form id="form" name='form' onSubmit={handleSubmit}>
        <div>
          <h2>{formatTime(hours)}:{formatTime(minutes)}:{formatTime(seconds)}</h2>
        </div>
        <div>
          <select name="hourInput" id="hourInput">
            {hourInput.map((hours) => (
              <option key={hours} value={hours}>{hours}</option>
            ))}
          </select>
          <select name="minInput" id="minInput">
            {minInput.map((mins) => (
              <option key={mins} value={mins}>{mins}</option>
            ))}
          </select>
          <select name="secInput" id="secInput">
            {secInput.map((secs) => (
              <option key={secs} value={secs}>{secs}</option>
            ))}
          </select>
        </div>
        <div>
          <button type="submit">Start</button>
          <button onClick={pauseTimer}>Pause</button>
          <button onClick={reset}>Reset</button>
        </div>
      </form>
    </div>
  );
}

export default App;
