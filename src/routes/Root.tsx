import { Card } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';

import Footer from '../Footer';

export default function Root({ children }: any) {
    return (
        <>
            <Card>
                <Card.Body>
                    <Outlet />
                </Card.Body>
            </Card>

            <Footer />
        </>
    );
}