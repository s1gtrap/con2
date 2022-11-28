import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useCallback, useEffect, useState } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

import './index.css';
import About from './routes/About';
import Home from './routes/Home';
import Invite from './routes/Invite';
import Root from './routes/Root';
import Scan from './routes/Scan';
import SignUp from './routes/SignUp';
import { Guard as PGuard, Modal as PModal, Permissions } from './Permissions';

function App() {
  const [showPermissions, setShowPermissions] = useState(false);
  const [permissions, setPermissions] = useState<Permissions>(() => {
    return !!localStorage.getItem('localStorage')
      ? {
        localStorage: true,
        camera: localStorage.getItem('camera') === 'true',
        geolocation: localStorage.getItem('geolocation') === 'true',
      }
      : {
        localStorage: false,
        camera: false,
        geolocation: false,
      };
  });

  useEffect(() => {
    if (permissions.localStorage) {
      localStorage.setItem('localStorage', 'true');
      (['camera', 'geolocation'] as (keyof Permissions)[]).forEach((p) => {
        if (permissions[p] !== undefined) {
          localStorage.setItem(p, JSON.stringify(permissions[p]));
        } else {
          localStorage.removeItem(p);
        }
      })
    } else {
      localStorage.clear();
    }
  }, [permissions]);

  const onSubmitPermissions = useCallback((p: Permissions | null) => {
    if (p) {
      setPermissions(p);
    }
    setShowPermissions(false);
  }, []);

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Root />,
      children: [
        {
          path: '/',
          element: <Home />,
        },
        {
          path: '/about',
          element: <About />,
        },
        {
          path: '/invite',
          element: <Invite />,
        },
        {
          path: '/scan',
          element: (
            <PGuard
              permissions={permissions}
              prompt="We need permission to use your camera to scan invites!"
              required="camera"
              showPermissionsPrompt={() => setShowPermissions(true)}
            >
              <Scan />
            </PGuard>
          ),
        },
        {
          path: '/signup',
          element: <SignUp />,
        },
      ],
    },
  ], {
    basename: process.env['REACT_APP_BASE_NAME'],
  });

  return (
    <div className="container d-grid vh-100">
      <div className="row justify-content-center align-self-center m-1">
        <PModal onSubmit={onSubmitPermissions} permissions={permissions} show={showPermissions} />
        <RouterProvider router={router} />
      </div>
    </div>
  );
}

export default App;
