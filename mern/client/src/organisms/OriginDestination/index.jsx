import React, { lazy, Suspense } from 'react';

const OriginDestination = lazy(() => import('./OriginDestination'));

const App = (props) => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <OriginDestination {...props} />
        </Suspense>
    );
};

export default App;
