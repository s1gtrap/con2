import React from 'react';

import { useAuthContext } from './App';

function Profile() {
    const [user] = useAuthContext();
    return (
        <>
            {user!.id}
        </>
    );
}

export default Profile;