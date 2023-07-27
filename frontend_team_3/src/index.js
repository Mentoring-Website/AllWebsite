
import React from 'react';
import ReactDOM from 'react-dom/client';
import 'react-toastify/dist/ReactToastify.css';
import App from './App';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from "react-redux";
import { store, persistor } from './features/store';
import { PersistGate } from "redux-persist/integration/react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const root = ReactDOM.createRoot(document.getElementById('root'));

// pass collection of reducers

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
      <ToastContainer />
    </BrowserRouter>
  </React.StrictMode>
);