<script setup lang="ts">
import { ref } from 'vue';

const response = ref('')
const question = ref('')
const loading = ref(false)
const error = ref('')

async function askCloud() {
    if (!question.value.trim() || loading.value) return 
    loading.value = true
    error.value = '';
    response.value = ''

    try {
        const res = await fetch('https://ollama-proxy.georgewakhu270.workers.dev/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gemma4:31b',
                messages: [{ role: 'user', content: question.value }],
                stream: false
            })
        });

        if (!res.ok) {
            const detail = await res.text().catch(() => '');
            throw new Error(detail || `HTTP error! status: (${res.status})`);
        }

        const data = await res.json();
        response.value = data.message.content;
    } catch (err) {
        error.value = err instanceof Error ? err.message : 'Something went wrong';
    } finally {
        loading.value = false;
    }
}

</script>

<template>
    <div class="page">
        <h1>my response page</h1>
    <!-- <p>{{ response }}</p> -->
    <form @submit.prevent="askCloud">
        <textarea 
        v-model="question"
        rows="3"
        placeholder="Why is the sky blue?"
        :disabled="loading"
        ></textarea>
        <button type="submit" :disabled="loading || !question.trim()">
            {{ loading ? 'Asking...' : 'Ask' }}
        </button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="response" class="response">{{ response }}</p>
    </div>

</template>

<style scoped>
.page {
    max-width: 600px;
    margin: 40px auto;
    font-family: sans-serif;
    padding: 0 16px;
}

form{
    display: flex;
    flex-direction: column;
    gap: 10px;
}

textarea {
    padding: 10px;
    font-size: 15px;
    font-family: inherit;
    resize: vertical;
}

button {
  align-self: flex-start;
  padding: 8px 18px;
  cursor: pointer;
}
button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.error {
  color: #c0392b;
}

.response {
  white-space: pre-wrap;
  margin-top: 20px;
  line-height: 1.6;
}

</style>
