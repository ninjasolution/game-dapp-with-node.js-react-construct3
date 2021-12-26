import { useRoutes } from "react-router-dom"
import routes from './routes';
import './App.css';

function App() {
  const content = useRoutes(routes)

  return (
    <div>
      {content}
    </div>
  );
}

export default App;
