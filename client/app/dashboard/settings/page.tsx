'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { User, Lock, Mail, Save, CheckCircle, LogOut, Languages, X, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

function getAccessToken(): string | null {
  return typeof window === 'undefined' ? null : localStorage.getItem('access_token');
}

export default function SettingsPage() {
  const router = useRouter();

  // --- UI state ---
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // --- Profile (demo/local only) ---
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
  });

  // --- Password (demo/local only) ---
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // --- Language preferences (demo shell) ---
  const LANGUAGES = useMemo(
    () => [
      'English','Spanish','French','German','Italian','Portuguese','Dutch','Swedish','Norwegian','Danish',
      'Finnish','Russian','Ukrainian','Polish','Czech','Greek','Turkish','Arabic','Hebrew','Persian',
      'Hindi','Bengali','Punjabi','Tamil','Telugu','Kannada','Malayalam','Marathi','Gujarati','Urdu',
      'Chinese (Mandarin)','Cantonese','Japanese','Korean','Thai','Vietnamese','Indonesian','Malay',
      'Filipino (Tagalog)','Swahili','Zulu','Xhosa','Amharic',
    ],
    []
  );
  const [langOpen, setLangOpen] = useState(false);
  const [langQuery, setLangQuery] = useState('');
  const [selectedLangs, setSelectedLangs] = useState<string[]>(
    // seed from localStorage for demo persistence
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('demo_languages') || '[]')
      : []
  );

  const filteredLangs = useMemo(() => {
    const q = langQuery.trim().toLowerCase();
    return q ? LANGUAGES.filter((l) => l.toLowerCase().includes(q)) : LANGUAGES;
  }, [LANGUAGES, langQuery]);

  // --- Tiny sfx ping (unchanged) ---
  const ping = useCallback((freq = 880, dur = 0.06, vol = 0.03) => {
    try {
      const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!Ctx) return;
      const ctx = new Ctx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + dur);
    } catch {}
  }, []);

  // --- Demo init: pull name/email from localStorage if present, no network calls ---
  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.push('/auth/signin');
      return;
    }
    const storedName = localStorage.getItem('user_name') || '';
    const storedEmail = localStorage.getItem('user_email') || ''; // optional; set elsewhere if you like
    setProfileData({ name: storedName, email: storedEmail });
  }, [router]);

  // --- Profile save (demo: local only) ---
  const handleProfileUpdate = async () => {
    setMessage(null);
    setSaving(true);

    // Simulate saving locally
    localStorage.setItem('user_name', profileData.name || '');
    localStorage.setItem('user_email', (profileData.email || '').toLowerCase());

    setTimeout(() => {
      setSaving(false);
      setMessage({ type: 'success', text: 'Profile updated (demo)' });
      ping(880, 0.08, 0.04);
      setTimeout(() => setMessage(null), 2500);
    }, 400);
  };

  // --- Password save (demo: validate only) ---
  const handlePasswordUpdate = async () => {
    setMessage(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      ping(420, 0.08, 0.04);
      return;
    }
    if (passwordData.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters' });
      ping(420, 0.08, 0.04);
      return;
    }

    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setMessage({ type: 'success', text: 'Password updated (demo)' });
      ping(880, 0.08, 0.04);
      setTimeout(() => setMessage(null), 2500);
    }, 500);
  };

  // --- Languages (demo): update chips + persist to localStorage for the demo ---
  const toggleLang = (lang: string) => {
    setSelectedLangs((prev) => {
      const next = prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang];
      localStorage.setItem('demo_languages', JSON.stringify(next));
      return next;
    });
  };
  const removeLang = (lang: string) => {
    setSelectedLangs((prev) => {
      const next = prev.filter((l) => l !== lang);
      localStorage.setItem('demo_languages', JSON.stringify(next));
      return next;
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_name');
    // keep demo_languages to show persistence after re-login if desired
    ping(660, 0.09, 0.03);
    router.push('/auth/signin');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-1">Manage your account settings and preferences</p>
      </div>

      {message && (
        <div
          className={`rounded-xl p-4 flex items-center gap-3 ${
            message.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
              : 'bg-rose-50 border border-rose-200 text-rose-700'
          }`}
        >
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      {/* Profile Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Profile Information</h2>
            <p className="text-sm text-slate-600">Update your personal details</p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <User className="w-5 h-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-300 focus:border-cyan-500 focus:outline-none text-slate-900"
                placeholder="Your name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <Mail className="w-5 h-5 text-slate-400" />
              </div>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-300 focus:border-cyan-500 focus:outline-none text-slate-900"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <button
            onClick={handleProfileUpdate}
            disabled={saving}
            className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-xl font-medium hover:shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Language Preferences (Demo shell) */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
            <Languages className="w-6 h-6 text-white" />
          </div>
        <div>
            <h2 className="text-xl font-bold text-slate-900">Change Languages </h2>
            <p className="text-sm text-slate-600">
              Choose languages you want to learn. 
            </p>
          </div>
        </div>

        {/* Selected chips */}
        {selectedLangs.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {selectedLangs.map((lang) => (
              <span
                key={lang}
                className="inline-flex items-center gap-1.5 rounded-md bg-cyan-50 text-cyan-800 border border-cyan-200 px-2 py-1 text-xs"
              >
                {lang}
                <button
                  type="button"
                  onClick={() => removeLang(lang)}
                  className="rounded-sm p-0.5 text-cyan-700 hover:bg-cyan-100"
                  aria-label={`Remove ${lang}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="relative max-w-xl">
          <button
            type="button"
            onClick={() => setLangOpen((v) => !v)}
            className="w-full rounded-xl border-2 border-slate-300 bg-white px-4 py-3 text-left outline-none focus:border-cyan-500"
            aria-haspopup="listbox"
            aria-expanded={langOpen}
          >
            {selectedLangs.length === 0 ? 'Select languages…' : 'Add more languages…'}
          </button>

          {langOpen && (
            <div className="absolute z-20 mt-2 w-full rounded-xl border border-slate-200 bg-white shadow-lg">
              <div className="flex items-center gap-2 p-2 border-b border-slate-200">
                <Search className="w-4 h-4 text-slate-400 ml-1" />
                <input
                  autoFocus
                  value={langQuery}
                  onChange={(e) => setLangQuery(e.target.value)}
                  placeholder="Search languages…"
                  className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-cyan-500"
                />
              </div>
              <ul className="max-h-56 overflow-auto py-1" role="listbox">
                {filteredLangs.length === 0 && (
                  <li className="px-3 py-2 text-sm text-slate-500">No matches</li>
                )}
                {filteredLangs.map((lang) => {
                  const active = selectedLangs.includes(lang);
                  return (
                    <li key={lang}>
                      <button
                        type="button"
                        onClick={() => toggleLang(lang)}
                        className={[
                          'flex w-full items-center justify-between px-3 py-2 text-left text-sm',
                          active ? 'bg-cyan-50 text-cyan-800' : 'hover:bg-slate-50',
                        ].join(' ')}
                        role="option"
                        aria-selected={active}
                      >
                        <span>{lang}</span>
                        {active && (
                          <span className="text-xs font-medium text-cyan-700">Selected</span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
              <div className="flex items-center justify-end gap-2 border-t border-slate-200 p-2">
                <button
                  type="button"
                  onClick={() => {
                    setLangOpen(false);
                    setLangQuery('');
                    ping(800, 0.06, 0.03);
                  }}
                  className="rounded-md px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                >
                  Done
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedLangs([]);
                    localStorage.setItem('demo_languages', '[]');
                  }}
                  className="rounded-md px-3 py-1.5 text-sm text-cyan-700 hover:bg-cyan-50"
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Password Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Change Password</h2>
            <p className="text-sm text-slate-600">Update your password (demo validation only)</p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Current Password</label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-cyan-500 focus:outline-none text-slate-900"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-cyan-500 focus:outline-none text-slate-900"
              placeholder="••••••••"
            />
            <p className="text-xs text-slate-500 mt-1">Must be at least 8 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Confirm New Password</label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-cyan-500 focus:outline-none text-slate-900"
              placeholder="••••••••"
            />
          </div>

          <button
            onClick={handlePasswordUpdate}
            disabled={saving}
            className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <Lock className="w-5 h-5" />
            {saving ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-2xl shadow-lg border-2 border-rose-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center">
            <LogOut className="w-6 h-6 text-rose-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Danger Zone</h2>
            <p className="text-sm text-slate-600">Irreversible account actions</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full px-6 py-3 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-xl font-medium transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </button>
      </div>
    </div>
  );
}
