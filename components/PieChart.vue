<template>
  <apexchart type="donut" :options="chartOptions" :series="series"></apexchart>
</template>

<script setup>
const chartOptions = {
  chart: {
    type: "donut",
    width: "100%", // Utiliser des pourcentages pour la responsivité
    height: 300, // Ajustez la hauteur en fonction de vos besoins
    toolbar: { 
      show: true,
       tools:{
        download:true
       }
     }
  },
  labels: [
    "Apple",
    "Mango",
    "Orange",
    "Watermelon",
    "Watermelon",
    "Pomme",
    "Mangue",
    "Mandarine",
    "Banane",
    "Parfum",
  ],
  legend: {
    position: "bottom", // Place les légendes en bas
  },
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
          total: {
            show: true,
            label: "Total",
            formatter: (w) => {
              return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
            },
          },
          style: {
            fontSize: '14px', // Taille de la police
            colors: ['#FF0000'], // Couleur des pourcentages
          },
        },
      },
    },
  },
};



const series = [44, 55, 13, 43, 22, 33, 3, 10, 89, 2];
</script>

<style scoped lang="scss">
.chart-container {
  min-height: 72.7rem !important;
}

</style>
