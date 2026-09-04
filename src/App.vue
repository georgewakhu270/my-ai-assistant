<script setup lang="ts">
import { ref } from 'vue';
import MyResponse from './components/MyResponse.vue'
import TestUI from './components/TestUI.vue';
import Summary from './components/Summary.vue';

const sel_item = ref('summary');

const changeSelItem = (item: string) => {
  sel_item.value = item;
};

</script>

<template>
  <div>
    <button @click="changeSelItem('ai')">AI</button>
    <button @click="changeSelItem('test ui')">Test UI</button>
    <button @click="changeSelItem('summary')">Summary</button>
  </div>
  <div v-if="sel_item === 'ai'">
    <MyResponse />
  </div>
  <div v-else-if="sel_item === 'test ui'">
    <TestUI />
  </div>
  <div v-else-if="sel_item === 'summary'">
    <Summary/>
  </div>
</template>
