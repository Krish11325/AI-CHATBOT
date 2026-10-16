import React, { useState } from 'react';
import {
  User,
  Mail,
  Lock,
  GraduationCap,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  Sparkles,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { MathPhysicsBgElements } from './MathPhysicsBgElements';
import { AuthService } from '../../services/authService';

interface SignupScreenProps {
  onSignupSuccess: (user: any) => void;
  onNavigateToLogin: () => void;
}

export const SignupScreen: React.FC<SignupScreenProps> = ({
  onSignupSuccess,
  onNavigateToLogin
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [educationLevel, setEducationLevel] = useState('School');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  // Field errors
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');

  const validateForm = (): boolean => {
    let isValid = true;
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setGeneralError('');

    if (!fullName || fullName.trim().length < 2) {
      setNameError('Please enter your full name.');
      isValid = false;
    }

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    }

    if (!password || password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      isValid = false;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match.');
      isValid = false;
    }

    return isValid;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (!validateForm()) return;

    setIsLoading(true);
    setGeneralError('');

    try {
      const res = await AuthService.registerUser({
        fullName,
        email,
        password,
        educationLevel
      });

      if (res.success && res.user) {
        onSignupSuccess(res.user);
      } else {
        setGeneralError(
          res.errorMessage || 'Unable to create account. Please try again with a different email.'
        );
      }
    } catch (err: any) {
      setGeneralError(err?.message || 'A network error occurred. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#F7F2E8] dark:bg-[#211C18] text-[#3B3028] dark:text-[#F5EBDD] flex flex-col justify-center items-center px-4 py-8 overflow-x-hidden selection:bg-[#B9785F] selection:text-[#FCFAF5]">
      {/* Background Math/Physics Elements */}
      <MathPhysicsBgElements />

      <div className="relative z-10 w-full max-w-md space-y-5">
        {/* Top Back Nav & Branding */}
        <div className="flex items-center justify-between">
          <button
            onClick={onNavigateToLogin}
            className="p-2 rounded-2xl bg-[#FCFAF5] dark:bg-[#302822] border border-[#E8DCC8] dark:border-[#423730] text-[#75685C] dark:text-[#BFB2A4] hover:text-[#3B3028] dark:hover:text-[#F5EBDD] transition-colors flex items-center space-x-1 text-xs font-bold shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Login</span>
          </button>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-[#3B3028] dark:bg-[#C99A7B] text-[#FCFAF5] dark:text-[#211C18] flex items-center justify-center font-serif italic text-base font-bold">
              π
            </div>
            <span className="font-extrabold text-sm tracking-tight text-[#3B3028] dark:text-[#F5EBDD]">
              StudyMate AI
            </span>
          </div>
        </div>

        {/* Card Container */}
        <div className="bg-[#FCFAF5] dark:bg-[#302822] backdrop-blur-xl p-6 sm:p-8 rounded-[24px] border border-[#E8DCC8] dark:border-[#423730] shadow-xl shadow-[#3B3028]/5 space-y-5">
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-[#3B3028] dark:text-[#F5EBDD]">
              Create Your Account
            </h2>
            <p className="text-xs text-[#75685C] dark:text-[#BFB2A4]">
              Start your personalized learning journey.
            </p>
          </div>

          {generalError && (
            <div className="p-3.5 rounded-2xl bg-[#B9785F]/10 border border-[#B9785F]/30 text-[#B9785F] dark:text-[#C99A7B] text-xs flex items-start space-x-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed font-medium">{generalError}</div>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-3.5" noValidate>
            {/* Full Name */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#3B3028] dark:text-[#F5EBDD]">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#75685C]">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (nameError) setNameError('');
                  }}
                  placeholder="Enter your full name"
                  disabled={isLoading}
                  className={`w-full pl-10 pr-4 py-3 rounded-2xl border text-xs font-medium bg-[#FCFAF5] dark:bg-[#211C18] text-[#3B3028] dark:text-[#F5EBDD] placeholder-[#75685C]/60 focus:outline-none focus:ring-2 transition-all ${
                    nameError
                      ? 'border-[#B9785F] focus:ring-[#B9785F]'
                      : 'border-[#D8C3A5] dark:border-[#423730] focus:ring-[#3B3028] dark:focus:ring-[#C99A7B]'
                  }`}
                />
              </div>
              {nameError && <p className="text-[11px] font-semibold text-[#B9785F] pl-1">{nameError}</p>}
            </div>

            {/* Email Address */}
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
                  placeholder="Enter your email address"
                  disabled={isLoading}
                  className={`w-full pl-10 pr-4 py-3 rounded-2xl border text-xs font-medium bg-[#FCFAF5] dark:bg-[#211C18] text-[#3B3028] dark:text-[#F5EBDD] placeholder-[#75685C]/60 focus:outline-none focus:ring-2 transition-all ${
                    emailError
                      ? 'border-[#B9785F] focus:ring-[#B9785F]'
                      : 'border-[#D8C3A5] dark:border-[#423730] focus:ring-[#3B3028] dark:focus:ring-[#C99A7B]'
                  }`}
                />
              </div>
              {emailError && <p className="text-[11px] font-semibold text-[#B9785F] pl-1">{emailError}</p>}
            </div>

            {/* Education / Class Level */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#3B3028] dark:text-[#F5EBDD]">
                Class / Education Level
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#75685C]">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <select
                  value={educationLevel}
                  onChange={(e) => setEducationLevel(e.target.value)}
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#D8C3A5] dark:border-[#423730] text-xs font-medium bg-[#FCFAF5] dark:bg-[#211C18] text-[#3B3028] dark:text-[#F5EBDD] focus:outline-none focus:ring-2 focus:ring-[#3B3028]"
                >
                  <option value="School">School (Class 9-10 / High School)</option>
                  <option value="College">College / Engineering</option>
                  <option value="Competitive Exam">Competitive Exam (JEE / NEET / SAT)</option>
                  <option value="Other">Other / Self Learner</option>
                </select>
              </div>
            </div>

            {/* Password */}
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
                  placeholder="Create password (min 6 chars)"
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
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#75685C] hover:text-[#3B3028] dark:hover:text-[#F5EBDD]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordError && <p className="text-[11px] font-semibold text-[#B9785F] pl-1">{passwordError}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#3B3028] dark:text-[#F5EBDD]">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#75685C]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (confirmPasswordError) setConfirmPasswordError('');
                  }}
                  placeholder="Re-enter your password"
                  disabled={isLoading}
                  className={`w-full pl-10 pr-4 py-3 rounded-2xl border text-xs font-medium bg-[#FCFAF5] dark:bg-[#211C18] text-[#3B3028] dark:text-[#F5EBDD] placeholder-[#75685C]/60 focus:outline-none focus:ring-2 transition-all ${
                    confirmPasswordError
                      ? 'border-[#B9785F] focus:ring-[#B9785F]'
                      : 'border-[#D8C3A5] dark:border-[#423730] focus:ring-[#3B3028] dark:focus:ring-[#C99A7B]'
                  }`}
                />
              </div>
              {confirmPasswordError && (
                <p className="text-[11px] font-semibold text-[#B9785F] pl-1">{confirmPasswordError}</p>
              )}
            </div>

            {/* Create Account Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#3B3028] dark:bg-[#C99A7B] text-[#FCFAF5] dark:text-[#211C18] font-extrabold text-sm shadow-md hover:bg-[#29231F] dark:hover:bg-[#d8a88a] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 disabled:opacity-75 disabled:cursor-not-allowed mt-4"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#FCFAF5]" />
                  <span>Creating your account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Already have an account link */}
          <div className="text-center pt-1 border-t border-[#E8DCC8] dark:border-[#423730]">
            <p className="text-xs font-medium text-[#75685C] dark:text-[#BFB2A4]">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onNavigateToLogin}
                className="font-extrabold text-[#B9785F] dark:text-[#C99A7B] hover:underline ml-0.5"
              >
                Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
