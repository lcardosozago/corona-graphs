import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route } from "react-router-dom";
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <HashRouter basename='/'>
      <Route exact path="/" component={App} />
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
