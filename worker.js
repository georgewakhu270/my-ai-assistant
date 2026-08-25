export default {
    async fetch(request, env) {
        if (request.method === "OPTIONS") {
            return new Response(null, 
                {
                    headers: corsHeaders()
                }
            )
        }
        const body = await request.text()

        const upstream = await fetch(
            'https://ollama.com/api/chat',
            {
                method: 'POST',
                header: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${env.OLLAMA_API_KEY}`,
                },
                body,
            })

        const data = await upstream.text()

        return new Response(data, {
            status: upstream.status,
            headers: {'Content-Type': 'application/json', ...corsHeaders()},
        })
    }
}

function corsHeaders() {
    return {
        'Access-Control-Allow-Origin': 'https://georgewakhu270.github.io',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }
}