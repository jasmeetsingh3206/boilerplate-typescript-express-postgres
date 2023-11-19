<template>
  <div class="p-4">
    <h1 class="text-center mb-4">SuperLogger</h1>
    <div class="w-full flex flex-col">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-2 gap-x-4">
        <div>
          <div class="flex justify-between items-center">
            <label
              for="with-corner-hint"
              class="block text-sm font-medium mb-2 dark:text-white"
              >Message</label
            >
            <span class="block text-sm text-gray-500 mb-2">Optional</span>
          </div>
          <input
            type="text"
            id="with-corner-hint"
            class="py-3 px-4 block w-full border-gray-600 ring-1 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
            placeholder="search message field"
            v-model="message"
          />
        </div>


        <div>
          <div class="flex justify-between items-center">
            <label
              for="with-corner-hint"
              class="block text-sm font-medium mb-2 dark:text-white"
              >Resource Id</label
            >
            <span class="block text-sm text-gray-500 mb-2">Optional</span>
          </div>
          <input
            type="text"
            id="with-corner-hint"
            class="py-3 px-4 block w-full border-gray-600 ring-1 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
            placeholder="Enter exact resource Id"
            v-model="resourceId"
          />
        </div>
      </div>
      

      <DxDateRangeBox class="mx-auto" :show-clear-button="true" />
    </div>
    <button @click="console.log(message)">clickme</button>

    <DxDataGrid
      :data-source="result"
      :allow-column-reordering="true"
      :row-alternation-enabled="true"
      :show-borders="true"
      :width="'100%'"
    >
      <DxSearchPanel :visible="true" :highlight-case-sensitive="true" />
      <DxColumn data-field="level_id"></DxColumn>
      <DxColumn data-field="message"></DxColumn>
      <DxColumn data-field="resourceid"></DxColumn>
      <DxColumn data-field="metadata.parentResourceId" Content-Type="json"></DxColumn>
      <DxColumn data-field="timestamp"></DxColumn>
      <DxColumn data-field="traceid"></DxColumn>
      <DxColumn data-field="spanid"></DxColumn>
      <DxColumn data-field="commit"></DxColumn>
    </DxDataGrid>
  </div>

  <!-- <RouterView /> -->
</template>

<script setup lang="ts">
import DxButton from "devextreme-vue/button";
import {
  DxDataGrid,
  DxColumn,
  DxGrouping,
  DxGroupPanel,
  DxPager,
  DxPaging,
  DxSearchPanel,
} from "devextreme-vue/data-grid";
import { onMounted, ref } from "vue";
import DxDateRangeBox from "devextreme-vue/date-range-box";
import BaseInput from "./components/InputBox.vue";

const result = ref([]);
const level = ref("");
const message = ref("");
const resourceId = ref("");
const timestampfrom = ref("");
const timestampto = ref("");
async function searchLogs() {
  // Add other filter values as needed
  const object = {
    level: level.value,
    message: message.value,
    resourceId: resourceId.value,
    startTime: timestampfrom.value,
    endTime: timestampto.value,
  };
  console.log(object);
  const response = await fetch("http://localhost:3000/queryData", {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(object),
  });

  const resp1 = await response.json();
  console.log(resp1);
  result.value = resp1.result;
}

onMounted(() => {
  searchLogs();
});
</script>

<style scoped></style>
