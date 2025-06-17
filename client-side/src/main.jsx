import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom';
import { Provider} from 'react-redux' 
import { Store } from './redux/Store.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <Provider store={Store}>
  <BrowserRouter future={{v7_startTransition:true, v7_relativeSplatPath:true}}>
    <App />
  </BrowserRouter>
  </Provider>
  </StrictMode>,
)
