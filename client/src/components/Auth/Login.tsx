import { useNavigate, useOutletContext } from 'react-router-dom';
import { useAuthContext } from '~/hooks/AuthContext';
import type { TLoginLayoutContext } from '~/common';
import { ErrorMessage } from '~/components/Auth/ErrorMessage';
import { getLoginError } from '~/utils';
import { useLocalize } from '~/hooks';
import LoginForm from './LoginForm';
import { useEffect } from 'react';

function Login() {
  const localize = useLocalize();
  const { error, setError, login, isAuthenticated } = useAuthContext();
  const { startupConfig } = useOutletContext<TLoginLayoutContext>();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/c/new', { replace: true });
    } else if (startupConfig?.openidLoginEnabled) {
      window.location.href = `${startupConfig.serverDomain}/oauth/openid`;
    }
  }, [isAuthenticated, navigate, startupConfig]);

  if (!startupConfig) {
    return null;
  }

  return (
    <>
      {error && <ErrorMessage>{localize(getLoginError(error))}</ErrorMessage>}
      {startupConfig?.emailLoginEnabled && (
        <LoginForm
          onSubmit={login}
          startupConfig={startupConfig}
          error={error}
          setError={setError}
        />
      )}
      {startupConfig?.registrationEnabled && (
        <p className="my-4 text-center text-sm font-light text-gray-700 dark:text-white">
          {' '}
          {localize('com_auth_no_account')}{' '}
          <a href="/register" className="p-1 text-green-500">
            {localize('com_auth_sign_up')}
          </a>
        </p>
      )}
    </>
  );
}

export default Login;
