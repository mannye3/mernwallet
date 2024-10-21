import Login from './pages/Login';
import Register from './pages/Register';
import Transactions from './pages/Transactions';
import Home from './pages/Home';
import  './stylesheets/alignment.css';
import  './stylesheets/custom-components.css';
import  './stylesheets/form-elements.css';
import  './stylesheets/text-elements.css';
import  './stylesheets/theme.css';
import  './stylesheets/layout.css';


import {BrowserRouter, Routes, Route} from 'react-router-dom';
import ProtectedRoute from './componets/ProtectedRoute';
import PublicRoute from './componets/PublicRoute';
function App() {
  return (
    <div >
     
     <BrowserRouter>
        <Routes>
          
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/" element={<ProtectedRoute ><Home/></ProtectedRoute>} />
            <Route path="/transactions" element={<ProtectedRoute ><Transactions/></ProtectedRoute>} />
     
        
        </Routes>
       
     </BrowserRouter>
    </div>
  );
}


export default App;
