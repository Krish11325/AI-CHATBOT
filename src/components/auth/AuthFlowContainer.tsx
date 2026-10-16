import React, { useState } from 'react';
import { SplashScreen } from './SplashScreen';
import { LoginScreen } from './LoginScreen';
import { SignupScreen } from './SignupScreen';
import { ForgotPasswordScreen } from './ForgotPasswordScreen';
import { PersonalizationScreen } from './PersonalizationScreen';
import { AuthService, AuthUser } from '../../services/authService';

interface AuthFlowContainerProps {
  onAuthenticated: (authUser: AuthUser) => void;
}

export type AuthScreenType = 'splash' | 'login' | 'signup' | 'forgotPassword' | 'personalization';

export const AuthFlowContainer: React.FC<AuthFlowContainerProps> = ({ onAuthenticated }) => {
  const [currentScreen, setCurrentScreen] = useState<AuthScreenType>('splash');
  const [activeUser, setActiveUser] = useState<AuthUser | null>(null);

  const handleSplashFinish = () => {
    const existing = AuthService.getCurrentUser();
    if (existing) {
      if (existing.hasCompletedPersonalization) {
        onAuthenticated(existing);
      } else {
        setActiveUser(existing);
        setCurrentScreen('personalization');
      }
    } else {
      setCurrentScreen('login');
    }
  };

  const handleLoginSuccess = (user: AuthUser) => {
    if (user.hasCompletedPersonalization) {
      onAuthenticated(user);
    } else {
      setActiveUser(user);
      setCurrentScreen('personalization');
    }
  };

  const handleSignupSuccess = (user: AuthUser) => {
    setActiveUser(user);
    setCurrentScreen('personalization');
  };

  const handlePersonalizationComplete = (updatedUser: AuthUser) => {
    onAuthenticated(updatedUser);
  };

  if (currentScreen === 'splash') {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  if (currentScreen === 'login') {
    return (
      <LoginScreen
        onLoginSuccess={handleLoginSuccess}
        onNavigateToSignup={() => setCurrentScreen('signup')}
        onNavigateToForgotPassword={() => setCurrentScreen('forgotPassword')}
      />
    );
  }

  if (currentScreen === 'signup') {
    return (
      <SignupScreen
        onSignupSuccess={handleSignupSuccess}
        onNavigateToLogin={() => setCurrentScreen('login')}
      />
    );
  }

  if (currentScreen === 'forgotPassword') {
    return (
      <ForgotPasswordScreen
        onNavigateToLogin={() => setCurrentScreen('login')}
      />
    );
  }

  if (currentScreen === 'personalization' && activeUser) {
    return (
      <PersonalizationScreen
        authUser={activeUser}
        onPersonalizationComplete={handlePersonalizationComplete}
      />
    );
  }

  return (
    <LoginScreen
      onLoginSuccess={handleLoginSuccess}
      onNavigateToSignup={() => setCurrentScreen('signup')}
      onNavigateToForgotPassword={() => setCurrentScreen('forgotPassword')}
    />
  );
};
