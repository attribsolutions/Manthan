import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const LogoutChecker = () => {
  const history = useHistory()

  useEffect(() => {
    const handleStorageChange = (event) => {
      if ((event.key === 'roleId')) {

        if (!(event.oldValue === event.newValue)) {
          console.log(' inside User logged out');
          history.push({ pathname: "/Dashboard" })
          window.location.reload(true)
        }

      } else if (!(event.key === "i18next.I18N_LANGUAGE")
        && !(event.key === "i18next.translate.boo")
        && (event.newValue === null)) {
        window.location.reload(true)
      }

    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return null;
}
export default LogoutChecker
