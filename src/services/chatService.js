const AI_TOKEN = import.meta.env.VITE_AI_TOKEN;
const MODEL_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2";

export const generateChatResponse = async (messages, contextStr) => {
  if (!AI_TOKEN || AI_TOKEN.includes('your_huggingface_token')) {
    throw new Error('Hugging Face AI Token is missing or invalid.');
  }

  const systemInstruction = `Answer only from the provided dashboard context. If the answer is not present in the context, say: 'I can only answer based on the ISS and news data currently loaded in this dashboard.'

DASHBOARD CONTEXT:
${contextStr}
`;

  // Format history for Mistral-Instruct
  let prompt = `<s>[INST] ${systemInstruction} [/INST] Understood.</s>\\n`;
  
  messages.forEach(msg => {
    if (msg.role === 'user') {
      prompt += `[INST] ${msg.content} [/INST]`;
    } else {
      prompt += `${msg.content}</s>\\n`;
    }
  });

  try {
    const response = await fetch(MODEL_URL, {
      headers: {
        Authorization: `Bearer ${AI_TOKEN}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 150,
          temperature: 0.1, // Keep it focused on provided context
          return_full_text: false,
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    return data[0]?.generated_text?.trim() || "I couldn't generate a response.";
  } catch (error) {
    console.error("Chat API Error:", error);
    throw error;
  }
};
