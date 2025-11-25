// api/chat.js
export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { messages } = req.body;
    if (!messages) return res.status(400).json({ error: "Missing messages" });

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1",
        messages
      })
    });

    const data = await openaiRes.json();

    // 如果 OpenAI 返回错误，直接透传
    if (!openaiRes.ok) {
      return res.status(openaiRes.status).json({ error: data });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("api/chat error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}