import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useCallback, useEffect, useState } from 'react';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';

import { fetchJson } from './api';
import './index.css';
import About from './routes/About';
import Home from './routes/Home';
import Invite from './routes/Invite';
import Map from './routes/Map';
import Root from './routes/Root';
import Scan from './routes/Scan';
import SignUp from './routes/SignUp';
import { Guard as PGuard, Modal as PModal, Permissions } from './Permissions';
import Spinner from './Spinner';

export type User = {
  id: string,
};

export type UProps = {
  fetchAuthJson: (r: string, o?: object) => Promise<any>,
  user: User,
};

type UGProps = {
  component: (props: UProps) => JSX.Element,
  fetchAuthJson: (r: string, o?: object) => Promise<any>,
  user: User | null,
}

function UGuard({ component, fetchAuthJson, user }: UGProps) {
  if (user !== null) {
    return component({ fetchAuthJson, user });
  } else {
    return <Navigate to="/" />
  }
}

export type Token = {
  token: string,
};

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

  const [accessToken, setAccessTokenState] = useState(() => localStorage.getItem('accessToken'));
  const setAccessToken = useCallback((accessToken: string | null) => {
    if (accessToken !== null) {
      localStorage.setItem('accessToken', accessToken);
    } else {
      localStorage.removeItem('accessToken');
    }
    setAccessTokenState(accessToken);
  }, []);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const data: User | null = await fetchJson('/api/v1/me', {
          headers: {
            'authorization': `Bearer ${accessToken}`,
          }
        });
        setUser(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [accessToken])
  async function fetchAuthJson<T>(resource: string, opts?: object): Promise<T> {
    try {
      return await fetchJson<T>('/api/v1/invite', {
        ...opts,
        headers: {
          // FIXME: opts.headers
          'authorization': `Bearer ${accessToken}`,
        },
      });
    } catch (e) {
      throw e;
    }
  }

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Root />,
      children: [
        {
          path: '/',
          element: <Home user={user} />,
        },
        {
          path: '/about',
          element: <About />,
        },
        {
          path: '/invite',
          element: <UGuard component={Invite} fetchAuthJson={fetchAuthJson} user={user} />,
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
              <Scan setAccessToken={setAccessToken} />
            </PGuard>
          ),
        },
        {
          path: '/signup',
          element: <SignUp />,
        },
        {
          path: '/map',
          element: (
            <PGuard
              permissions={permissions}
              prompt="We need permission to use your geolocation to show nearby stops!"
              required="geolocation"
              showPermissionsPrompt={() => setShowPermissions(true)}
            >
              <UGuard component={Map} fetchAuthJson={fetchAuthJson} user={user} />
            </PGuard>
          ),
        },
      ],
    },
  ], {
    basename: process.env['REACT_APP_BASE_NAME'],
  });

  return (
    <div className="container d-grid vh-100">
      <div className="row justify-content-center align-self-center m-1">
        {
          isLoading
            ? <Spinner />
            : (
              <>
                <PModal onSubmit={onSubmitPermissions} permissions={permissions} show={showPermissions} />
                <RouterProvider router={router} />
              </>
            )
        }
      </div>
    </div>
  );
}

export default App;
