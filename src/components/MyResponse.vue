<script setup lang="ts">
import { computed, ref } from 'vue';
import { marked } from 'marked';

const response = ref('')
const question = ref('')
const loading = ref(false)
const error = ref('')

const formattedResponse  = computed(() => {
    if (!response.value) return ''
    return marked.parse(response.value)
})

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
    <div class="max-w-xl mx-auto my-12 px-4 font-sans text-slate-800">
        <h1 class="text2xl md:text-3xl font-bold text-slate-900 mb-6 tracking-tight">my response page</h1>
    <!-- <p>{{ response }}</p> -->
    <form @submit.prevent="askCloud" class="flex flex-col gap-4">
        <textarea 
        v-model="question"
        rows="3"
        placeholder="Why is the sky blue?"
        :disabled="loading"
        class="w-full p-3.5 text-base text-slate-800 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all shadow-sm resize-y disabled:bg-slate-50 disabled:cursor-not-allowed font-inherit"
        ></textarea>
        <button 
            type="submit" 
            :disabled="loading || !question.trim()"
            class="self-start px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-sm transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 flex items-center gap-2">
            <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25"  cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-45" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? 'Asking...' : 'Ask' }}
        </button>
    </form>
    
    <div v-if="error" class="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">{{ error }}</div>
    
    <div v-if="response" class="mt-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 class="text-xs font-bold text-indigo-600 uppercase tracking-wider mb2">Response</h3>
        <!-- <p class="whitespace-pre-wrap leading-relaxed text-slate-700 text-base">
            {{ response }}
        </p> -->
        <div class="markdown-body text-slate-700 leading-relaxed" v-html="formattedResponse"></div>
    </div>
    
</div>

</template>

<style scoped>

.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3) {
    font-weight: 700;
    color: #0f172a;
    margin-top: 1.5em;
    margin-bottom: 0.5em;
}

.markdown-body :deep(h2) {
    font-size: 1.25rem;
    border-bottom: 1px solid #f1f5f9;
    padding-bottom: .3rem;
}

.markdown-body :deep(p) {
    margin-bottom: 1rem;
}

.markdown-body :deep(ul) {
    list-style-type: disc;
    padding-left: 1.5rem;
    margin-bottom: 1rem;
}

.markdown-body :deep(ol) {
    list-style-type: decimal;
    padding-left: 1.5rem;
    margin-bottom: 1rem;
}

.markdown-body :deep(strong) {
    color: #0f172a;
    font-weight: 600;
}

.markdown-body :deep(code) {
    background-color: #f1f5f9;
    padding: 0.2rem 0.4rem;
    border-radius: 0.25rem;
    font-size: 0.875em;
    font-family: monospace;
}

</style>
