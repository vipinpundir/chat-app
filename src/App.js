import 'bootstrap/dist/css/bootstrap.min.css';
import './Global.css';
import MyRoutes from './Routes/MyRoutes';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div className="App">
      <MyRoutes/>
      <Toaster />
    </div>
  );
}

export default App;
