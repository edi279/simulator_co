import { useState, useEffect } from 'react';
import { SetupScreen } from './components/SetupScreen';
import { SimulationDashboard } from './components/SimulationDashboard';
import { INITIAL_STATE, addEmployee, nextDay, type GameState } from './logic/engine';
import type { MBTI } from './logic/mbti';

function App() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('sim_state');
    return saved ? JSON.parse(saved) : INITIAL_STATE;
  });

  useEffect(() => {
    localStorage.setItem('sim_state', JSON.stringify(gameState));
  }, [gameState]);

  const handleStart = (employees: { name: string; dob: string; mbti: MBTI }[]) => {
    let newState = { ...INITIAL_STATE, isPlaying: true };
    employees.forEach(e => {
      newState = addEmployee(newState, e.name, e.dob, e.mbti);
    });
    setGameState(newState);
  };

  const handleNextDay = () => {
    setGameState(prev => nextDay(prev));
  };

  const handleReset = () => {
    if (confirm('모든 데이터가 초기화됩니다. 계속하시겠습니까?')) {
      setGameState(INITIAL_STATE);
    }
  };

  if (!gameState.isPlaying) {
    return <SetupScreen onStart={handleStart} />;
  }

  return (
    <SimulationDashboard
      state={gameState}
      onNextDay={handleNextDay}
      onReset={handleReset}
    />
  );
}

export default App;
