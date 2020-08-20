import React, { useState } from 'react'
import { BrowserRouter as Router, Link, Switch, Route, Redirect } from 'react-router-dom'
import About from './About'
import './App.scss'
import Write from './Write'
import Check from './Check'

function App() {
  const [useOpenDyslexic, setUseOpenDyslexic] = useState(false)
  return (
    <Router>
      <div className={useOpenDyslexic ? "open-dyslexic" : ""}>
        <nav className="navbar navbar-expand-lg navbar-light bg-primary">
          <div className="container-fluid">
            <a className="navbar-brand" href="/">PunkBuddy</a>

            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarItems">
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarItems">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link to="/write" className="nav-link">Write, Listen, Check</Link>
                </li>
                <li className="nav-item">
                  <Link to="/about" className="nav-link">About</Link>
                </li>
              </ul>
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
            <Route path="/check" component={Check}/>
            <Route path="/practise">
              Practise
          </Route>
            <Route path="/about">
              <About />
            </Route>
          </Switch>
        </div>

        <footer className="footer">
          <div className="container">
            <Link to="/about" className="text-muted">Contact</Link>
            <div className="form-check form-check-inline float-right">
              <input type="checkbox"
                className="form-check-input"
                id="useOpenDyslexic"
                checked={useOpenDyslexic}
                onChange={() => setUseOpenDyslexic(!useOpenDyslexic)} />
              <label className="form-check-label" htmlFor="useOpenDyslexic">
                Use Dyslexic Friendly Font
            </label>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App
