import { useState, useEffect } from 'react';
import Editor from './Editor/Editor'
import LoginPage from "./SignInUpPages/LoginPage"
import PageNotFound from "./PageNotFound/PageNotFound"
import SignUpPage from "./SignInUpPages/SignUpPage"
import ResetPassword from "./SignInUpPages/ResetPassword"
import { getCurrentView } from '../helpers/navigation'

function App() {
  const [currentView, setCurrentView] = useState(getCurrentView());

  useEffect(() => {
    const handleViewChange = () => {
      setCurrentView(getCurrentView());
    };

    window.addEventListener('viewChange', handleViewChange);

    // Also listen for browser back/forward buttons
    window.addEventListener('popstate', handleViewChange);

    return () => {
      window.removeEventListener('viewChange', handleViewChange);
      window.removeEventListener('popstate', handleViewChange);
    };
  }, []);

  const renderCurrentView = () => {
    switch (currentView) {
      // This views are not yet implemented:

      // case 'login':
      //   return <LoginPage />;
      // case 'signup':
      //   return <SignUpPage />;
      // case 'reset-password':
      //   return <ResetPassword />;
      case 'editor':
        return <Editor />;
      default:
        return <PageNotFound />;
    }
  };

  return (
    <>
      {renderCurrentView()}
    </>
  )
}

export default App
