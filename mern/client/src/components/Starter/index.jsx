import React, { lazy, Suspense } from 'react';

const Starter = lazy(() => import('./Starter'));

const App = (props) => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Starter {...props} />
        </Suspense>
    );
};

export default App;
