import { useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { useNavigate, Outlet } from 'react-router-dom';

import Footer from '../Footer';

export default function Root({ children }: { children?: JSX.Element[] }) {
    const navigate = useNavigate();
    useEffect(() => {
        // XXX: super hacky way of bringing invalid gh-pages requests back to
        //      dynamically routed react app by redirecting to /#/<route> and
        //      pushing by navigating to /<route>. also see 404.{md,html} in
        //      public/ used to make pages play nice.
        if (window.location.hash.length > 1) {
            navigate(window.location.hash.slice(1));
        }
    });

    return (
        <div className="container d-grid vh-100">
            <div className="row justify-content-center align-self-center m-1">
                <Card>
                    <Card.Body>
                        <Outlet />
                    </Card.Body>
                </Card>

                <Footer />
            </div >
        </div >
    );
}