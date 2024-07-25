<template>
  <apexchart
    type="bar"
    :options="chartOptions"
    :series="series"
  ></apexchart>
</template>

<script setup>
 

// Données du graphique
const series = [{
  data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380]
}];

// Options de configuration du graphique
const chartOptions = {
  chart: {
    width: '100', // Pour s'assurer que le graphique occupe la largeur du conteneur
    height: '100', // Ajustez la hauteur en fonction de vos besoins
  },
  plotOptions: {
    bar: {
      barHeight: '100%',
      distributed: true,
      horizontal: true,
      dataLabels: {
        position: 'bottom'
      },
    }
  },
  colors: ['#33b2df', '#546E7A', '#d4526e', '#13d8aa', '#A5978B', '#2b908f', '#f9a3a4', '#90ee7e',
    '#f48024', '#69d2e7'
  ],
  dataLabels: {
    enabled: true,
    textAnchor: 'start',
    style: {
      colors: ['#fff']
    },
    formatter: function (val, opt) {
      return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val;
    },
    offsetX: 0,
    dropShadow: {
      enabled: true
    }
  },
  stroke: {
    width: 1,
    colors: ['#fff']
  },
  xaxis: {
    categories: ['South Korea', 'Canada', 'United Kingdom', 'Netherlands', 'Italy', 'France', 'Japan',
      'United States', 'China', 'India'
    ],
  },
  yaxis: {
    labels: {
      show: false
    }
  },
  title: {
    text: 'Custom DataLabels',
    align: 'center',
    floating: true
  },
  subtitle: {
    text: 'Category Names as DataLabels inside bars',
    align: 'center',
  },
  tooltip: {
    theme: 'dark',
    x: {
      show: false
    },
    y: {
      title: {
        formatter: function () {
          return '';
        }
      }
    }
  }
};
</script>
