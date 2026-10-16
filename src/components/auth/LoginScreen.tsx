import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  Sparkles,
  Lock,
  Mail,
  Loader2,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import { MathPhysicsBgElements } from './MathPhysicsBgElements';
import { AuthService } from '../../services/authService';

interface LoginScreenProps {
  onLoginSuccess: (user: any) => void;
  onNavigateToSignup: () => void;
  onNavigateToForgotPassword: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onNavigateToSignup,
  onNavigateToForgotPassword
}) => {
  const [email, setEmail] = useState<string>(() => AuthService.getRememberedEmail());
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(() => !!AuthService.getRememberedEmail());

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'apple' | null>(null);

  // Field validation errors
  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [authGeneralError, setAuthGeneralError] = useState<string>('');

  const validateForm = (): boolean => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');
    setAuthGeneralError('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    }

    if (!password || password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || socialLoading) return;

    if (!validateForm()) return;

    setIsLoading(true);
    setAuthGeneralError('');

    try {
      const res = await AuthService.loginWithEmail(email, password, rememberMe);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
      } else {
        setAuthGeneralError(
          res.errorMessage || "We couldn't find an account with this email. Please check your email or create a new account."
        );
      }
    } catch {
      setAuthGeneralError('A network error occurred. Please check your internet connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    if (isLoading || socialLoading) return;

    setSocialLoading(provider);
    setAuthGeneralError('');

    try {
      const res = await AuthService.loginWithSocial(provider);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
      } else {
        setAuthGeneralError('Social sign-in failed. Please try again or log in with email.');
      }
    } catch {
      setAuthGeneralError('Unable to connect to sign-in provider. Please try again.');
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#F7F2E8] dark:bg-[#211C18] text-[#3B3028] dark:text-[#F5EBDD] flex flex-col justify-center items-center px-4 py-8 overflow-x-hidden selection:bg-[#B9785F] selection:text-[#FCFAF5]">
      {/* Decorative Physics & Math Elements in Sand Palette */}
      <MathPhysicsBgElements />

      <div className="relative z-10 w-full max-w-md space-y-6">
        {/* Top Branding Section */}
        <div className="text-center space-y-2">
          {/* Combined AI + Maths + Physics Logo */}
          <div className="mx-auto w-16 h-16 rounded-2xl bg-[#3B3028] dark:bg-[#C99A7B] text-[#FCFAF5] dark:text-[#211C18] shadow-lg shadow-[#3B3028]/10 flex items-center justify-center relative overflow-hidden border border-[#D8C3A5]/40">
            <span className="font-serif text-xl font-black italic">π</span>
            <span className="font-mono text-sm font-bold ml-0.5">⚛</span>
            <Sparkles className="w-3.5 h-3.5 absolute top-2 right-2 text-[#B9785F] dark:text-[#211C18]" />
          </div>

          <div>
            <h1 className="text-2xl font-black tracking-tight text-[#3B3028] dark:text-[#F5EBDD]">
              StudyMate AI
            </h1>
            <p className="text-xs font-bold text-[#B9785F] dark:text-[#C99A7B]">
              Your personal Maths & Physics tutor
            </p>
            <p className="text-[10px] font-extrabold tracking-widest text-[#75685C] dark:text-[#BFB2A4] uppercase mt-0.5">
              Learn. Solve. Understand.
            </p>
          </div>
        </div>

        {/* Login Card Container */}
        <div className="bg-[#FCFAF5] dark:bg-[#302822] backdrop-blur-xl p-6 sm:p-8 rounded-[24px] border border-[#E8DCC8] dark:border-[#423730] shadow-xl shadow-[#3B3028]/5 space-y-5">
          {/* Card Title */}
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-[#3B3028] dark:text-[#F5EBDD]">
              Welcome Back
            </h2>
            <p className="text-xs font-medium text-[#75685C] dark:text-[#BFB2A4]">
              Continue your learning journey.
            </p>
          </div>

          {/* General Friendly Auth Error Banner */}
          {authGeneralError && (
            <div className="p-3.5 rounded-2xl bg-[#B9785F]/10 border border-[#B9785F]/30 text-[#B9785F] dark:text-[#C99A7B] text-xs flex items-start space-x-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed font-medium">{authGeneralError}</div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4" noValidate>
            {/* Email Field */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#3B3028] dark:text-[#F5EBDD]">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#75685C]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError('');
                  }}
                  placeholder="Enter your email"
                  disabled={isLoading}
                  className={`w-full pl-10 pr-4 py-3 rounded-2xl border text-xs font-medium bg-[#FCFAF5] dark:bg-[#211C18] text-[#3B3028] dark:text-[#F5EBDD] placeholder-[#75685C]/60 focus:outline-none focus:ring-2 transition-all ${
                    emailError
                      ? 'border-[#B9785F] focus:ring-[#B9785F]'
                      : 'border-[#D8C3A5] dark:border-[#423730] focus:ring-[#3B3028] dark:focus:ring-[#C99A7B]'
                  }`}
                />
              </div>
              {emailError && (
                <p className="text-[11px] font-semibold text-[#B9785F] pl-1">
                  {emailError}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#3B3028] dark:text-[#F5EBDD]">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#75685C]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError('');
                  }}
                  placeholder="Enter your password"
                  disabled={isLoading}
                  className={`w-full pl-10 pr-11 py-3 rounded-2xl border text-xs font-medium bg-[#FCFAF5] dark:bg-[#211C18] text-[#3B3028] dark:text-[#F5EBDD] placeholder-[#75685C]/60 focus:outline-none focus:ring-2 transition-all ${
                    passwordError
                      ? 'border-[#B9785F] focus:ring-[#B9785F]'
                      : 'border-[#D8C3A5] dark:border-[#423730] focus:ring-[#3B3028] dark:focus:ring-[#C99A7B]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#75685C] hover:text-[#3B3028] dark:hover:text-[#F5EBDD] transition-colors"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordError && (
                <p className="text-[11px] font-semibold text-[#B9785F] pl-1">
                  {passwordError}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[#D8C3A5] text-[#3B3028] focus:ring-[#3B3028]"
                />
                <span className="text-xs font-semibold text-[#75685C] dark:text-[#BFB2A4]">
                  Remember me
                </span>
              </label>

              <button
                type="button"
                onClick={onNavigateToForgotPassword}
                className="text-xs font-bold text-[#75685C] dark:text-[#BFB2A4] hover:text-[#3B3028] dark:hover:text-[#F5EBDD] transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            {/* Main Primary Login Button */}
            <button
              type="submit"
              disabled={isLoading || !!socialLoading}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#3B3028] dark:bg-[#C99A7B] text-[#FCFAF5] dark:text-[#211C18] font-extrabold text-sm shadow-md hover:bg-[#29231F] dark:hover:bg-[#d8a88a] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 disabled:opacity-75 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing you in...</span>
                </>
              ) : (
                <>
                  <span>Login</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E8DCC8] dark:border-[#423730]" />
            </div>
            <div className="relative flex justify-center text-[10px] font-extrabold tracking-widest uppercase">
              <span className="bg-[#FCFAF5] dark:bg-[#302822] px-3 text-[#75685C] dark:text-[#BFB2A4]">
                OR CONTINUE WITH
              </span>
            </div>
          </div>

          {/* Google Social Sign-In Button */}
          <button
            type="button"
            onClick={() => handleSocialLogin('google')}
            disabled={isLoading || !!socialLoading}
            className="w-full py-3 px-4 rounded-2xl border border-[#E8DCC8] dark:border-[#423730] bg-[#FCFAF5] dark:bg-[#211C18] hover:bg-[#F7F2E8] dark:hover:bg-[#302822] text-[#3B3028] dark:text-[#F5EBDD] font-bold text-xs shadow-xs transition-all flex items-center justify-center space-x-2 active:scale-98 disabled:opacity-60"
          >
            {socialLoading === 'google' ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#3B3028]" />
            ) : (
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>Continue with Google</span>
          </button>

          {/* Footer Link: Create Account */}
          <div className="text-center pt-2">
            <p className="text-xs font-medium text-[#75685C] dark:text-[#BFB2A4]">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={onNavigateToSignup}
                className="font-extrabold text-[#B9785F] dark:text-[#C99A7B] hover:underline ml-0.5"
              >
                Create Account
              </button>
            </p>
          </div>
        </div>

        {/* Demo Fast Login Hint */}
        <div className="p-3.5 rounded-2xl bg-[#E8DCC8]/60 dark:bg-[#302822]/80 border border-[#D8C3A5]/50 dark:border-[#423730] text-center text-[11px] text-[#75685C] dark:text-[#BFB2A4] space-y-0.5">
          <p className="font-bold text-[#3B3028] dark:text-[#F5EBDD]">
            Demo Student Credentials:
          </p>
          <p>Email: <code className="font-bold text-[#3B3028] dark:text-[#F5EBDD]">alex@studymate.ai</code> • Password: <code className="font-bold text-[#3B3028] dark:text-[#F5EBDD]">password123</code></p>
        </div>
      </div>
    </div>
  );
};
