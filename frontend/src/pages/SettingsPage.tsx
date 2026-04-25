import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  getApiBaseUrl,
  getDefaultApiBaseUrl,
  resetChatMessages,
  setApiBaseUrlOverride,
} from '../lib/clientSettings';
import {
  clearSupabaseChatHistory,
  isChatHistorySupabaseEnabled,
} from '../lib/chatHistory';

type DatabricksPingResponse = {
  ok: boolean;
  message?: string;
  errorType?: string;
  error?: string;
};

export default function SettingsPage() {
  const defaultApiBaseUrl = useMemo(() => getDefaultApiBaseUrl(), []);
  const [apiBaseUrlInput, setApiBaseUrlInput] = useState<string>(() => getApiBaseUrl());
  const [apiSaveMessage, setApiSaveMessage] = useState<string>('');

  const [pingStatus, setPingStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [pingMessage, setPingMessage] = useState<string>('');

  const [chatMessage, setChatMessage] = useState<string>('');

  const testPing = async () => {
    setPingStatus('loading');
    setPingMessage('');

    try {
      const apiBaseUrl = getApiBaseUrl();
      const res = await fetch(`${apiBaseUrl}/api/databricks/ping`, { method: 'GET' });
      const data = (await res.json()) as DatabricksPingResponse;
      if (res.ok && data.ok) {
        setPingStatus('ok');
        setPingMessage('Connected to Databricks.');
      } else {
        setPingStatus('error');
        setPingMessage(data.message || data.error || `Ping failed (${res.status}).`);
      }
    } catch {
      setPingStatus('error');
      setPingMessage('Ping failed (network/invalid response).');
    }
  };

  const saveApiBaseUrl = () => {
    setApiSaveMessage('');
    const result = setApiBaseUrlOverride(apiBaseUrlInput);
    if (!result.ok) {
      setApiSaveMessage(result.message);
      return;
    }

    setApiSaveMessage('Saved. Reload the app to apply everywhere.');
  };

  const resetApiBaseUrl = () => {
    setApiSaveMessage('');
    const result = setApiBaseUrlOverride('');
    if (!result.ok) {
      setApiSaveMessage(result.message);
      return;
    }
    setApiBaseUrlInput(getDefaultApiBaseUrl());
    setApiSaveMessage('Reset to default. Reload the app to apply everywhere.');
  };

  const clearChat = async () => {
    try {
      if (isChatHistorySupabaseEnabled) {
        await clearSupabaseChatHistory();
        setChatMessage('Chat history cleared.');
        return;
      }
    } catch (err) {
      console.warn('Failed to clear chat history in Supabase', err);
      setChatMessage('Failed to clear chat history.');
      return;
    }

    resetChatMessages();
    setChatMessage('Chat history cleared.');
  };

  return (
    <div className="h-full overflow-y-auto scrollbar-thin p-8">
      <h1 className="text-3xl font-display font-bold text-text-primary mb-2">Settings</h1>
      <p className="text-text-secondary">Configure DataPilot preferences and integrations</p>

      <div className="mt-8 grid grid-cols-1 gap-6 max-w-5xl">
        <div className="p-6 bg-bg-surface border border-[rgba(0,180,216,0.15)] rounded-lg">
          <h2 className="text-sm font-display font-bold text-text-primary mb-1">Connections</h2>
          <p className="text-xs text-text-muted mb-6">Configure how the UI talks to the backend.</p>

          <div className="space-y-3">
            <label className="block text-xs font-mono text-text-muted">API Base URL</label>
            <input
              value={apiBaseUrlInput}
              onChange={(e) => setApiBaseUrlInput(e.target.value)}
              placeholder={defaultApiBaseUrl}
              className="w-full bg-bg-primary border border-[rgba(0,180,216,0.15)] rounded-lg px-4 py-3 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-cyan"
            />

            <div className="flex gap-3">
              <motion.button
                onClick={saveApiBaseUrl}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 bg-accent-cyan hover:bg-accent-azure text-bg-primary rounded-lg text-sm font-medium transition-colors"
              >
                Save
              </motion.button>
              <button
                onClick={resetApiBaseUrl}
                className="px-4 py-2 bg-bg-primary border border-[rgba(0,180,216,0.15)] rounded-lg text-sm text-text-primary hover:border-accent-cyan transition-colors"
              >
                Reset
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-bg-primary border border-[rgba(0,180,216,0.15)] rounded-lg text-sm text-text-primary hover:border-accent-cyan transition-colors"
              >
                Reload App
              </button>
            </div>

            {apiSaveMessage && <div className="text-xs text-text-muted">{apiSaveMessage}</div>}

            <div className="pt-4 border-t border-[rgba(0,180,216,0.1)]">
              <div className="flex items-center gap-3">
                <button
                  onClick={testPing}
                  disabled={pingStatus === 'loading'}
                  className="px-4 py-2 bg-bg-primary border border-[rgba(0,180,216,0.15)] rounded-lg text-sm text-text-primary hover:border-accent-cyan transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Test Databricks Connection
                </button>
                <div
                  className={`text-xs font-mono ${
                    pingStatus === 'ok'
                      ? 'text-status-success'
                      : pingStatus === 'error'
                        ? 'text-status-error'
                        : 'text-text-muted'
                  }`}
                >
                  {pingStatus === 'loading'
                    ? 'Testing…'
                    : pingStatus === 'ok'
                      ? 'Connected'
                      : pingStatus === 'error'
                        ? 'Not connected'
                        : 'Not tested'}
                </div>
              </div>
              {pingMessage && <div className="mt-2 text-xs text-text-muted">{pingMessage}</div>}
              <div className="mt-2 text-[11px] text-text-muted">
                Note: workspace URL/host is intentionally not displayed.
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-bg-surface border border-[rgba(0,180,216,0.15)] rounded-lg">
          <h2 className="text-sm font-display font-bold text-text-primary mb-1">Chat</h2>
          <p className="text-xs text-text-muted mb-6">Manage your local chat session.</p>

          <div className="flex items-center gap-3">
            <button
              onClick={clearChat}
              className="px-4 py-2 bg-bg-primary border border-[rgba(0,180,216,0.15)] rounded-lg text-sm text-text-primary hover:border-accent-cyan transition-colors"
            >
              Clear chat history
            </button>
            {chatMessage && <div className="text-xs text-text-muted">{chatMessage}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
