// --- Gemini API Configuration ---
const apiKey = ""; // Per instructions, leave empty string.
const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

/**
 * Calls the Gemini API with exponential backoff.
 * @param {object} payload - The payload to send to the API.
 * @param {number} maxRetries - Maximum number of retries.
 * @returns {Promise<object>} - The API response.
 */
async function callGeminiAPI(payload, maxRetries = 3) {
  let attempt = 0;
  let delay = 1000; // Start with 1 second

  while (attempt < maxRetries) {
    try {
      const response = await fetch(geminiApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        // Don't retry on bad requests (4xx), only server errors (5xx) or rate limits (429)
        if (
          response.status >= 400 &&
          response.status < 500 &&
          response.status !== 429
        ) {
          console.error(
            `Gemini API request failed with status ${response.status}:`,
            await response.text()
          );
          throw new Error(`APIError: ${response.status}`);
        }
        // Otherwise, it's a server error or rate limit, so retry
        throw new Error(`RetryableError: ${response.status}`);
      }

      const result = await response.json();

      if (
        result.candidates &&
        result.candidates.length > 0 &&
        result.candidates[0].content &&
        result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0
      ) {
        return result; // Success
      } else {
        // Valid response but no content, treat as an error to be safe
        console.error("Gemini API returned no content:", result);
        throw new Error("No content from API");
      }
    } catch (error) {
      if (error.message.startsWith("APIError")) {
        // Non-retryable client error
        throw error;
      }
      attempt++;
      if (attempt >= maxRetries) {
        console.error("Gemini API call failed after max retries:", error);
        throw error; // Throw error after max retries
      }
      console.warn(
        `Gemini API call failed, retrying in ${
          delay / 1000
        }s... (Attempt ${attempt})`
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
  }
}

export async function getStructuredQuery(message) {
  const systemPrompt = `You are an expert e-commerce search assistant. Analyze the user's request and extract the following search criteria. All properties are optional; if a criterion is not mentioned, set its value to null. 
      
Available categories: 'dress', 'jeans', 'blazer', 'shoes'
Available styles: 'formal', 'casual'
Available colors: 'blue', 'gray', 'yellow', 'red'
Available occasions: 'wedding', 'summer'`;

  const payload = {
    contents: [{ parts: [{ text: message }] }],
    systemInstruction: {
      parts: [{ text: systemPrompt }],
    },
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          category: { type: "STRING", nullable: true },
          style: { type: "STRING", nullable: true },
          color: { type: "STRING", nullable: true },
          occasion: { type: "STRING", nullable: true },
        },
      },
    },
  };

  console.log("Asking Gemini for structured query...");
  const result = await callGeminiAPI(payload);
  const jsonText = result.candidates[0].content.parts[0].text;
  console.log("Gemini returned query:", jsonText);
  return JSON.parse(jsonText);
}

export async function getStylingAdvice(productName) {
  const userPrompt = `I'm interested in the "${productName}". Give me 2-3 short, fashionable styling tips for a complete outfit. Mention other types of items or accessories that would pair well. Keep the tone helpful and chic.`;
  const payload = { contents: [{ parts: [{ text: userPrompt }] }] };
  console.log("Asking Gemini for styling advice...");
  const result = await callGeminiAPI(payload);
  return result.candidates[0].content.parts[0].text;
}
