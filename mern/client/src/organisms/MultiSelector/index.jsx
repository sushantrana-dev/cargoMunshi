import React, { lazy, Suspense } from 'react';

const MultiSelector = lazy(() => import('./MultiSelector'));

const App = (props) => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <MultiSelector {...props} />
        </Suspense>
    );
};

export default App;
