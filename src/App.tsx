import React from 'react'
import { BrowserRouter as Router, Link, Switch, Route } from 'react-router-dom'

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
                  <Link to="/writeAndListen" className="nav-link">Write and Listen</Link>
                </li>
                <li className="nav-item">
                  <Link to="/writeAndCheck" className="nav-link">Write and Check</Link>
                </li>
                <li className="nav-item">
                  <Link to="/practise" className="nav-link">Practise</Link>
                </li>
              </ul>
            </div>
          </div>
      </nav>

      <Switch>
        <Route path="/(writeAndListen)?">
          Write and listen
        </Route>
        <Route path="/writeAndCheck">
          Write and check
        </Route>
        <Route path="/practise">
          Practise
        </Route>
      </Switch>
    </Router>
  )
}

export default App