const ENDPOINT = ["localhost", "127.0.0.1"].includes(location.hostname)
  ? "http://localhost:8787/chat"
  : "https://portfolio-assistant.thanagorn.workers.dev/chat";
const MAX_QUESTIONS = 6;
const MAX_CHARS = 500;
const REQUEST_TIMEOUT_MS = 30000;

// Elements
const launcher = document.getElementById("assistant-launcher");
const dialog = document.getElementById("assistant");
const closeButton = document.getElementById("assistant-close");
const log = document.getElementById("assistant-log");
const empty = document.getElementById("assistant-empty");
const form = document.getElementById("assistant-form");
const input = document.getElementById("assistant-input");
const sendButton = document.getElementById("assistant-send");
const turns = document.getElementById("assistant-turns");
const count = document.getElementById("assistant-count");
const chips = document.querySelectorAll(".assistant-chip");

const history = [];
let pending = false;

function openPanel() {
  dialog.show();
  launcher.setAttribute("aria-expanded", "true");
  input.focus();
}

function closePanel() {
  dialog.close();
}

dialog.addEventListener("close", () => {
  launcher.setAttribute("aria-expanded", "false");
  launcher.focus();
});

launcher.addEventListener("click", () => {
  if (dialog.open) closePanel();
  else openPanel();
});

closeButton.addEventListener("click", closePanel);

dialog.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    event.preventDefault();
    closePanel();
  }
});

// Question Counters
function questionsAsked() {
  return history.filter((m) => m.role === "user").length;
}

function updateMeta() {
  count.textContent = `${input.value.length} / ${MAX_CHARS}`;

  const left = MAX_QUESTIONS - questionsAsked();
  const limitReached = left <= 0;
  turns.textContent = limitReached
    ? "Question limit reached. Refresh to start over."
    : `${left} of ${MAX_QUESTIONS} questions left`;

  input.disabled = limitReached;
  sendButton.disabled = pending || limitReached;
  for (const chip of chips) {
    chip.disabled = pending || limitReached;
  }
}

function addMessage(kind, text) {
  const message = document.createElement("p");
  message.className = `assistant-message assistant-message--${kind}`;
  message.textContent = text;
  log.append(message);
  log.scrollTop = log.scrollHeight;
  return message;
}

function isNearBottom() {
  return log.scrollHeight - log.scrollTop - log.clientHeight < 40;
}

function showTyping() {
  const typing = document.createElement("div");
  typing.className = "assistant-message assistant-message--bot assistant-typing";
  const label = document.createElement("span");
  label.className = "assistant-visually-hidden";
  label.textContent = "Assistant is typing";
  typing.append(label);

  for (let i = 0; i < 3; i++) {
    const dot = document.createElement("span");
    dot.className = "assistant-typing-dot";
    dot.setAttribute("aria-hidden", "true");
    typing.append(dot);
  }

  log.append(typing);
  log.scrollTop = log.scrollHeight;
  return typing;
}

function errorMessage(status, code, retryAfterSeconds) {
  if (code === "daily_limit") {
    return "You've reached today's question limit. Please try again later.";
  }
  if (status === 429 && retryAfterSeconds > 0) {
    const minutes = Math.ceil(retryAfterSeconds / 60);
    const unit = minutes === 1 ? "minute" : "minutes";
    return `Too many questions in a short time. Please try again in ${minutes} ${unit}.`;
  }

  switch (status) {
    case 413:
    case 400:
      return "That message couldn't be sent. Try a shorter question.";
    case 403:
      return "This chat only works on thanagorn.com.";
    case 429:
      return "You're sending messages too quickly. Please wait a moment.";
    case 503:
      return "The assistant is busy right now. Please try again later.";
    case 0:
      return "Couldn't reach the assistant. Check your connection and try again.";
    default:
      return "Something went wrong. Please try again.";
  }
}

class ChatError extends Error {}

async function* readEvents(response) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) return;
      buffer += decoder.decode(value, { stream: true });
      let end;
      while ((end = buffer.indexOf("\n\n")) !== -1) {
        const block = buffer.slice(0, end);
        buffer = buffer.slice(end + 2);
        const event = block.match(/^event: (.*)$/m)?.[1];
        const data = block.match(/^data: (.*)$/m)?.[1];
        if (event && data !== undefined) yield { event, data: JSON.parse(data) };
      }
    }
  } finally {
    reader.releaseLock();
  }
}

async function send(text) {
  const question = text.trim();
  if (!question || pending || questionsAsked() >= MAX_QUESTIONS) return;

  empty.hidden = true;
  addMessage("user", question);
  input.value = "";

  pending = true;
  log.setAttribute("aria-busy", "true");
  updateMeta();
  const typing = showTyping();
  let bubble = null;

  const messages = [...history, { role: "user", content: question }];
  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      const retryAfter = Number(response.headers.get("Retry-After"));
      throw new ChatError(
        errorMessage(response.status, data?.error, retryAfter),
      );
    }

    let reply = "";
    let completed = false;
    for await (const { event, data } of readEvents(response)) {
      if (event === "delta") {
        if (!bubble) {
          typing.remove();
          bubble = addMessage("bot", "");
        }
        const follow = isNearBottom();
        reply += data.text;
        bubble.textContent = reply;
        if (follow) log.scrollTop = log.scrollHeight;
      } else if (event === "done") {
        completed = true;
      } else if (event === "error") {
        const status = data.error === "temporarily_unavailable" ? 503 : 502;
        throw new ChatError(errorMessage(status, data.error));
      }
    }
    if (!completed) throw new ChatError(errorMessage(502));

    history.push(
      { role: "user", content: question },
      { role: "assistant", content: reply },
    );
  } catch (err) {
    typing.remove();
    bubble?.remove();
    addMessage(
      "error",
      err instanceof ChatError ? err.message : errorMessage(0),
    );
    input.value = question;
  } finally {
    pending = false;
    log.removeAttribute("aria-busy");
    updateMeta();
    if (!input.disabled) input.focus();
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  send(input.value);
});

input.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" || event.shiftKey) return;
  if (event.isComposing || event.keyCode === 229) return;
  event.preventDefault();
  form.requestSubmit();
});

input.addEventListener("input", updateMeta);

for (const chip of chips) {
  chip.addEventListener("click", () => send(chip.textContent));
}

updateMeta();