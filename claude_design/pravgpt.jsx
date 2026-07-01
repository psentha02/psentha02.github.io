// Shared PravGPT chatbot logic — used by all three variations.
// Provides: usePravGPT() hook returning { messages, sending, send, reset }

const PRAVGPT_SYSTEM_PROMPT = `You are PravGPT, an AI assistant embedded on Praveen Sentha's personal portfolio website. Your job is to answer visitors' questions about Praveen, his work, his projects, and his background.

Tone: casual but polite, informative, concise. Speak in first person ABOUT Praveen (i.e. "Praveen built…" or "He works at Qualcomm…"), never as Praveen. Use plain prose — no markdown headings, no bullet lists unless the visitor explicitly asks for a list. Keep replies under 4 short sentences unless asked for detail.

If asked something not covered by the data below, say you don't have that info and suggest reaching out via the contact card. Don't make things up.

=== DATA ABOUT PRAVEEN ===
${JSON.stringify(window.PORTFOLIO_DATA, null, 2)}
`;

window.usePravGPT = function usePravGPT() {
  const [messages, setMessages] = React.useState([]);
  const [sending, setSending] = React.useState(false);

  const send = React.useCallback(async (userText) => {
    if (!userText || sending) return;
    const trimmed = userText.trim();
    if (!trimmed) return;

    const userMsg = { role: 'user', content: trimmed };
    const placeholder = { role: 'assistant', content: '', pending: true };
    setMessages((m) => [...m, userMsg, placeholder]);
    setSending(true);

    try {
      const history = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));
      const reply = await window.claude.complete({
        messages: [
          { role: 'user', content: PRAVGPT_SYSTEM_PROMPT },
          { role: 'assistant', content: "Got it — I'll answer questions about Praveen using only that info, in a casual but polite tone, in first person about him." },
          ...history,
        ],
      });
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = { role: 'assistant', content: reply || "Hmm, I didn't get a response. Try again?" };
        return copy;
      });
    } catch (err) {
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = {
          role: 'assistant',
          content: "Sorry — I hit a snag reaching the model. Try again in a sec, or shoot Praveen an email at praveen.sentha@gmail.com.",
        };
        return copy;
      });
    } finally {
      setSending(false);
    }
  }, [messages, sending]);

  const reset = React.useCallback(() => setMessages([]), []);

  return { messages, sending, send, reset };
};
