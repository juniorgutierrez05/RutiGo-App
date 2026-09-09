/**
 * 4. Register Screen
 * Firebase Authentication sign up with name, email, password, and home municipality in Atlántico
 */
import React, { useState } from 'react';
import { useApp } from '../store';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ATLANTICO_MUNICIPALITIES } from '../services/locationService';

export const RegisterScreen: React.FC = () => {
  const { register, navigateTo } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [homeCity, setHomeCity] = useState('Barranquilla');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setErrorMsg('Por favor completa todos los campos requeridos');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    try {
      setIsLoading(true);
      setErrorMsg('');
      await register(name, email, password, homeCity);
    } catch (err) {
      setErrorMsg('Error al registrar usuario. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col justify-between items-center px-gutter-mobile py-space-md bg-gradient-to-b from-[#FFFDF9] via-[#F8F2FF] to-[#FFF3ED] overflow-y-auto">
      {/* Top Bar */}
      <header className="w-full max-w-sm flex items-center justify-between pt-2">
        <button
          onClick={() => navigateTo('login')}
          className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-on-surface hover:text-primary transition-all border border-white"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>
        <span className="text-label-md font-label-md font-bold text-on-surface-variant">
          Crear Cuenta
        </span>
        <div className="w-10" />
      </header>

      {/* Main Container */}
      <main className="w-full max-w-sm flex-1 flex flex-col items-center justify-center my-6">
        <h1 className="text-headline-lg font-headline-lg text-on-surface font-extrabold text-center mb-1">
          Únete a Ruti<span className="text-primary-container">Go</span>
        </h1>
        <p className="text-body-md font-body-md text-on-surface-variant text-center mb-6">
          Descubre y comparte la magia cultural y gastronómica del Atlántico
        </p>

        {/* Form Card */}
        <Card variant="white" rounded="2xl" padding="lg" className="w-full">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-error-container/40 border border-error/30 text-on-error-container text-body-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-3.5">
            {/* Name Input */}
            <div>
              <label className="block text-label-sm font-label-sm font-bold text-on-surface mb-1 ml-1">
                Nombre Completo
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-4 text-on-surface-variant text-[20px]">
                  person
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre y apellido"
                  required
                  className="w-full h-11 pl-12 pr-4 rounded-full bg-[#FFFBF8] border border-[#E9DDD5] text-on-surface text-body-md shadow-[inset_0_2px_4px_rgba(46,41,56,0.05)] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-label-sm font-label-sm font-bold text-on-surface mb-1 ml-1">
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
                  placeholder="correo@ejemplo.com"
                  required
                  className="w-full h-11 pl-12 pr-4 rounded-full bg-[#FFFBF8] border border-[#E9DDD5] text-on-surface text-body-md shadow-[inset_0_2px_4px_rgba(46,41,56,0.05)] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            {/* Municipality Selector */}
            <div>
              <label className="block text-label-sm font-label-sm font-bold text-on-surface mb-1 ml-1">
                Municipio de Residencia
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-4 text-on-surface-variant text-[20px]">
                  location_city
                </span>
                <select
                  value={homeCity}
                  onChange={(e) => setHomeCity(e.target.value)}
                  className="w-full h-11 pl-12 pr-4 rounded-full bg-[#FFFBF8] border border-[#E9DDD5] text-on-surface text-body-md shadow-[inset_0_2px_4px_rgba(46,41,56,0.05)] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
                >
                  {Object.keys(ATLANTICO_MUNICIPALITIES).map((muni) => (
                    <option key={muni} value={muni}>
                      {muni}, Atlántico
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-4 text-on-surface-variant pointer-events-none text-[20px]">
                  expand_more
                </span>
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-label-sm font-label-sm font-bold text-on-surface mb-1 ml-1">
                Contraseña
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-4 text-on-surface-variant text-[20px]">
                  lock
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  required
                  className="w-full h-11 pl-12 pr-4 rounded-full bg-[#FFFBF8] border border-[#E9DDD5] text-on-surface text-body-md shadow-[inset_0_2px_4px_rgba(46,41,56,0.05)] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                disabled={isLoading}
                icon={isLoading ? 'progress_activity' : 'how_to_reg'}
              >
                {isLoading ? 'Registrando...' : 'Crear mi Cuenta'}
              </Button>
            </div>
          </form>
        </Card>
      </main>

      {/* Switch to Login */}
      <footer className="w-full max-w-sm text-center py-4">
        <p className="text-body-sm font-body-sm text-on-surface-variant">
          ¿Ya tienes una cuenta?{' '}
          <button
            onClick={() => navigateTo('login')}
            className="font-bold text-primary hover:underline ml-1"
          >
            Inicia sesión
          </button>
        </p>
      </footer>
    </div>
  );
};
