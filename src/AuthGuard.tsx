import React, { ReactElement } from 'react';

import { useAuthContext } from './App';

type Props = {
  children: ReactElement,
};

function AuthGuard({ children }: Props) {
  const [user] = useAuthContext();
  if (user) {
    return children;
  } else {
    return <div className="text-center">You need to be authenticated to view this page.</div>;
  }
}

export default AuthGuard;