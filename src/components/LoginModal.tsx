import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiEye, FiEyeOff, FiMail, FiX } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { authApi } from '../services/api';
import { Button } from './Button';
import { cn } from '../lib/utils';

type ModalView = 'method-select' | 'login' | 'register' | 'forgot-password' | 'check-email' | 'register-success';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

const GoogleIcon = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

function InputField({
  label,
  type,
  value,
  onChange,
  placeholder,
  error,
  showToggle,
  onToggle,
  autoComplete,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  showToggle?: boolean;
  onToggle?: () => void;
  autoComplete?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={cn(
            'w-full px-3 py-2 border rounded-md text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition',
            error
              ? 'border-red-400 dark:border-red-500 bg-red-50 dark:bg-red-900/20'
              : 'border-gray-300 dark:border-gray-600',
            showToggle && 'pr-10',
          )}
        />
        {showToggle && onToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            tabIndex={-1}
          >
            {type === 'password' ? <FiEye size={16} /> : <FiEyeOff size={16} />}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{error}</p>}
    </div>
  );
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { t } = useTranslation('auth');
  const { login, loginWithEmail, register } = useAuth();

  const [view, setView] = useState<ModalView>('method-select');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  const [forgotEmail, setForgotEmail] = useState('');

  if (!isOpen) return null;

  const clearErrors = () => { setError(''); setFieldErrors({}); };
  const switchView = (next: ModalView) => { clearErrors(); setView(next); };
  const handleClose = () => { switchView('method-select'); onClose(); };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    clearErrors();
    try {
      await new Promise((r) => setTimeout(r, 300));
      await login();
    } catch {
      setError(t('errorGeneric'));
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    const errs: Record<string, string> = {};
    if (!loginEmail) errs.loginEmail = t('fieldRequired');
    if (!loginPassword) errs.loginPassword = t('fieldRequired');
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }
    setIsLoading(true);
    try {
      await loginWithEmail(loginEmail, loginPassword);
      handleClose();
    } catch (err: any) {
      const detail = err?.response?.data?.detail ?? '';
      setError(detail.includes('verify') ? t('errorNotVerified') : t('errorInvalidCredentials'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    const errs: Record<string, string> = {};
    if (!regEmail) errs.regEmail = t('fieldRequired');
    if (!regPassword) errs.regPassword = t('fieldRequired');
    else if (regPassword.length < 8) errs.regPassword = t('errorPasswordTooShort');
    if (regConfirm !== regPassword) errs.regConfirm = t('errorPasswordMismatch');
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }
    setIsLoading(true);
    try {
      await register(regEmail, regPassword, regName || undefined);
      switchView('register-success');
    } catch (err: any) {
      const detail = err?.response?.data?.detail ?? '';
      setError(detail.includes('already exists') ? t('errorEmailTaken') : t('errorGeneric'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    if (!forgotEmail) { setFieldErrors({ forgotEmail: t('fieldRequired') }); return; }
    setIsLoading(true);
    try {
      await authApi.forgotPassword(forgotEmail);
      switchView('check-email');
    } catch {
      setError(t('errorGeneric'));
    } finally {
      setIsLoading(false);
    }
  };

  const emailTabBar = (activeTab: 'login' | 'register') => (
    <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
      <button
        onClick={() => switchView('login')}
        className={cn(
          'pb-3 px-1 text-sm font-medium border-b-2 mr-6 transition-colors',
          activeTab === 'login'
            ? 'text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400 font-semibold'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 border-transparent',
        )}
      >
        {t('signIn')}
      </button>
      <button
        onClick={() => switchView('register')}
        className={cn(
          'pb-3 px-1 text-sm font-medium border-b-2 transition-colors',
          activeTab === 'register'
            ? 'text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400 font-semibold'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 border-transparent',
        )}
      >
        {t('createAccount')}
      </button>
    </div>
  );

  const methodBtn = 'w-full flex items-center justify-center gap-2.5 px-4 py-2.5 border rounded-lg text-sm font-medium transition disabled:opacity-50 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 z-10"
          disabled={isLoading}
        >
          <FiX size={20} />
        </button>

        <div className="px-6 pt-4 pb-6">

          {/* ── Method select ─────────────────────────────────── */}
          {view === 'method-select' && (
            <div className="pt-6">
              <button onClick={handleGoogleLogin} disabled={isLoading} className={methodBtn}>
                {isLoading ? (
                  <svg className="animate-spin w-4 h-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <GoogleIcon />
                )}
                {t('continueWithGoogle')}
              </button>

              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">Or</span>
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
              </div>

              <button onClick={() => switchView('login')} disabled={isLoading} className={methodBtn}>
                <FiMail size={16} className="shrink-0" />
                {t('continueWithEmail')}
              </button>

              <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-5">{t('termsAgreement')}</p>
            </div>
          )}

          {/* ── Sign in ───────────────────────────────────────── */}
          {view === 'login' && (
            <>
              <button
                onClick={() => switchView('method-select')}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline mb-4 flex items-center gap-1"
              >
                ← {t('allSignInOptions')}
              </button>

              {emailTabBar('login')}

              <form onSubmit={handleLogin} className="space-y-4">
                <InputField label={t('email')} type="email" value={loginEmail} onChange={setLoginEmail} placeholder="you@example.com" error={fieldErrors.loginEmail} autoComplete="email" />
                <InputField label={t('password')} type={showLoginPassword ? 'text' : 'password'} value={loginPassword} onChange={setLoginPassword} placeholder="••••••••" error={fieldErrors.loginPassword} showToggle onToggle={() => setShowLoginPassword((v) => !v)} autoComplete="current-password" />
                <div className="text-right">
                  <button type="button" onClick={() => switchView('forgot-password')} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
                    {t('forgotPassword')}
                  </button>
                </div>
                {error && <p className="text-sm text-red-500 dark:text-red-400 text-center">{error}</p>}
                <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>{t('signIn')}</Button>
              </form>
            </>
          )}

          {/* ── Register ──────────────────────────────────────── */}
          {view === 'register' && (
            <>
              <button
                onClick={() => switchView('method-select')}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline mb-4 flex items-center gap-1"
              >
                ← {t('allSignInOptions')}
              </button>

              {emailTabBar('register')}

              <form onSubmit={handleRegister} className="space-y-4">
                <InputField label={`${t('name')} (${t('optional')})`} type="text" value={regName} onChange={setRegName} placeholder={t('namePlaceholder')} autoComplete="name" />
                <InputField label={t('email')} type="email" value={regEmail} onChange={setRegEmail} placeholder="you@example.com" error={fieldErrors.regEmail} autoComplete="email" />
                <InputField label={t('password')} type={showRegPassword ? 'text' : 'password'} value={regPassword} onChange={setRegPassword} placeholder={t('passwordMinLength')} error={fieldErrors.regPassword} showToggle onToggle={() => setShowRegPassword((v) => !v)} autoComplete="new-password" />
                <InputField label={t('confirmPassword')} type={showRegPassword ? 'text' : 'password'} value={regConfirm} onChange={setRegConfirm} placeholder="••••••••" error={fieldErrors.regConfirm} autoComplete="new-password" />
                {error && <p className="text-sm text-red-500 dark:text-red-400 text-center">{error}</p>}
                <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>{t('createAccount')}</Button>
              </form>

              <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-4">{t('termsAgreement')}</p>
            </>
          )}

          {/* ── Register success ──────────────────────────────── */}
          {view === 'register-success' && (
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{t('checkYourEmail')}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{t('verificationSent', { email: regEmail })}</p>
              <Button variant="outline" fullWidth onClick={() => switchView('login')}>{t('backToSignIn')}</Button>
            </div>
          )}

          {/* ── Forgot password ───────────────────────────────── */}
          {view === 'forgot-password' && (
            <>
              <button onClick={() => switchView('login')} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline mb-4 flex items-center gap-1">
                ← {t('backToSignIn')}
              </button>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">{t('forgotPassword')}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t('forgotPasswordDescription')}</p>
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <InputField label={t('email')} type="email" value={forgotEmail} onChange={setForgotEmail} placeholder="you@example.com" error={fieldErrors.forgotEmail} autoComplete="email" />
                {error && <p className="text-sm text-red-500 dark:text-red-400 text-center">{error}</p>}
                <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>{t('sendResetLink')}</Button>
              </form>
            </>
          )}

          {/* ── Check email ───────────────────────────────────── */}
          {view === 'check-email' && (
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{t('checkYourEmail')}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{t('resetLinkSent')}</p>
              <Button variant="outline" fullWidth onClick={() => switchView('login')}>{t('backToSignIn')}</Button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
