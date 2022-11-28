import React, { useCallback, useEffect, useState, ChangeEvent } from 'react';
import { Button, Card, Form, Modal as BModal } from 'react-bootstrap';

export type Permissions = {
  localStorage: true,
  camera: boolean | undefined,
  geolocation: boolean | undefined,
} | {
  localStorage: false,
  camera: false,
  geolocation: false,
};

type GuardProps = {
  children: JSX.Element,
  permissions: Permissions,
  prompt: string,
  required: keyof Permissions,
  showPermissionsPrompt: () => void,
};

export function Guard({ children, permissions, prompt, required, showPermissionsPrompt }: GuardProps) {
  if (permissions[required]) {
    return children;
  } else {
    return (
      <>
        <Card.Title>Hold up!</Card.Title>
        <Card.Text>
          <p>{prompt}</p>
          <Button onClick={showPermissionsPrompt}>Change Permissions</Button>
        </Card.Text>
      </>
    );
  }
}

type ModalProps = {
  permissions: Permissions,
  show: boolean,

  onSubmit: (p: Permissions | null) => void,
};

export function Modal({ permissions, show, onSubmit }: ModalProps) {
  const [disabled, setDisabled] = useState(false);
  const [localStorageGranted, setLocalStorageGranted] = useState(permissions.localStorage);
  const [cameraGranted, setCameraGranted] = useState(permissions.localStorage && permissions.camera);
  const [geolocationGranted, setGeolocationGranted] = useState(permissions.localStorage && permissions.geolocation);

  useEffect(() => {
    setDisabled(!show);
    setLocalStorageGranted(permissions.localStorage);
    setCameraGranted(permissions.camera);
    setGeolocationGranted(permissions.geolocation);
  }, [show, permissions]);


  const toggleLocalStorage = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setLocalStorageGranted(!!e.target.checked);
    if (!e.target.checked) {
      setCameraGranted(false);
      setGeolocationGranted(false);
    }
  }, []);
  const toggleCamera = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setCameraGranted(!!e.target.checked);
  }, []);
  const toggleGeolocation = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setGeolocationGranted(!!e.target.checked);
  }, []);

  const onClickReject = useCallback(() => {
    setDisabled(true);
    setLocalStorageGranted(false);
    setCameraGranted(false);
    setGeolocationGranted(false);
    setTimeout(() => {
      onSubmit({
        localStorage: false,
        camera: false,
        geolocation: false,
      });
    }, 500);
  }, [onSubmit]);
  const onClickAccept = useCallback(() => {
    setDisabled(true);
    setTimeout(() => {
      onSubmit(
        localStorageGranted
          ? {
            localStorage: localStorageGranted,
            camera: cameraGranted,
            geolocation: geolocationGranted,
          }
          : {
            localStorage: localStorageGranted,
            camera: false,
            geolocation: false,
          }
      );
    }, 500);
  }, [onSubmit, localStorageGranted, cameraGranted, geolocationGranted]);
  const onClickAcceptAll = useCallback(() => {
    setDisabled(true);
    setLocalStorageGranted(true);
    setCameraGranted(true);
    setGeolocationGranted(true);
    setTimeout(() => {
      onSubmit({
        camera: true,
        geolocation: true,
        localStorage: true,
      });
    }, 500);
  }, [onSubmit]);
  return (
    <BModal show={show}>
      <BModal.Header onHide={() => onSubmit(null)} closeButton>
        <BModal.Title>Permissions Granted</BModal.Title>
      </BModal.Header>
      <BModal.Body>
        <p>This application needs your permission to function correctly!</p>
        <Form.Check
          type="checkbox"
          id="allowLocalStorage"
          label="Allow us to use local storage to store permissions granted and let you stay authenticated"
          checked={localStorageGranted}
          disabled={disabled}
          onChange={toggleLocalStorage}
        />
        <Form.Check
          type="checkbox"
          id="allowCamera"
          label="Allow us to use your camera for scanning invites and taking bus stop pictures"
          checked={cameraGranted}
          disabled={disabled || !localStorageGranted}
          onChange={toggleCamera}
        />
        <Form.Check
          type="checkbox"
          id="allowGeolocation"
          label="Allow us to use your geolocation when submitting pictures and showing you nearby bus stops"
          checked={geolocationGranted}
          disabled={disabled || !localStorageGranted}
          onChange={toggleGeolocation}
        />
      </BModal.Body>
      <BModal.Footer>
        <Button
          variant="secondary"
          onClick={onClickReject}
          disabled={disabled}>Reject All</Button>
        <Button
          onClick={onClickAccept}
          disabled={disabled || !localStorageGranted}>Accept Selected</Button>
        <Button
          onClick={onClickAcceptAll}
          disabled={disabled}>Accept All</Button>
      </BModal.Footer>
    </BModal>
  );
}
