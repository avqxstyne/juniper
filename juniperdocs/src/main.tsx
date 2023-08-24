import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import ErrorPage from './react-components/ErrorPage.tsx';
import { v4 as uuidV4 } from 'uuid'


const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to={`/documents/${uuidV4()}`} />,
    errorElement: <ErrorPage />
  },
  {
    path: "documents/:id",
    element: <App />,
  },
]);


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
