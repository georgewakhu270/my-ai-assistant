<script setup lang="ts">

const autoresize = function (event: Event) {
    const textarea = event.target as HTMLTextAreaElement
    textarea.style.height = 'auto'
    textarea.style.height = textarea.scrollHeight + 'px';
}

</script>

<template>
    <div class="body">
        <div class="sidebar">
            <button class="new-chat-btn">+ New Chat</button>
            <div class="chat-history">
                <div class="history-item">Previous chat session</div>
            </div>
        </div>
        <div class="main-container">
            <div class="chat-window" id="chatWindow">
                <div class="message assistant">
                    <div class="avatar">AI</div>
                    <div class="message-content">Hello! How can I help you today</div>
                </div>
            </div>
            <div class="input-container">
                <div class="input-box">
                    <textarea name="userInput" id="Message my ai" rows="1" @input="autoresize"></textarea>
                    <button class="send-btn" id="sendBtn">&#8593</button>
                </div>
            </div>
        </div>

    </div>
<!-- <div class="max-w-xl mx-auto my-12 px-4 font-sans text-slate-800">
        <h1 class="text2xl md:text-3xl font-bold text-slate-900 mb-6 tracking-tight">my response page</h1>
        <form @submit.prevent="askCloud" class="flex flex-col gap-4">
            <textarea v-model="question" rows="3" placeholder="Why is the sky blue?" :disabled="loading"
                class="w-full p-3.5 text-base text-slate-800 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all shadow-sm resize-y disabled:bg-slate-50 disabled:cursor-not-allowed font-inherit"></textarea>
            <div>
                <select id="modelselect" v-model="selectedModel">
                    <option v-for="option in models" :key="option.text" :value="option.value">
                        {{ option.text }}
                    </option>
                </select>
                <button type="submit" :disabled="loading || !question.trim()"
                    class="self-start px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-sm transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 flex items-center gap-2">
                    <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none"
                        viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                        </circle>
                        <path class="opacity-45" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                    </svg>
                    {{ loading ? 'Asking...' : 'Ask' }}
                </button>
            </div>
        </form>

        <div v-if="error" class="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">{{ error }}
        </div>

        <div v-if="response" class="mt-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 class="text-xs font-bold text-indigo-600 uppercase tracking-wider mb2">Response</h3>
            <div class="markdown-body text-slate-700 leading-relaxed" v-html="formattedResponse"></div>
        </div>

    </div> -->
</template>

<style scoped>
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.body {
    background: #212121;
    height: 100vh;
    color: #ececec;
    display: flex;
    overflow: hidden;
}

.sidebar {
    width: 260px;
    background: #171717;
    display: flex;
    flex-direction: column;
    padding: 10px;
    border-right: 1px solid #2f2f2f;
}

.new-chat-btn {
    background: transparent;
    color: #ececec;
    border: 1px solid #565869;
    padding: 10px;
    border-radius: 6px;
    text-align: left;
    cursor: pointer;
    margin-bottom: 10px;
    font-size: 14px;
    transition: background .2s;
}

.new-chat-btn:hover {
    background: #2f2f2f;
}

.history-item {
    padding: 10px;
    border-radius: 6px;
    cursor: pointer;
    color: #b4b4b4;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 4px;
}

.history-item:hover {
    background-color: #2a2b32;
    color: #ececec;
}

/* Main Chat Area */
.main-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
}

.chat-window {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.message {
    width: 100%;
    max-width: 768px;
    padding: 20px;
    display: flex;
    gap: 20px;
    line-height: 1.5;
    font-size: 15px;
}

.message.user {
    background-color: transparent;
}

.message.assistant {
    background-color: #2f2f2f;
    border-radius: 8px;
    margin: 10px 0;
}

.avatar {
    width: 30px;
    height: 30px;
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 12px;
    flex-shrink: 0;
}

.user .avatar {
    background-color: #5436da;
    color: white;
}

.assistant .avatar {
    background-color: #10a37f;
    color: white;
}

.message-content {
    flex: 1;
    overflow-x: auto;
}

/* Input Area */
.input-container {
    padding: 20px;
    display: flex;
    justify-content: center;
    background: linear-gradient(180deg, rgba(33, 33, 33, 0) 0%, rgba(33, 33, 33, 1) 50%);
}

.input-box {
    width: 100%;
    max-width: 768px;
    background-color: #2f2f2f;
    border-radius: 12px;
    padding: 10px 15px;
    display: flex;
    align-items: flex-end;
    border: 1px solid #424242;
}

.input-box textarea {
    flex: 1;
    background: transparent;
    border: none;
    color: #ececec;
    resize: none;
    outline: none;
    max-height: 200px;
    font-size: 15px;
    line-height: 1.5;
    padding-top: 5px;
}

.send-btn {
    background-color: #ececec;
    color: #212121;
    border: none;
    width: 32px;
    height: 32px;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    transition: opacity 0.2s;
    margin-left: 10px;
}

.send-btn:hover {
    opacity: 0.9;
}

.send-btn:disabled {
    background-color: #424242;
    color: #7f7f7f;
    cursor: not-allowed;
}
</style>