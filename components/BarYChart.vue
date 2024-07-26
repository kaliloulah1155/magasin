<template>
  <apexchart
    type="bar"
    :options="chartOptions"
    :series="series"
  ></apexchart>
</template>

<script setup>
const series = [{
  data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380]
}];

const chartOptions = {
  chart: {
    width: '100%', // Utilisez des pourcentages pour la largeur
    height: 400, // Ajustez la hauteur selon vos besoins
    toolbar: { 
      show: true,
       tools:{
        download:true
       }
     }
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
    text: "Top 10 des produits ayant été le plus vendus",
    align: 'center',
    floating: true
  },
  subtitle: {
    text: "Produits et Montants Correspondants",
    align: 'center',
  },
  tooltip: {
    theme: 'dark',
    x: {
      show: false // Cache l'axe X dans le tooltip
    },
    y: {
      title: {
        formatter: function () {
          return ''; // Ne pas afficher de titre pour l'axe Y
        }
      },
      formatter: function (val, opts) {
        const category = opts.w.globals.labels[opts.dataPointIndex];
        return `${category}: ${val}`; // Format du tooltip
      }
    }
  }
};
</script>
