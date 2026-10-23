export default async function handler(req, res) {
  const { path } = req.query;

  if (!path) {
    return res.status(400).json({ error: 'Parameter path diperlukan' });
  }

  // Mengambil langsung dari environment variable yang diset di Netlify
  const repo = 'zahrulmo01-gif/dongflix2.0';
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    return res.status(500).json({ error: 'GITHUB_TOKEN belum diatur di Netlify' });
  }

  const targetFile = `donghua/${path}`;
  const ghUrl = `https://api.github.com/repos/${repo}/contents/${targetFile}?ref=main&t=${Date.now()}`;

  try {
    const response = await fetch(ghUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3.raw',
        'User-Agent': 'Dongflix-Proxy'
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'File tidak ditemukan di GitHub' });
    }

    const data = await response.json();

    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
