exports.handler = async function (event, context) {
  // Ambil query parameter (?path=...)
  const path = event.queryStringParameters?.path;

  if (!path) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Parameter path diperlukan' })
    };
  }

  const repo = process.env.GITHUB_REPO || 'zahrulmo01-gif/dongflix2.0';
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'GITHUB_TOKEN belum diatur di Netlify' })
    };
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
      return {
        statusCode: response.status,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'File tidak ditemukan di GitHub' })
      };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message })
    };
  }
};
