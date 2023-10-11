import './App.css';
import NaiveRouter from './components/NaiveRouter';
import { Navigation } from './components/Navigation';

function App() {
  return (
    <div>
      <Navigation />
      <NaiveRouter />
    </div>
  );
}

export default App;
