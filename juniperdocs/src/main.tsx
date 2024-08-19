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
import Homepage from './react-components/Homepage.tsx';
import SignupPage from './react-components/SignupPage.tsx'
import LoginPage from './react-components/LoginPage.tsx';


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
  {
    path: "homepage",
    element: <Homepage name={'searchDocumentsInput'} id={'searchDocumentsInput'} placeholder={'Search Documents.'} />
  },
  {
    path: "signup",
    element: <SignupPage />
  },
  {
    path: "login",
    element: <LoginPage />
  }
]);


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
