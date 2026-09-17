/**
 * 3. Login Screen
 * Firebase Authentication integration with Email/Password and Google sign-in
 */
import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useApp } from '../store';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { IMAGES } from '../assets/images';

export const LoginScreen: React.FC = () => {
  const { login, loginGoogle, navigateTo } = useApp();
  const [email, setEmail] = useState('valeria.arteta@rutigo.co');
  const [password, setPassword] = useState('atlantico2026');
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Por favor completa todos los campos');
      return;
    }
    try {
      setIsLoading(true);
      setErrorMsg('');
      await login(email, password);
    } catch (err) {
      setErrorMsg('Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async (credential?: string) => {
    try {
      if (!credential) {
        setErrorMsg('Google aún no está configurado para esta plataforma.');
        return;
      }
      setIsLoading(true);
      setErrorMsg('');
      await loginGoogle(credential);
    } catch (err) {
      setErrorMsg('Error al conectar con Google.');
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col justify-between items-center px-gutter-mobile py-space-md bg-gradient-to-b from-[#FFFDF9] via-[#F8F2FF] to-[#FFF3ED] overflow-y-auto">
      {/* Top Bar */}
      <header className="w-full max-w-sm flex items-center justify-between pt-2">
        <button
          onClick={() => navigateTo('onboarding')}
          className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-on-surface hover:text-primary transition-all border border-white"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>
        <span className="text-label-md font-label-md font-bold text-on-surface-variant">
          Iniciar Sesión
        </span>
        <div className="w-10" />
      </header>

      {/* Main Container */}
      <main className="w-full max-w-sm flex-1 flex flex-col items-center justify-center my-6">
        {/* Mascot Greeting */}
        <div className="relative w-28 h-28 mb-3 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary-fixed to-secondary-fixed rounded-full blur-xl opacity-60 pointer-events-none" />
          <img
            src={IMAGES.mascot.pelicanAvatar}
            alt="Mascota RutiGo"
            className="w-full h-full object-contain drop-shadow-lg relative z-10"
          />
        </div>

        <h1 className="text-headline-lg font-headline-lg text-on-surface font-extrabold text-center mb-1">
          ¡Bienvenido de vuelta!
        </h1>
        <p className="text-body-md font-body-md text-on-surface-variant text-center mb-6">
          Ingresa a tu cuenta para explorar las rutas del Atlántico
        </p>

        {/* Clay Form Card */}
        <Card variant="white" rounded="2xl" padding="lg" className="w-full">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-error-container/40 border border-error/30 text-on-error-container text-body-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-label-sm font-label-sm font-bold text-on-surface mb-1.5 ml-1">
                Correo Electrónico
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-4 text-on-surface-variant text-[20px]">
                  mail
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@rutigo.co"
                  required
                  className="w-full h-12 pl-12 pr-4 rounded-full bg-[#FFFBF8] border border-[#E9DDD5] text-on-surface text-body-md shadow-[inset_0_2px_4px_rgba(46,41,56,0.05)] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-label-sm font-label-sm font-bold text-on-surface mb-1.5 ml-1">
                Contraseña
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-4 text-on-surface-variant text-[20px]">
                  lock
                </span>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full h-12 pl-12 pr-12 rounded-full bg-[#FFFBF8] border border-[#E9DDD5] text-on-surface text-body-md shadow-[inset_0_2px_4px_rgba(46,41,56,0.05)] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 text-on-surface-variant hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPass ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                disabled={isLoading}
                icon={isLoading ? 'progress_activity' : 'login'}
              >
                {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
              </Button>
            </div>
          </form>

          {/* Divider */}
          <div className="flex items-center my-5">
            <div className="flex-1 h-[1px] bg-[#E9DDD5]" />
            <span className="px-3 text-label-sm font-label-sm text-outline">o continúa con</span>
            <div className="flex-1 h-[1px] bg-[#E9DDD5]" />
          </div>

          {/* Google Sign In Button */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={(credentialResponse) => void handleGoogle(credentialResponse.credential)}
              onError={() => setErrorMsg('Error al conectar con Google.')}
              useOneTap={false}
            />
          </div>
        </Card>
      </main>

      {/* Switch to Register */}
      <footer className="w-full max-w-sm text-center py-4">
        <p className="text-body-sm font-body-sm text-on-surface-variant">
          ¿Aún no tienes cuenta?{' '}
          <button
            onClick={() => navigateTo('register')}
            className="font-bold text-primary hover:underline ml-1"
          >
            Regístrate aquí
          </button>
        </p>
      </footer>
    </div>
  );
};
