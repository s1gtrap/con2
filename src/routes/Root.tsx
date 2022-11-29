import { Card } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';

import Footer from '../Footer';

export default function Root({ children }: { children?: JSX.Element[] }) {
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