import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  auth,
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  signOutUser
} from '../lib/firebase';
import { hapticLight, hapticSuccess, hapticWarning } from '../utils/haptics';
import {
  X,
  LogIn,
  UserPlus,
  Mail,
  Lock,
  User,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  LogOut
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  defaultMode = 'login'
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setErrorMsg('');
      hapticLight();
      const user = await signInWithGoogle();
      if (user) {
        hapticSuccess();
        setSuccessMsg(`Welcome, ${user.displayName || user.email || 'Patron'}!`);
        setTimeout(() => {
          if (onSuccess) onSuccess();
          onClose();
        }, 700);
      }
    } catch (err: any) {
      console.warn('Google Sign In notice:', err?.code || err?.message);
      let friendly = 'Google Sign-In failed. Please try again.';
      if (err?.code === 'auth/popup-blocked' || err?.message?.includes('popup-blocked')) {
        friendly = 'Browser blocked the Google sign-in popup. Please allow popups or use email sign-in.';
      } else if (err?.code === 'auth/api-key-not-valid' || err?.message?.includes('api-key-not-valid')) {
        friendly = 'Live Firebase Auth is initializing. Continuing in demo mode.';
      }
      setErrorMsg(friendly);
      hapticWarning();
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    if (mode === 'signup' && password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMsg('');
      hapticLight();

      if (mode === 'login') {
        await signInWithEmail(email.trim(), password);
        hapticSuccess();
        setSuccessMsg('Welcome back to AL NOUREEN!');
      } else {
        await signUpWithEmail(email.trim(), password, name.trim());
        hapticSuccess();
        setSuccessMsg('Account created successfully!');
      }

      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 700);
    } catch (err: any) {
      console.error('Email Auth Error:', err);
      let userFriendlyError = err?.message || 'Authentication failed.';
      if (userFriendlyError.includes('auth/invalid-credential') || userFriendlyError.includes('auth/wrong-password') || userFriendlyError.includes('auth/user-not-found')) {
        userFriendlyError = 'Invalid email or password.';
      } else if (userFriendlyError.includes('auth/email-already-in-use')) {
        userFriendlyError = 'An account with this email already exists. Try signing in.';
      } else if (userFriendlyError.includes('auth/weak-password')) {
        userFriendlyError = 'Password should be at least 6 characters.';
      }
      setErrorMsg(userFriendlyError);
      hapticWarning();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-[#FAF7F2] dark:bg-[#1A1613] border border-[#E8E2D5] dark:border-[#332A22] rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl relative overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#8C7E72] hover:text-[#1E1A17] dark:hover:text-[#FAF7F2] hover:bg-[#E8E2D5]/50 dark:hover:bg-[#2E2620] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-[#1E1A17] text-[#D4AF37] border border-[#C59B27]/40 flex items-center justify-center mx-auto mb-3 shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-playfair text-2xl font-bold text-[#1E1A17] dark:text-[#FAF7F2]">
            {mode === 'login' ? 'Welcome Back' : 'Create Atelier Account'}
          </h3>
          <p className="text-xs font-sans-ui text-[#8C7E72] mt-1">
            {mode === 'login'
              ? 'Access your bespoke orders, wishlist, and exclusive previews'
              : 'Join the AL NOUREEN luxury atelier community'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#EFE9DF] dark:bg-[#26201B] p-1 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 text-xs font-sans-ui font-semibold rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-white dark:bg-[#1E1915] text-[#1E1A17] dark:text-[#FAF7F2] shadow-xs'
                : 'text-[#8C7E72] hover:text-[#1E1A17] dark:hover:text-[#FAF7F2]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 text-xs font-sans-ui font-semibold rounded-lg transition-all ${
              mode === 'signup'
                ? 'bg-white dark:bg-[#1E1915] text-[#1E1A17] dark:text-[#FAF7F2] shadow-xs'
                : 'text-[#8C7E72] hover:text-[#1E1A17] dark:hover:text-[#FAF7F2]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error / Success Notifications */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Google Quick Sign In */}
        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full py-3 px-4 rounded-xl border border-[#D5CEBF] dark:border-[#3E342B] bg-white dark:bg-[#241E19] hover:bg-[#F4EFE6] dark:hover:bg-[#2D2621] text-xs font-sans-ui font-semibold text-[#1E1A17] dark:text-[#FAF7F2] flex items-center justify-center gap-2.5 transition-all shadow-xs disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
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
          Continue with Google
        </button>

        {/* Divider */}
        <div className="relative my-5 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E8E2D5] dark:border-[#332A22]" />
          </div>
          <span className="relative bg-[#FAF7F2] dark:bg-[#1A1613] px-3 text-[11px] font-sans-ui text-[#8C7E72] uppercase tracking-wider">
            Or with email
          </span>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleEmailSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-sans-ui font-medium text-[#5A5046] dark:text-[#BDB0A4] mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#8C7E72] absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="Eleanor Vance"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#D5CEBF] dark:border-[#3E342B] bg-white dark:bg-[#241E19] text-xs font-sans-ui text-[#1E1A17] dark:text-[#FAF7F2] focus:outline-hidden focus:border-[#C59B27]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-sans-ui font-medium text-[#5A5046] dark:text-[#BDB0A4] mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8C7E72] absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="client@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#D5CEBF] dark:border-[#3E342B] bg-white dark:bg-[#241E19] text-xs font-sans-ui text-[#1E1A17] dark:text-[#FAF7F2] focus:outline-hidden focus:border-[#C59B27]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-sans-ui font-medium text-[#5A5046] dark:text-[#BDB0A4] mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8C7E72] absolute left-3.5 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#D5CEBF] dark:border-[#3E342B] bg-white dark:bg-[#241E19] text-xs font-sans-ui text-[#1E1A17] dark:text-[#FAF7F2] focus:outline-hidden focus:border-[#C59B27]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 rounded-xl bg-[#1E1A17] hover:bg-[#2F2823] text-[#FAF7F2] text-xs font-sans-ui font-semibold flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="animate-pulse">Processing...</span>
            ) : mode === 'login' ? (
              <>
                <LogIn className="w-4 h-4 text-[#D4AF37]" /> Sign In
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 text-[#D4AF37]" /> Create Atelier Account
              </>
            )}
          </button>
        </form>

        <p className="text-[11px] text-center font-sans-ui text-[#8C7E72] mt-5">
          By signing in, you agree to AL NOUREEN&apos;s Terms of Service and Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
};
