export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface GenerateRequest {
  system: string;
  messages: ChatMessage[];
  maxOutputTokens: number;
  temperature: number;
}

export interface GenerateResult {
  text: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
}

export interface LLMProvider {
  readonly name: string;
  generate(request: GenerateRequest): Promise<GenerateResult>;
}

export class ProviderError extends Error {
  readonly status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ProviderError";
    this.status = status;
  }
}
