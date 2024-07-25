<template>
  <apexchart type="donut" :options="chartOptions" :series="series"></apexchart>
</template>

<script setup>
const chartOptions = {
  chart: {
    type: "donut",
    width: "100", // Pour s'assurer que le graphique occupe la largeur du conteneur
    height: "100", // Ajustez la hauteur en fonction de vos besoins
  },
  labels: [
    'Apple', 'Mango', 'Orange', 'Watermelon', 'Watermelon',
'Pomme', 'Mangue', 'Mandarine', 'Banane', 'Parfum'
  ],
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
  plotOptions: {
    pie: {
      donut: {
        labels: {
          show: true,
        },
      },
    },
  },
};

const series = [44, 55, 13, 43, 22, 33, 3, 10, 89, 2];
</script>
