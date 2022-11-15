import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

import './index.css';
import About from './About';
import Home from './Home';
import Invite from './Invite';
import Permissions from './Permissions';
import Scan from './Scan';
import SignUp from './SignUp';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/about',
    element: <About />,
  },
  {
    path: 'invite',
    element: <Invite />,
  },
  {
    path: 'permissions',
    element: <Permissions />,
  },
  {
    path: 'scan',
    element: <Scan />,
  },
  {
    path: '/signup',
    element: <SignUp />,
  },
], {
  basename: process.env['REACT_APP_BASE_NAME'],
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <div className="container d-grid vh-100">
      <div className="row justify-content-center align-self-center m-1">
        <RouterProvider router={router} />
      </div>
    </div>
  </React.StrictMode>
);
