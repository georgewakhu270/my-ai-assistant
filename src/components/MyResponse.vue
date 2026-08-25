<script setup lang="ts">
import { ref } from 'vue';


const response = ref('')

async function askCloud() {
    const res = await fetch('https://ollama-proxy.georgewakhu270.workers.dev/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },body: JSON.stringify({
            model: 'gemma4:31b',
            messages: [{role: 'user', content: 'Why is the sky blue'}],
            stream: false
        })
    })
    const data = await res.json()
    response.value = data.message.content
}

askCloud()

</script>

<template>
    <h1>my response page</h1>
    <p>{{ response }}</p>
</template>