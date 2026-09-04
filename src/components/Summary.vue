<script setup lang="ts">
import { ref } from 'vue';


const inptext = ref('');
const sumtext = ref('');
const sentcount = ref(3);
const sentcountinp = ref()

const summarizeText = function () {
    if (!inptext.value.trim()) return;
    const sentences = `${inptext.value} the sentence count for it is: ${sentcountinp.value}`
        .replace(/([.?!])\s*(?=[A-Z])/g, "$1|")
        .split("|")
        .map(s => s.trim())
        .filter(s => s.length > 0);

    if (Number.isFinite(sentcountinp.value)) {
        sentcount.value = sentcountinp.value;
    }

    if (sentences.length < sentcount.value) {
        sumtext.value = inptext.value;
        return
    }

    // stopword removal
    const stopWords = new Set(['the', 'is', 'at', 'which', 'and', 'a', 'an', 'in', 'to', 'of', 'it', 'for', 'on', 'with', 'as', 'this', 'that', 'by'])
    const wordFreq: Record<string, number> = {}

    sentences.forEach(sentence => {
        const words = sentence.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
        words.forEach(word => {
            if (word && !stopWords.has(word)) {
                wordFreq[word] = (wordFreq[word] || 0) + 1;
            }
        })
    });

    const sentenceScores = sentences.map((sentence, index) => {
        const words = sentence.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
        let score = 0;
        words.forEach(word => {
            if (wordFreq[word]) {
                score += wordFreq[word];
            }
        })
        return { sentence, score: score / (words.length || 1), index };
    })

    const topSentences = [...sentenceScores]
        .sort((a, b) => b.score - a.score)
        .slice(0, sentcount.value)
        .sort((a, b) => a.index - b.index)

    sumtext.value = topSentences.map(s => s.sentence).join(' ');
}

</script>

<template>
    <div>
        <form action="" @submit.prevent="summarizeText">
            <input type="number" v-model="sentcountinp" placeholder="sentence count">
            <textarea placeholder="Enter text to summarize..." v-model="inptext"></textarea>
            <button type="submit">Summarize</button>
        </form>
        <div>{{ sumtext }}</div>
    </div>
</template>
