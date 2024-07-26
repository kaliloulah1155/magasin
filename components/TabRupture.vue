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
        statut: "Stock",
      },
      {
        libelle: "African",
        qte: 0,
        statut: "Rupture",
      },
      {
        libelle: "Lion",
        qte: 8,
        statut: "Stock",
      },
      {
        libelle: "Tiger",
        qte: 0,
        statut: "Rupture",
      },
      {
        libelle: "Giraffe",
        qte: 2,
        statut: "Stock",
      },
      {
        libelle: "Zebra",
        qte: 12,
        statut: "Stock",
      },
      {
        libelle: "Penguin",
        qte: 0,
        statut: "Rupture",
      },
      {
        libelle: "Koala",
        qte: 12,
        statut: "Stock",
      },
      {
        libelle: "Kangaroo",
        qte: 0,
        statut: "Rupture",
      },
      {
        libelle: "Panda",
        qte: 0,
        statut: "Rupture",
      },
    ],

    headers: [
      { title: "Libellé", align: "start", key: "libelle" },
      { title: "Quantité", align: "end", key: "qte" },
      { title: "Statut", align: "end", key: "statut" },
    ],
  }),
};
</script>

<style scoped></style>
