/**
 * NerveSynapse — No-op sync adapter for v0.0.1.
 * Local-only. Future versions will swap this with Firebase/Supabase adapters
 * implementing the same SyncAdapter interface.
 */
import type {SyncAdapter, Conversation, ChatMessage} from '../types';

export const localOnlySync: SyncAdapter = {
  name: 'Local only',
  async push(_convos: Conversation[], _msgs: ChatMessage[]): Promise<void> {
    // no-op
  },
  async pull(): Promise<{conversations: Conversation[]; messages: ChatMessage[]}> {
    return {conversations: [], messages: []};
  },
};

export function getSyncAdapter(): SyncAdapter {
  return localOnlySync;
}
