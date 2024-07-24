
<template>
   
  <apexchart class="w-25 h-100" type="bar" :options="chartOptions" :series="series"></apexchart>
</template>

<script setup>

import { defineProps } from 'vue';
const props = defineProps({
  data: {
    type: Array,
    required: true,
  }
});

const chartOptions = {
  chart: {
    id: 'bar-example',
  },
  xaxis: {
    categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
  },
};
const series = [
  {
    name: 'series-1',
    data: [30, 40, 35, 50, 49, 60, 70, 91],
  },
];
</script>

