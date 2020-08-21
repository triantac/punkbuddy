import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Link, Switch, Route, Redirect } from 'react-router-dom'
import About from './About'
import './App.scss'
import Write from './Write'
import Check from './Check'

function App() {
  const [font, setFont] = useState({})
  const [backgroundColor, setBackgroundColor] = useState("#edd1b0")
  
  useEffect(() => {
    document.getElementsByTagName("body")[0].style.backgroundColor = backgroundColor
  }, [backgroundColor])
  
  return (
    <Router>
      <div style={font}>
        <nav className="navbar navbar-expand-lg navbar-light bg-primary">
          <div className="container-fluid">
            <a className="navbar-brand" href="/">PunkBuddy</a>

            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarItems">
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarItems">
              <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                  <Link to="/write" className="nav-link">Write, Listen, Check</Link>
                </li>
                <li className="nav-item">
                  <Link to="/about" className="nav-link">About</Link>
                </li>
              </ul>
              <div className="btn-group dropdown">
                <button className="btn btn-secondary btn-sm dropdown-toggle"
                  type="button"
                  data-toggle="dropdown"
                  aria-expanded="false">
                  Font
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <button className="dropdown-item" type="button"
                      onClick={() => setFont({})}>
                      System Font
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" type="button"
                      onClick={() => setFont({fontFamily: "Open Dyslexic"})}>
                      Open Dyslexic
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" type="button"
                      onClick={() => setFont({fontFamily: "Courier"})}>
                      Courier
                    </button>
                  </li>
                </ul>
                <button className="btn btn-secondary btn-sm dropdown-toggle"
                  type="button"
                  data-toggle="dropdown"
                  aria-expanded="false">
                  Background color
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <button className="dropdown-item" type="button"
                      onClick={() => setBackgroundColor("#edd1b0")}>
                      Peach
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" type="button"
                      onClick={() => setBackgroundColor("#eddd6e")}>
                      Orange
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" type="button"
                      onClick={() => setBackgroundColor("#f8fd89")}>
                      Yellow
                    </button>
                  </li>
                </ul>
              </div>

            </div>
          </div>
        </nav>

        <div className="container p-3 app">
          <Switch>
            <Route exact path="/">
              <Redirect to="/write" />
            </Route>
            <Route path="/write">
              <Write />
            </Route>
            <Route path="/check" component={Check} />
            <Route path="/practise">
              Practise
          </Route>
            <Route path="/about">
              <About />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  )
}

export default App
