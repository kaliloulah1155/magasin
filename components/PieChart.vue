<template>
  <apexchart class="w-75 h-100" type="pie" :options="chartOptions" :series="series"></apexchart>
</template>

<script setup>
const chartOptions = {
  chart: {
    width: 200,
  },
  labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 200,
        },
        legend: {
          position: "bottom",
        },
      },
    },
  ],
};

const series = [44, 55, 13, 43, 22];

</script>
