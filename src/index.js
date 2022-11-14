import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import './index.css';
import About from './About';
import Home from './Home';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/about",
    element: <About />,
  },
], {
  basename: '/con2',
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
