<script setup lang="ts">
import { computed, ref, nextTick } from 'vue';
import { marked } from 'marked';
import markedKatex from 'marked-katex-extension';

marked.use(markedKatex({ throwOnError: false, nonStandard: true }));

const response = ref('')
const question = ref('')
const loading = ref(false)
const error = ref('')
const selectedModel = ref('gemma4:31b')

const response_notes = ref({
    title: '',
    items: [] as Array<{ question: string; response: string }>
})

const chatWindow = ref<HTMLElement | null>(null)

const scrollToBottom = async function () {
    await nextTick()
    if (chatWindow.value) {
        chatWindow.value.scrollTop = chatWindow.value.scrollHeight
    }
}


const models = [
    { text: 'gemma4:31b', value: 'gemma4:31b' },
    { text: 'gpt-oss:120b', value: 'gpt-oss:120b' },
    { text: 'nemotron-3-ultra', value: 'nemotron-3-ultra' },
]

const formattedResponse = computed(() => {
    if (!response.value) return ''
    return marked.parse(response.value)
})

async function askCloud() {
    if (!question.value.trim() || loading.value) return
    loading.value = true
    error.value = '';
    response.value = ''
    await scrollToBottom()
    try {
        const res = await fetch('https://ollama-proxy.georgewakhu270.workers.dev/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: selectedModel.value,
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

        if (response_notes.value.title === '') {
            response_notes.value.title = question.value
        }
        response_notes.value.items.push({
            'question': question.value,
            'response': response.value
        })
        await scrollToBottom()
        question.value = ''
    } catch (err) {
        error.value = err instanceof Error ? err.message : 'Something went wrong';
    } finally {
        loading.value = false;
        await scrollToBottom()
    }
}

const autoresize = function (event: Event) {
    const textarea = event.target as HTMLTextAreaElement
    textarea.style.height = 'auto'
    textarea.style.height = textarea.scrollHeight + 'px';
}

</script>

<template>
    <div class="flex h-screen overflow-hidden bg-[#212121] text-[#ececec] font-sans antialised">
        <div class="w-[260px] bg-[#171717] flex flex-col p-2.5 border-r border-[#2f2f2f]">
            <button
                class="bg-transparent text-[#ececec] border border-[#565869] p-2.5 rounded-md text-left cursor-pointer mb-2.5 text-sm transition hover:bg-[#2f2f2f]">
                + New Chat
            </button>
            <div class="flex-1 overflow-y-auto text-[13px]">
                <div
                    class="p-2.5 rounded-md cursor-pointer text-[#b4b4b4] whitespace-nowrap overflow-hidden text-ellipsis mb-1 hover:bg-[#2a2b32] hover:text-[#ececec]">
                    Previous chat session
                </div>
            </div>
        </div>
        <div class="flex-1 flex flex-col justify-between h-full">
            <div class="flex-1 overflow-y-auto p-5 flex flex-col items-center" id="chatWindow">
                <div v-if="response_notes.items.length === 0 && !response"
                    class="w-full max-w-[768px] p-5 flex gap-5 leading-normal text-[15px] bg-[#2f2f2f] rounded-lg my-2.5">
                    <div
                        class="w-[30px] h-[30px] rounded-[2px] flex items-center justify-center font-bold text-xs shrink-0 bg-[#10a37f] text-white">
                        AI
                    </div>
                    <div class="flex-1 overflow-x-auto">Hello! How can I help you today</div>
                </div>
                <template v-for="(item, index) in response_notes.items" :key="index">
                    <div class="w-full max-w-[768px] m-4 flex justify-end">
                        <div
                            class="max-w-[70%] bg-[#383838] px-4 py-3 rounded-2xl shadow-sm text-[15px] leading-relaxed break-words">
                            {{ item.question }}
                        </div>
                    </div>
                    <div
                        class="w-full max-w-[768px] p-5 flex gap-5 leading-normal text-[15px] bg-[#2f2f2f] rounded-2xl shadow-sm border border-[#424242]">
                        <div
                            class="w-[30px] h-[30px] rounded-[2px] flex items-center justify-center font-bold text-xs shrink-0 bg-[#10a37f] text-white">
                            AI
                        </div>
                        <div class="flex-1 overflow-x-auto markdown-body text-[#ececec] leading-relaxed"
                            v-html="marked.parse(item.response)">
                        </div>
                        <div v-if="error"
                            class="w-full max-w-[768px] p-4 bg-red-950/40 border border-red-800 text-red-200 rounded-xl text-sm">
                            {{ error }}
                        </div>
                    </div>
                </template>
            </div>
            <div class="p-5 flex justify-center bg-gradient-to-t from-[#212121] via-[#212121]/80 to-transparent">
                <div
                    class="w-full max-w-[768px] bg-[#2f2f2f] rounded-xl p-2.5 px-3.5 flex items-end border border-[#424242]">
                    <form @submit.prevent="askCloud" class="w-full flex items-end">
                        <textarea v-model="question" :disabled="loading" name="userInput" id="Message my ai" rows="1"
                            placeholder="Message me..."
                            class="flex-1 bg-transparent border-none text-[#ececec] resize-none outline-none max-h-[200px] text-[15px] leading-normal pt-1.5 placeholder-[#7f7f7f] disabled:cursor-not-allowed"
                            @input="autoresize">
            </textarea>
                        <select id="modelselect" v-model="selectedModel"
                            class="bg-transparent text-[#ececec] text-xs border-none outline-none cursor-pointer self-center px-1 py-1.5">
                            <option v-for="option in models" :key="option.text" :value="option.value"
                                class="bg-transparent text-[#ececec]">
                                {{ option.text }}
                            </option>
                        </select>
                        <button id="sendBtn" type="submit"
                            class="bg-[#ececec] text-[#212121] border-none w-8 h-8 rounded-md cursor-pointer flex items-center justify-center font-bold transition hover:opacity-90 disabled:bg-[#424242] disabled:text-[#7f7f7f] disabled:cursor-not-allowed ml-2.5 shrink-0"
                            :disabled="loading || !question.trim()">
                            <svg v-if="loading" class="animate-spin h-4 w-4 text-[#212121]" fill="none"
                                viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                </path>
                            </svg>
                            <span v-else>&#8593;</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>

</template>

<style scoped>
.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3) {
    font-weight: 700;
    color: #ececec;
    margin-top: 1.5em;
    margin-bottom: 0.5em;
}

.markdown-body :deep(tr) {
    color: #ececec;
}

.markdown-body :deep(table) {
    border-collapse: collapse;
}

.markdown-body :deep(th),
.markdown-body :deep(td) {
    border: 1px solid #ececec;
    padding: 5px;
}

.markdown-body :deep(h2) {
    font-size: 1.25rem;
    border-bottom: 1px solid #f1f5f9;
    padding-bottom: .3rem;
}

.markdown-body :deep(p) {
    margin-bottom: 1rem;
    color: #ececec;
    color: #ececec;
}

.markdown-body :deep(ul) {
    list-style-type: disc;
    padding-left: 1.5rem;
    margin-bottom: 1rem;
    color: #ececec;
}

.markdown-body :deep(ol) {
    list-style-type: decimal;
    padding-left: 1.5rem;
    margin-bottom: 1rem;
    color: #ececec;
}

.markdown-body :deep(strong) {
    color: #ececec;
    font-weight: 600;
}

.markdown-body :deep(code) {
    color: #ececec;
    padding: 0.2rem 0.4rem;
    border-radius: 0.25rem;
    font-size: 0.875em;
    font-family: monospace;
}
</style>
