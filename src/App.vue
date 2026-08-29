<script setup lang="ts">
import { ref } from 'vue';
import MyResponse from './components/MyResponse.vue'
import TestUI from './components/TestUI.vue';

const sel_item = ref('ai')

const changeSelItem = (item: string) => {
  sel_item.value = item;
};

</script>

<template>
  <div><button @click="changeSelItem('ai')">AI</button>
  <button @click="changeSelItem('test ui')">Test UI</button></div>
  <div v-if="sel_item === 'ai'">
    <MyResponse />
  </div>
  <div v-else-if="sel_item === 'test ui'">
    <TestUI />
  </div>
</template>
