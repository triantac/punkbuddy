import React from 'react'
import { BrowserRouter as Router, Link, Switch, Route, Redirect } from 'react-router-dom'
import Contact from './Contact'
import './App.css'
import Write from './Write'

function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">PunkBuddy</a>

          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarItems">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarItems">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link to="/write" className="nav-link">Write</Link>
              </li>
              <li className="nav-item">
                <Link to="/practise" className="nav-link">Practise</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container-sm p-3 app">
        <Switch>
          <Route exact path="/">
            <Redirect to="/write" />
          </Route>
          <Route path="/write">
            <Write />
          </Route>
          <Route path="/practise">
            Practise
          </Route>
          <Route path="/contact">
            <Contact />
          </Route>
        </Switch>
      </div>

      <footer className="footer">
        <div className="container">
          <Link to="/contact" className="text-muted">Contact</Link>
        </div>
      </footer>
    </Router>
  )
}

export default App
