/**
 * NerveSynapse — Mock AI service.
 * Generates plausible canned replies so the UI is usable in v0.0.1
 * without an API key. Implements the AIService interface so it can be
 * swapped with a real LLM-backed service in a future release.
 */
import type {AIService, ChatMessage} from '../types';

const REPLIES = [
  "That's an interesting question. Let me think about it for a moment. Based on what you've shared, I'd say there are a few angles worth considering, and the right answer depends on the context you have in mind. Could you tell me more about the outcome you're hoping for?",
  'Here are a few thoughts on that:\n\n1. **Start with the goal in mind** — knowing the end state helps you reverse-engineer the steps.\n2. **Break it down** — any big problem shrinks once sliced into smaller, testable pieces.\n3. **Iterate fast** — ship a rough version, gather feedback, then refine.\n\nWould you like me to expand on any of these?',
  "Great prompt! In short: yes, this is achievable. The main trade-off is between simplicity and flexibility. A simpler approach ships faster but locks you into early decisions; a more flexible design takes longer to build but adapts better to future changes. For an early-stage project, I'd lean toward the simpler path and refactor later when you have real usage data.",
  'Mock reply from NerveSynapse v0.0.1.\n\nThis is a placeholder response from the bundled mock AI. In a future release, this will be replaced with a real model — OpenAI, Gemini, Anthropic, or local. The interface (`AIService`) is already in place, so swapping is a one-line change.',
  "I hear you. Here's how I'd approach it:\n\n```\n1. Define the problem clearly\n2. List 3 possible solutions\n3. Pick the simplest that meets today's needs\n4. Ship it, measure, iterate\n```\n\nThe biggest trap is over-engineering before you have users. What's the smallest version you could ship this week?",
];

const TITLES = [
  'New conversation',
  'Quick chat',
  'Idea session',
  'Brainstorm',
  'Helpful thread',
];

export class MockAIService implements AIService {
  readonly name = 'mock';
  private latencyMs: number;

  constructor(latencyMs = 750) {
    this.latencyMs = latencyMs;
  }

  setLatency(ms: number) {
    this.latencyMs = ms;
  }

  async generateReply(
    history: ChatMessage[],
    signal?: AbortSignal,
  ): Promise<string> {
    // Sleep with abort support
    await new Promise<void>((resolve, reject) => {
      const t = setTimeout(resolve, this.latencyMs);
      if (signal) {
        signal.addEventListener('abort', () => {
          clearTimeout(t);
          reject(new DOMException('Aborted', 'AbortError'));
        });
      }
    });

    const lastUser = [...history].reverse().find(m => m.role === 'user');
    const content = lastUser?.content ?? '';

    // Light keyword-based responses for a tiny bit of realism
    if (/hello|hi|hey/i.test(content)) {
      return "Hi! I'm NerveSynapse's mock assistant. I can't really think yet — this is v0.0.1 — but the chat UI is fully functional. Ask me anything and I'll return a canned reply.";
    }
    if (/who are you|what are you/i.test(content)) {
      return "I'm **NerveSynapse** v0.0.1, a cross-platform AI chat app running on Android and Windows. Right now I'm powered by a mock AI service; a real LLM will be plugged in soon.";
    }
    if (/help/i.test(content)) {
      return "Here's what you can do right now:\n\n- **New chat** from the sidebar\n- **Edit** any of your previous messages (tap and hold)\n- **Regenerate** my reply (long-press my message)\n- **Copy** any AI message\n- Toggle **light/dark** in Settings\n- Your chats persist locally on this device";
    }

    const idx = Math.floor(Math.random() * REPLIES.length);
    return REPLIES[idx];
  }

  async suggestTitle(firstUserMessage: string): Promise<string> {
    const trimmed = firstUserMessage.trim();
    if (!trimmed) {
      return TITLES[0];
    }
    // Take first ~5 words
    const words = trimmed.split(/\s+/).slice(0, 5).join(' ');
    // Capitalize first letter
    return words.charAt(0).toUpperCase() + words.slice(1);
  }
}

// Singleton instance used by the app
export const mockAIService = new MockAIService();
