<template>
  <apexchart  type="pie" :options="chartOptions" :series="series"></apexchart>
</template>

<script setup>
const chartOptions = {
  chart: {
    width: '100', // Pour s'assurer que le graphique occupe la largeur du conteneur
    height: '100', // Ajustez la hauteur en fonction de vos besoins
  },
  labels: [
    "Team 1", "Team 2", "Team 3", "Team 4", "Team 5",
    "Team 6", "Team 7", "Team 8", "Team 9", "Team 10"
  ],
 
};

const series = [
  44, 55, 13, 43, 22,
  33, 3, 10, 89, 2
];

</script>
