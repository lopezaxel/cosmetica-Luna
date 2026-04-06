module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const expireTime = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 min

    const r = await fetch('https://generativelanguage.googleapis.com/v1beta/authTokens', {
      method: 'POST',
      headers: {
        'x-goog-api-key': process.env.GEMINI_API_KEY,
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
    if (!r.ok) return res.status(500).json({ error: data.error?.message || 'Error generando token' });
    res.json({ token: data.name });

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
