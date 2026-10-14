// Vercel serverless function: GET /api/turn-credentials
// Returns short-lived TURN credentials from Metered (free tier works).
// Set these in Vercel -> Project -> Settings -> Environment Variables:
//   METERED_DOMAIN   e.g. yourapp.metered.live
//   METERED_API_KEY  your Metered API key
module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  const domain = process.env.METERED_DOMAIN;
  const key = process.env.METERED_API_KEY;
  if (!domain || !key) {
    res.status(503).json({ error: 'TURN is not configured on this deployment' });
    return;
  }
  try {
    const r = await fetch(`https://${domain}/api/v1/turn/credentials?apiKey=${encodeURIComponent(key)}`);
    if (!r.ok) throw new Error('Provider returned ' + r.status);
    const iceServers = await r.json();
    res.status(200).json({ iceServers });
  } catch (e) {
    res.status(502).json({ error: String(e.message || e) });
  }
};
