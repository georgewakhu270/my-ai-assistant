<script setup lang="ts">
import { ref } from 'vue';
import MyResponse from './components/MyResponse.vue'
import TestUI from './components/TestUI.vue';

const sel_item = ref('test ui')

const changeSelItem = (item: string) => {
  sel_item.value = item;
};

</script>

<template>
  <div class="flex items-center justify-center bg-blue-500 text-white p-4">Hello world</div>
  <div><button @click="changeSelItem('ai')">AI</button>
  <button @click="changeSelItem('test ui')">Test UI</button></div>
  <div v-if="sel_item === 'ai'">
    <MyResponse />
  </div>
  <div v-else-if="sel_item === 'test ui'">
    <TestUI />
  </div>
</template>
