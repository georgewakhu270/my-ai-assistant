const ALLOWED_ORIGINS = [
  'https://georgewakhu270.github.io',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:8080',
  'http://127.0.0.1:8080',
];

export default {
    async fetch(request, env) {
        const origin = request.headers.get('Origin');
        const headers = corsHeaders(origin);

        if (request.method === "OPTIONS") {
            return new Response(null, 
                {
                    headers
                }
            )
        } try{
            const body = await request.text()

            const upstream = await fetch(
                'https://ollama.com/api/chat',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${env.OLLAMA_API_KEY}`,
                    },
                    body,
                })

            const data = await upstream.text()

            return new Response(data, {
                status: upstream.status,
                headers: {'Content-Type': 'application/json', ...headers},
            })
        } catch (err) {
            return new Response(JSON.stringify({error: err.message}), {
                status: 500,
                headers: {'Content-Type': 'application/json', ...headers},
            })
        }
    }
}

function corsHeaders(origin) {
    return {
        'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Vary': 'Origin',
    }
}