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
<script>
async function ocSend() {
  const input = document.getElementById("oc-input");
  const text = input.value.trim();
  if (!text) return;
  input.value = "";

  ocAdd("You: " + text);

  // 激活口令等逻辑如果需要，先执行...
  // （这里示例只展示普通对话走后端）
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "system", content: "You are Origin Core." }, { role: "user", content: text }]
      })
    });

    const data = await response.json();
    if (data.error) {
      ocAdd("Origin Core: Error - " + JSON.stringify(data.error));
      return;
    }

    const reply = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content
      ? data.choices[0].message.content
      : JSON.stringify(data);

    ocAdd("Origin Core: " + reply);
  } catch (e) {
    console.error(e);
    ocAdd("Origin Core: Network or server error.");
  }
}

function ocAdd(msg) {
  const box = document.getElementById("oc-messages");
  box.innerHTML += `<div>${msg}</div>`;
  box.scrollTop = box.scrollHeight;
}
</script>
