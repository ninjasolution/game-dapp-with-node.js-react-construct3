import GamePage from "./GamePage";
import Home from "./Home";

const routes = [
    {
      path: '',
      element: <Home/>,
    },
    {
      path: '/game',
      element: <GamePage/>,
    }
  ];
  
  export default routes;
  