import './App.css';
import { useTwitterConnection, useFacebookConnection, useGoogleConnection, useLinkedInConnection, useSnapChatConnection } from '@ekaruz/react-social-auth';
import { useState } from 'react';
import { isEmpty } from "lodash";


function App() {
  const [googleData, setGoogleData] = useState<Record<string, any> | null>(null);

  const { onFacebookConnect, facebookData, isLoading: isFacebookLoading } = useFacebookConnection({})
  const { onTwitterConnect, twitterData, isLoading } = useTwitterConnection({ clientId: process.env.RS_TWITTER_CLIENT_KEY as string, redirect_uri: `${window.location.origin}/callback/twitter`, isOnlyGetCode: true, isOnlyGetToken: false, clientKeys: `${process.env.RS_TWITTER_CLIENT_KEYS as string}` });
  const { onSnapChatConnect, snapchatData, isLoading: isSnapchatLoading } = useSnapChatConnection({ clientId: process.env.RS_SNAPCHAT_CLIENT_KEY as string, clientSecret: process.env.RS_SNAPCHAT_BUSINESS_CLIENT_SECRET_KEY as string, redirect_uri: `${window.location.origin}/callback/snapchat`, isOnlyGetCode: true, isOnlyGetToken: false });
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

  return (
    <div className="App">
      <header className="App-header"> React Social Login Using OAuth 2.0</header>
      <div>View response in your console</div>
      <section>
        <button className={!isEmpty(facebookData) ? 'green': ''} disabled={isFacebookLoading} onClick={onFacebookConnect}>{isEmpty(facebookData) ? <span>Connect to Facebook</span>: <span>Connected to Facebook</span>}</button>
        <button className={!isEmpty(googleData) ? 'green': ''} disabled={isGoogleLoading} onClick={onGoogleConnect}>{isEmpty(googleData) ? <span>Connect to Google</span>: <span>Connected to Google</span>}</button>
        <button className={!isEmpty(twitterData) ? 'green': ''} disabled={isLoading} onClick={onTwitterConnect}>{isEmpty(twitterData) ? <span>Connect to Twitter</span>: <span>Connected to Twitter</span>}</button>
        <button className={!isEmpty(snapchatData) ? 'green': ''} disabled={isSnapchatLoading} onClick={onSnapChatConnect}>{isEmpty(snapchatData) ? <span>Connect to Snapchat</span>: <span>Connected to Snapchat</span>}</button>
        <button className={!isEmpty(linkedInData) ? 'green': ''} disabled={isLinkedInLoading} onClick={onLinkedInConnect}>{isEmpty(linkedInData) ? <span>Connect to LinkedIn</span>: <span>Connected to LinkedIn</span>}</button>
      </section>

      <div ><button onClick={reloadPage}>Reset</button></div>
    </div>
  );
}

export default App
