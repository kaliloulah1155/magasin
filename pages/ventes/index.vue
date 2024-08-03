<template>
  <div class="dashboard ma-4">
    <template v-if="accessRights.canView">
      <v-container fluid>
        <v-row class="d-flex justify-center">
          <v-col cols="12" md="3">
            <v-card
              class="mx-auto h-100"
              color="error"
              rounded="xl"
              variant="tonal"
              elevation="3"
              hover
              href="/ventes"
            >
              <template v-slot:title>
                <div class="font-weight-bold text-h5 text-black text-center">
                  Ventes
                </div>
              </template>

              <template v-slot:text>
                <div class="float-left text-black mt-3">
                  <div class="text-subtitle-1">
                    Nombre (
                    <v-badge color="brown-lighten-5" text-color="black" inline>
                      <template #badge>
                        <span class="custom-badge">2</span>
                      </template>
                    </v-badge>
                    )
                  </div>
                </div>
                <div class="float-right text-black mt-3">
                  <div class="text-h5 mt-3 pb-3">
                    {{ moneyFormat(300000) }} F CFA
                  </div>
                </div>
              </template>
            </v-card>
          </v-col>
        </v-row>
        <v-row class="d-flex justify-center mt-5">
          <v-col cols="3">
            <v-text-field
              v-model="dt_debut"
              type="date"
              variant="outlined"
              clearable
              class="w-2"
            >
              <template v-slot:label>
                <span class="dt-custom-label text-h6">Date de début</span>
              </template>
            </v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field
              v-model="dt_fin"
              type="date"
              variant="outlined"
              clearable
            >
              <template v-slot:label>
                <span class="dt-custom-label text-h6">Date de fin</span>
              </template>
            </v-text-field>
          </v-col>
          <v-col cols="auto">
            <v-btn
              size="x-small"
              icon="search"
              color="green"
              class="mt-3"
              title="Filtrage"
            ></v-btn>
          </v-col>
        </v-row>
        <v-row justify="center" class="mt-3">
          <v-col cols="12" class="w-100" md="12" xs="12">
            <v-card flat>
              <v-card-title class="d-flex align-center pe-2">
                <v-icon icon="view_list"></v-icon>&nbsp; Liste des ventes
                <v-spacer></v-spacer>
                <v-text-field
                  v-model="search"
                  prepend-inner-icon="search"
                  density="compact"
                  label="Rechercher une vente"
                  single-line
                  flat
                  hide-details
                  variant="solo-filled"
                ></v-text-field>
              </v-card-title>
              <v-divider class="mt-5"></v-divider>
              <v-data-table
                items-per-page="10"
                v-model:search="search"
                :items="orders"
                :headers="headers"
              >
                <!--BEGIN::Detail de la vente-->
                <template v-slot:top>
                  <v-spacer></v-spacer>
                  <v-dialog v-model="dialogDetail" max-width="500px">
                  </v-dialog>
                </template>
                <!--END::Detail de la vente-->

                <template v-slot:item.actions="{ item }">
                 
                  <v-icon
                    v-if="accessRights.canDetail"
                    size="small"
                      class="me-3"
                    @click="detailItem(item)"
                    title="Détail"
                  >
                    dataset
                  </v-icon>
                  <v-icon
                    size="small"
                  
                    @click="printItem(id)"
                    title="Imprimer"
                  >
                    print
                  </v-icon>
                </template>
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </template>
    <template v-else>
      <v-sheet
        class="d-flex align-center justify-center mt-4 flex-wrap text-center mx-auto px-4"
        elevation="4"
        height="250"
        max-width="800"
        width="100%"
        rounded
      >
        <div>
          <h2 class="text-h4 font-weight-black text-orange">
            Vous n'avez pas les droits necessaires
          </h2>
        </div>
      </v-sheet>
    </template>
  </div>
</template>
<script>
import { useVenteStore } from "../../stores/vente";
export default {
  setup() {
    useHead({
      title: "Ventes",
    });
    definePageMeta({
      layout: "master",
    });

    const venteStore = useVenteStore();
    const { data, token } = useAuth();

    const accessRights = reactive({
      profil_id: data.value.profil_id,
      canCreate: false,
      canView: false,
      canEdit: false,
      canDelete: false,
      canDetail: false,
    });

    return { venteStore, token, accessRights };
  },
  data: () => ({
    url: useRuntimeConfig().public.apiBase,
    dt_debut: null,
    dt_fin: null,
    search: "",
    dialogDetail: false,
    editedIndex: -1,
    editedItem: {
      id: 0,
      transaction_id: "",
      full_customer: "",
      full_creator: "",
      methodpaid: "",
      order_amount: "",
      created_at: "",
    },
    defaultItem: {
      id: 0,
      transaction_id: "",
      full_customer: "",
      full_creator: "",
      methodpaid: "",
      order_amount: "",
      created_at: "",
    },
    orders: [
      {
        transaction_id: "AEZ222",
        full_customer: "Abd Ali",
        full_creator: "Ala Jean",
        methodpaid: "ESPECE",
        order_amount: 100,
        created_at: "12/12/2020 10:00:00",
      },
      {
        transaction_id: "AEZ223",
        full_customer: "AZA Nouri",
        full_creator: "Ala Max",
        methodpaid: "ESPECE",
        order_amount: 2000,
        created_at: "13/11/2020 12:00:15",
      },
    ],
    headers: [
      { title: "ID Transaction", key: "transaction_id" },
      { title: "Client", key: "full_customer" },
      { title: "Vendeur", key: "full_creator" },
      { title: "Moyen de paiement", key: "methodpaid" },
      { title: "Montant", key: "order_amount" },
      { title: "Date", align: "start", key: "created_at" },
      { title: "Actions", key: "actions", sortable: false },
    ],
  }),
  watch: {
    dialogDetail(val) {
      val || this.closeDetail();
    },
  },
  created() {
    this.accessRights.canView = true;
    this.checkUserAccess();
  },
  methods: {
    async checkUserAccess() {
      let checkjson = {
        profil_id: this.accessRights.profil_id,
        menu_libelle: "VENTES",
      };
      if (this.token) {
        const response = await useNuxtApp().$axios.post(
          `${this.url}/test_permission`,
          checkjson,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `${this.token}`,
            },
          }
        );
        console.log(response.data);
        this.accessRights.canView = response.data[0].show;
        this.accessRights.canCreate = response.data[1].add;
        this.accessRights.canEdit = response.data[2].edit;
        this.accessRights.canDetail = response.data[3].det;
        this.accessRights.canDelete = response.data[4].supp;
      }
    },
    detailItem(item) {
      this.editedItem = this.orders.indexOf(item);
      this.editedIndex = Object.assign({}, item);
      this.dialogDetail = true;
    },
    detailItemConfirm() {
      this.$nextTick(() => {
        this.detailData(this.editedIndex.id);
      });
      this.closeDetail();
    },
    closeDetail() {
      this.dialogDetail = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    async detailData(id) {},
    printItem(id) {
      alert("imprimer");
    },
  },
  computed: {},
};
</script>
<style scoped></style>
