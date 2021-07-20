
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import About from './components/About/About';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Navbar from './components/Navbar/Navbar'
import ChatPage from './components/ChatPage/ChatPage';
import './styles.css'
function App() {

  const [isLoggedin, setLogin] = useState(true);

  return (
    <Router>
      <div>
        {/* <Navbar/> */}
        <Switch>
          <Route path="/about" component={About} />
          <Route exact path="/" component={isLoggedin ? ChatPage : Home} />
          <Route path="/login" component={Login} />

        </Switch>

      </div>
    </Router>
  );
}

export default App;
