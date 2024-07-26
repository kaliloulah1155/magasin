<template>
  <div class="mt-4">
    <v-data-table 
     v-model:items-per-page="itemsPerPage"
    :items="items" 
    :headers="headers"
     ></v-data-table>
  </div>
</template>

<script>
export default {
  data: () => ({
    itemsPerPage: 5,
    items: [
      {
        libelle: "African Elephant",
        qte: 2,
      },
      {
        libelle: "African",
        qte: 1,
      },
      {
        libelle: "Lion",
        qte: 8,
      },
      {
        libelle: "Tiger",
        qte: 5,
      },
      {
        libelle:  "Giraffe",
        qte: 2,
      },
      {
        libelle:"Zebra",
        qte: 12,
      },
      {
        libelle:"Penguin",
        qte: 45,
      },
      {
        libelle:"Koala",
        qte: 3,
      },
      {
        libelle:"Kangaroo",
        qte: 22,
      },
      {
        libelle:"Panda",
        qte: 34,
      },

    ],

    headers: [
        { title: 'Libellé', align: 'start', key: 'libelle' },
        { title: 'Quantité', align: 'end', key: 'qte' }
      ],

  }),
};
</script>

<style scoped></style>
