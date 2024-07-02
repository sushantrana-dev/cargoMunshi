import { Spin } from 'antd';
import React, { lazy, Suspense } from 'react';

const LandingPage = lazy(() => import('./LandingPage'));

const App = () => {
    return (
        <Suspense fallback={<Spin/>}>
            <LandingPage />
        </Suspense>
    );
};

export default App;
