import './App.css';
import { useTwitterConnection, useFacebookConnection, useGoogleConnection, useLinkedInConnection, useSnapChatConnection } from '@ekaruz/react-social-auth';
import { useEffect, useState } from 'react';
import { isEmpty } from "lodash";


type ParamsType = {
  state: string;
  code?: string;
  error?: string;
  error_description?: string;
};
function App() {
  const [, setErrorMessage] = useState<string>('');
  const [googleData, setGoogleData] = useState<Record<string, any> | null>(null);
  const REDIRECT_URI = `${typeof window === 'object' && window.location.origin}/callback/twitter`
  const REDIRECT_URI2 = 'https://5e93-102-89-34-102.ngrok-free.app'

  const { onFacebookConnect, facebookData, isLoading: isFacebookLoading } = useFacebookConnection({})
  const { onTwitterConnect, twitterData, isLoading } = useTwitterConnection({ clientId: process.env.RS_TWITTER_CLIENT_KEY as string, redirect_uri: REDIRECT_URI, isOnlyGetCode: true, isOnlyGetToken: false, clientKeys: `${process.env.RS_TWITTER_CLIENT_KEYS as string}` });
  const { onSnapChatConnect, snapchatData, isLoading: isSnapchatLoading } = useSnapChatConnection({ clientId: process.env.RS_SNAPCHAT_CLIENT_KEY as string, clientSecret: process.env.RS_SNAPCHAT_BUSINESS_CLIENT_SECRET_KEY as string, redirect_uri: REDIRECT_URI2, isOnlyGetCode: true, isOnlyGetToken: false });
  const { onLinkedInConnect, linkedInData, isLoading: isLinkedInLoading } = useLinkedInConnection({
    clientId: process.env.RS_LINKEDIN_CLIENT_KEY as string,
    clientSecret: process.env.RS_LINKEDIN_CLIENT_SECRET as string,
    redirectUri: `${window.location.origin}/callback/linkedin`,
    isOnlyGetToken: true
  })
  const { onGoogleConnect, isLoading: isGoogleLoading } = useGoogleConnection({
    onSuccess: (tokenResponse: any) => {
      tokenResponse && console.log("google data", tokenResponse)
      setGoogleData(tokenResponse)
    }, redirectUri: window.location.origin
  })

  const reloadPage = () => {
    window.location.reload();
  };

  !isEmpty(twitterData) && console.log("twitter data:::", twitterData)
  !isEmpty(snapchatData) && console.log("snapchat data:::", snapchatData)
  !isEmpty(linkedInData) && console.log("linkedIn data:::", linkedInData)
  !isEmpty(facebookData) && console.log("facebook data:::", facebookData)
  !isEmpty(googleData) && console.log("google data:::", googleData)

  const parse = (search: string) => {
    const query = search.substring(1);
    const vars = query.split('&');
    const parsed: Record<string, any> = {};
    for (let i = 0; i < vars.length; i++) {
      const pair = vars[i].split('=');
      if (pair.length > 1) {
        parsed[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
      }
    }
    return parsed;
  }

  useEffect(() => {
    const params = parse(window.location.search) as ParamsType;
    if (params.state !== localStorage.getItem('twitter_oauth2_state')) {
      setErrorMessage('State does not match');

    } else if (params.error) {
      const errorMessage =
        params.error_description || 'Login failed. Please try again.';
      const bc = new BroadcastChannel("twitter-channel")
      bc.postMessage({
        error: params.error,
        state: params.state,
        errorMessage,
        from: 'Twitter',
      })
      window.close();
      // Close tab if user cancelled login
      if (params.error === 'user_cancelled_login') {
        window.close();
      }
    }
    if (params.code) {
      const bc = new BroadcastChannel("twitter-channel")
      bc.postMessage({ code: params.code, state: params.state, from: 'Twitter' })
      window.close();

    }
  }, []);

  useEffect(() => {
    const params = parse(window.location.search) as ParamsType;

    if (params.state !== localStorage.getItem(`${process.env.RS_SNAPCHAT_OAUTH2_STATE}`)) {
      setErrorMessage('State does not match');

    } else if (params.error) {
      const errorMessage =
        params.error_description || 'Login failed. Please try again.';

      window.opener &&
        window.opener.postMessage(
          {
            error: params.error,
            state: params.state,
            errorMessage,
            from: 'Snapchat',
          },
          window.location.origin,
        );
      window.close();

      // Close tab if user cancelled login
      if (params.error === 'user_cancelled_login') {
        window.close();
      }
    }
    if (params.code) {
      window.opener &&
        window.opener.postMessage(
          { code: params.code, state: params.state, from: 'Snapchat' },
          window.location.origin,
        );
      window.close();
    }
  }, []);

  useEffect(() => {
    const params = parse(window.location.search) as ParamsType;
    if (params.state !== localStorage.getItem(`${process.env.RS_LINKEDIN_OAUTH2_STATE}`)) {
      setErrorMessage('State does not match');
    } else if (params.error) {
      const errorMessage =
        params.error_description || 'Login failed. Please try again.';
      window.opener &&
        window.opener.postMessage(
          {
            error: params.error,
            state: params.state,
            errorMessage,
            from: 'LinkedIn',
          },
          window.location.origin,
        );
      // Close tab if user cancelled login
      if (params.error === 'user_cancelled_login') {
        window.close();
      }
    }
    if (params.code) {
      window.opener &&
        window.opener.postMessage(
          { code: params.code, state: params.state, from: 'LinkedIn' },
          window.location.origin,
        );
      window.close();
    }
  }, []);
  return (
    <div className="App">
      <header className="App-header"> React Social Login Using OAuth 2.0</header>
      <div>View response in your console</div>
      <section>
        <button className={!isEmpty(facebookData) ? 'green': ''} disabled={isFacebookLoading} onClick={onFacebookConnect}>{isEmpty(facebookData) ? <span>Connect to Facebook</span>: <span>Connected to Facebook</span>}</button>
        <button className={!isEmpty(twitterData) ? 'green': ''} disabled={isLoading} onClick={onTwitterConnect}>{isEmpty(twitterData) ? <span>Connect to Twitter</span>: <span>Connected to Twitter</span>}</button>
        <button className={!isEmpty(snapchatData) ? 'green': ''} disabled={isSnapchatLoading} onClick={onSnapChatConnect}>{isEmpty(snapchatData) ? <span>Connect to Snapchat</span>: <span>Connected to Snapchat</span>}</button>
        <button className={!isEmpty(linkedInData) ? 'green': ''} disabled={isLinkedInLoading} onClick={onLinkedInConnect}>{isEmpty(linkedInData) ? <span>Connect to LinkedIn</span>: <span>Connected to LinkedIn</span>}</button>
        <button className={!isEmpty(googleData) ? 'green': ''} disabled={isGoogleLoading} onClick={onGoogleConnect}>{isEmpty(twitterData) ? <span>Connect to Google</span>: <span>Connected to Google</span>}</button>
      </section>

      <div ><button onClick={reloadPage}>Reset</button></div>
    </div>
  );
}

export default App
