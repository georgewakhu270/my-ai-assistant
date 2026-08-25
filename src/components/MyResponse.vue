<script setup lang="ts">
import { ref } from 'vue';


const response = ref('')

// async function askCloud() {
//     const res = await fetch('https://ollama.com/api/chat', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': 'Bearer api-key'
//         },body: JSON.stringify({
//             model: 'llama3.1:70b',
//             messages: [{role: 'user', content: 'Why is the sky blue'}],
//             stream: false
//         })
//     })
//     const data = await res.json()
//     response.value = data.message.content
// }

// askCloud()

</script>

<template>
    <h1>my response page</h1>
    <p>{{ response }}</p>
</template>