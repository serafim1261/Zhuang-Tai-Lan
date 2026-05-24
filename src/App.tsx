import { GameProvider } from './context/GameContext';
import DashboardLayout from './components/layout/DashboardLayout';

export default function App() {
  return (
    <GameProvider>
      <DashboardLayout />
    </GameProvider>
  );
}
