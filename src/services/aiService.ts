/**
 * NerveSynapse — AI service registry.
 * v0.0.1: only mock is registered. v0.0.2+ will plug real providers here.
 */
import type {AIService} from '../types';
import {mockAIService} from './mockAIService';

export type AIProviderId = 'mock' | 'openai' | 'gemini' | 'anthropic';

const providers: Record<AIProviderId, AIService> = {
  mock: mockAIService,
  openai: mockAIService, // placeholder until v0.0.2
  gemini: mockAIService, // placeholder until v0.0.2
  anthropic: mockAIService, // placeholder until v0.0.2
};

let current: AIProviderId = 'mock';

export function getAIService(): AIService {
  return providers[current];
}

export function setAIProvider(id: AIProviderId) {
  current = id;
}

export function listProviders(): Array<{id: AIProviderId; name: string}> {
  return [
    {id: 'mock', name: 'Mock (offline)'},
    {id: 'openai', name: 'OpenAI (soon)'},
    {id: 'gemini', name: 'Gemini (soon)'},
    {id: 'anthropic', name: 'Anthropic (soon)'},
  ];
}
