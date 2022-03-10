import 'normalize.css';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import { App } from './app/App';

ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root'),
);
