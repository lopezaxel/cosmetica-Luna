module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY no configurada en Vercel' });
  }

  try {
    const expireTime = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    const r = await fetch('https://generativelanguage.googleapis.com/v1beta/authTokens', {
      method: 'POST',
      headers: {
        'x-goog-api-key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        config: {
          uses: 1,
          expireTime: expireTime,
          liveConnectConstraints: {
            model: 'models/gemini-3.1-flash-live-preview'
          }
        }
      })
    });

    const data = await r.json();

    if (!r.ok) {
      return res.status(500).json({
        error: `Google respondió ${r.status}: ${data.error?.message || JSON.stringify(data)}`
      });
    }

    res.json({ token: data.name });

  } catch (e) {
    res.status(500).json({ error: 'Excepción: ' + e.message });
  }
};
