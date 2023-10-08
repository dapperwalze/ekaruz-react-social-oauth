import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { FacebookProvider, GoogleOAuthProvider, LinkedInCallback, SnapChatCallback, TwitterCallback } from '@ekaruz/react-social-auth'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
  },
  {
    path: "/callback/linkedin",
    element: <LinkedInCallback />,
  },
  {
    path: "/callback/snapchat",
    element: <SnapChatCallback />,
  },
  {
    path: "/callback/twitter",
    element: <TwitterCallback />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <FacebookProvider appId={process.env.RS_FACEBOOK_APP_ID as string}>
      <GoogleOAuthProvider clientId={process.env.RS_GOOGLE_CLIENT_KEY as string}>
        <App />
      </GoogleOAuthProvider>
    </FacebookProvider>
  </React.StrictMode>,
)
