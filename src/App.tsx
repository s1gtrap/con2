import 'bootstrap/dist/css/bootstrap.min.css';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

import { fetchAuthJson } from './fetch';
import './index.css';
import About from './routes/About';
import Home from './routes/Home';
import Invite from './routes/Invite';
import Map from './routes/Map';
import Report from './routes/Report';
import Root from './routes/Root';
import Scan from './routes/Scan';
import SignUp from './routes/SignUp';
import { Permissions } from './PermissionModal';
import Profile from './Profile';
import AuthGuard from './AuthGuard';
import { PermissionsGranted } from './Permissions';
import PermissionGuard from './PermissionGuard';

export const AuthContext = createContext<[UserToken | null, (accessToken: string | null) => void] | [null]>([null]);
export const useAuthContext = () => {
  return useContext(AuthContext);
};

export type Token = {
  token: string,
};

export type User = {
  id: string,
};

export type UserToken = User & Token;

function App() {
  const [token, setAccessTokenState] = useState<string | null>(() => localStorage.getItem('accessToken'));
  const [user, setUser] = useState<User | null>(null);
  const setAccessToken = useCallback((accessToken: string | null) => {
    if (accessToken !== null) {
      localStorage.setItem('accessToken', accessToken);
    } else {
      localStorage.removeItem('accessToken');
    }
    setAccessTokenState(accessToken);
  }, []);

  useEffect(() => {
    if (token) {
      fetchAuthJson(token, '/api/v1/me')
        .then(user => setUser(user as User));
    }
  }, [token]);

  const [permissions, setGranted] = useState<PermissionsGranted>(() => {
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

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Root />,
      children: [
        {
          path: '/',
          element: <Home setAccessToken={setAccessToken} />,
        },
        {
          path: '/me',
          element: (
            <PermissionGuard granted={permissions} required={['localStorage']} setGranted={setGranted}>
              <AuthGuard>
                <Profile />
              </AuthGuard>
            </PermissionGuard>
          ),
        },
        {
          path: '/about',
          element: <About />,
        },
        {
          path: '/invite',
          element: (
            <AuthGuard>
              <Invite />
            </AuthGuard>
          ),
        },
        {
          path: '/signup',
          element: <SignUp />,
        },
      ],
    },
    {
      path: '/report',
      element: (
        <PermissionGuard granted={permissions} required={['camera', 'localStorage']} setGranted={setGranted}>
          <AuthGuard>
            <Report />
          </AuthGuard>
        </PermissionGuard>
      ),
    },
    {
      path: '/scan',
      element: (
        <PermissionGuard granted={permissions} required={['camera']} setGranted={setGranted}>
          <Scan setAccessToken={setAccessToken} />
        </PermissionGuard>
      ),
    },
    {
      path: '/map',
      element: (
        <PermissionGuard granted={permissions} required={['geolocation', 'localStorage']} setGranted={setGranted} wrapping={Root}>
          <AuthGuard>
            <Map />
          </AuthGuard>
        </PermissionGuard>
      ),
    },
  ], {
    basename: process.env['REACT_APP_BASE_NAME'],
  });

  return (
    <AuthContext.Provider value={[{ ...user!, token: token! }, setAccessToken]}>
      <RouterProvider router={router} />
    </AuthContext.Provider>
  );
}

export default App;
