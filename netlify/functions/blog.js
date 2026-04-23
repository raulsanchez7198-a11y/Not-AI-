exports.handler = async function(event, context) {
  const TOKEN = 'pat1jaooZOoesUYnP.942ab0709d280da2edcd620ea4639285265432566f1fe9c066aef8cb4c73e322';
  const BASE = 'appdP8BxTKmWcFGfm';
  const TABLE = 'Blog';

  let records = [];
  let offset = null;

  try {
    do {
      const url = new URL(`https://api.airtable.com/v0/${BASE}/${TABLE}`);
      url.searchParams.set('pageSize', '100');
      if (offset) url.searchParams.set('offset', offset);

      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${TOKEN}` }
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      records = records.concat(data.records || []);
      offset = data.offset || null;
    } while (offset);

    const published = records.filter(r => r.fields?.Publicado);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(published)
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: e.message })
    };
  }
};
