
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useSelector } from 'react-redux';
import { Provider } from "react-redux";
import storePersistor from './store'
import React, { useEffect, useState } from 'react';
import About from './components/About/About';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Navbar from './components/Navbar/Navbar'
import ChatPage from './components/ChatPage/ChatPage';
import './styles.css'
import { PersistGate } from "redux-persist/integration/react";
function App() {

  const { store, persistor } = storePersistor();

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>

        <div className="app-cont">
          <Router>
            {/* <Navbar/> */}
            <Switch>
              <Route path="/about" component={About} />
              <Route exact path="/" component={Home} />
              <Route path="/login" component={Login} />

            </Switch>
          </Router>
        </div>
      </PersistGate>
    </Provider>
  );
}

export default App;
