import React, { useState, ReactElement } from 'react';
import { Button } from 'react-bootstrap';

import { join } from './utils';
import PermissionModal from './PermissionModal';
import { isGranted, missing, Permissions, PermissionsGranted } from './Permissions';

type Props = {
  children: ReactElement,
  granted: PermissionsGranted,
  required: Permissions,
  setGranted: (p: PermissionsGranted) => void,
  wrapping?: (propts: any) => ReactElement,
};

function PermissionGuard({ children, granted, required, setGranted, wrapping }: Props) {
  const [show, setShow] = useState(false);
  if (isGranted(required, granted)) {
    return children;
  } else {
    const warning = (
      <div className="text-center">
        <p>Sorry, but you need to grant access to your {join(missing(required, granted))} before viewing this page.</p>
        <Button onClick={() => setShow(true)}>Change Permissions</Button>
      </div>
    );
    return (
      <>
        <PermissionModal onSubmit={(p) => p && setGranted(p)} permissions={granted} show={show} />
        {
          wrapping ? wrapping({ children: warning }) : warning
        }
      </>
    );
  }
}

export default PermissionGuard;