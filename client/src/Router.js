import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Main from './views/Main';
import Test from './views/Test';
import Test2 from './views/Test2';
import Test3 from './views/Test3';
const Router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '/',
                element: <Main />,
            },
            {
                path: '/test',
                element: <Test />,
            },
            {
                path: '/siba',
                element: <Test2 />,
            },
            {
                path: '/test3',
                element: <Test3 />,
            },
        ],
    },
]);

// export default Router;
