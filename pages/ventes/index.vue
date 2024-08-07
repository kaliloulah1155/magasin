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
                        <span class="custom-badge">{{ nbre_vente }}</span>
                      </template>
                    </v-badge>
                    )
                  </div>
                </div>
                <div class="float-right text-black mt-3">
                  <div class="text-h5 mt-3 pb-3">
                    {{ moneyFormat(montant_vente) }} F CFA
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
              type="datetime-local"
              step="1"
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
              type="datetime-local"
              step="1"
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
              @click="filtrage"
            ></v-btn>
          </v-col>
        </v-row>
        <v-row align="center" justify="center">
              <v-col cols="auto">
                <v-btn   
                  size="x-small"
                  icon="autorenew"
                  color="green"
                  title="Rafraichissement de la liste des ventes"
                  @click="refraichir"
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
                :loading="orderLength > 0 ? false : true"
                :sort-by="[{ key: 'created_at', order: 'desc' }]"
              >
                <!--BEGIN::Detail de la vente-->
                <template v-slot:top>
                  <v-spacer></v-spacer>
                  <v-dialog v-model="dialogDetail" max-width="800px">
                    <template v-slot:default="{ isActive }">
                      <v-card>
                        <template v-slot:title>
                          <h3 class="custom-title text-uppercase">
                            Détail de la vente
                          </h3>
                          <v-card-text>
                            <v-row>
                              <v-col cols="12" md="6" sm="6">
                                <span
                                  class="font-weight-bold text-decoration-underline"
                                  >Date de création
                                </span>
                                : {{ formatDateTime(editedItem.created_at) }}
                              </v-col>
                              <v-col cols="12" md="6" sm="6">
                                <span
                                  class="font-weight-bold text-decoration-underline"
                                  >Moyen de paiement
                                </span>
                                : {{ editedItem.methodpaid }}
                              </v-col>
                            </v-row>
                            <v-row>
                              <v-col cols="12" md="6" sm="6">
                                <span
                                  class="font-weight-bold text-decoration-underline"
                                  >Client</span
                                >
                                : {{ editedItem.client_nom }}
                                {{ editedItem.client_prenoms }}
                              </v-col>
                              <v-col cols="12" md="6" sm="6">
                                <span
                                  class="font-weight-bold text-decoration-underline"
                                  >ID Transaction</span
                                >
                                : {{ editedItem.transaction_id }}
                              </v-col>
                            </v-row>
                            <v-row>
                              <v-col cols="12" md="6" sm="6">
                                <span
                                  class="font-weight-bold text-decoration-underline"
                                  >Caissier(e)</span
                                >
                                : {{ editedItem.createur_nom }}
                                {{ editedItem.createur_prenoms }}
                              </v-col>
                              <v-col cols="12" md="6" sm="6">
                                <span
                                  class="font-weight-bold text-decoration-underline"
                                  >Montant</span
                                >
                                : {{ moneyFormat(editedItem.order_amount) }} F
                                CFA
                              </v-col>
                            </v-row>
                            <v-row>
                              <v-col cols="12" md="6" sm="6">
                                <span
                                  class="font-weight-bold text-decoration-underline"
                                  >TVA(%)</span
                                >
                                : {{ moneyFormat(editedItem.tva) }}
                              </v-col>
                              <v-col cols="12" md="6" sm="6">
                                <span
                                  class="font-weight-bold text-decoration-underline"
                                  >Remise</span
                                >
                                : {{ moneyFormat(editedItem.remise) }} F CFA
                              </v-col>
                            </v-row>
                            <v-row>
                              <v-col cols="12" md="6" sm="6">
                                <span
                                  class="font-weight-bold text-decoration-underline"
                                  >Espèce</span
                                >
                                : {{ moneyFormat(editedItem.espece) }} F CFA
                              </v-col>
                              <v-col cols="12" md="6" sm="6">
                                <span
                                  class="font-weight-bold text-decoration-underline"
                                  >Monnaie</span
                                >
                                : {{ moneyFormat(editedItem.monnaie) }} FCFA
                              </v-col>
                            </v-row>
                            <v-row>
                              <v-col cols="12" md="6" sm="6">
                                <span
                                  class="font-weight-bold text-decoration-underline"
                                  >Nombre de produits</span
                                >
                                : {{ moneyFormat(nbre_item) }}
                              </v-col>
                            </v-row>
                            <v-container>
                              <v-divider class="mt-1"></v-divider>
                              <v-icon icon="view_list"></v-icon>&nbsp; Liste des
                              produits
                              <v-data-table
                                items-per-page="10"
                                v-model:search="search_item"
                                :items="orders_item"
                                :headers="headers_item"
                              ></v-data-table>
                            </v-container>
                          </v-card-text>
                          <v-card-actions>
                            <v-row justify="center">
                              <v-btn
                                text="FERMER"
                                variant="elevated"
                                color="error"
                                @click="isActive.value = false"
                                size="small"
                              ></v-btn>
                            </v-row>
                          </v-card-actions>
                        </template>
                      </v-card>
                    </template>
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
                    v-if="accessRights.canPrint"
                    @click="printItem(item)"
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
  <v-snackbar
    v-model="snackbar"
    multi-line
    location="top"
    :color="err ? 'red-lighten-3' : 'green-lighten-3'"
  >
    {{ msg }}
    <template v-slot:actions>
      <v-btn color="white" variant="text" @click="snackbar = false">
        Fermer
      </v-btn>
    </template>
  </v-snackbar>
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
      canPrint: false,
    });

    return { venteStore, token, accessRights };
  },
  data: () => ({
    url: useRuntimeConfig().public.apiBase,
    dt_debut: null,
    dt_fin: null,
    search: "",
    search_item: "",
    snackbar: false,
    msg: "",
    err: false,
    dialogDetail: false,
    editedIndex: -1,
    url: useRuntimeConfig().public.apiBase,
    nbre_vente: 0,
    nbre_item: 0,
    montant_vente: 0,
    editedItem: {},
    defaultItem: {
      id: 0,
      transaction_id: "",
      full_customer: "",
      full_creator: "",
      methodpaid: "",
      order_amount: "",
      created_at: "",
    },
    orders: [],
    headers: [
      { title: "ID Transaction", key: "transaction_id" },
      {
        title: "Client",
        key: "full_customer",

        value: (item) => `${item.client_nom} ${item.client_prenoms}`,
      },
      {
        title: "Caissier(e)",
        key: "full_creator",
        value: (item) => `${item.createur_nom} ${item.createur_prenoms}`,
      },
      { title: "Moyen de paiement", key: "methodpaid" },
      {
        title: "Montant( F CFA )",
        key: "order_amount",
        value: (item) => moneyFormat(item.order_amount),
      },
      {
        title: "Date",
        align: "start",
        key: "created_at",
        value: (item) => formatDateTime(item.created_at),
      },
      { title: "Actions", key: "actions", sortable: false },
    ],
    //Table produits
    headers_item: [
      { title: "Produits", key: "produit" },
      { title: "Quantité", key: "qte", value: (item) => moneyFormat(item.qte) },
      { title: "Prix", key: "price", value: (item) => moneyFormat(item.price) },
      {
        title: "Montant",
        key: "price_by_qte",
        value: (item) => moneyFormat(item.price_by_qte),
      },
    ],
    orders_item: [],
  }),
  watch: {
    dialogDetail(val) {
      val || this.closeDetail();
    },
  },
  created() {
    this.initialize();
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
        this.accessRights.canView = response.data[0].show;
        this.accessRights.canCreate = response.data[1].add;
        this.accessRights.canEdit = response.data[2].edit;
        this.accessRights.canDetail = response.data[3].det;
        this.accessRights.canDelete = response.data[4].supp;
        this.accessRights.canPrint = response.data[6].prt;
      }
    },
    async initialize() {
      if (this.token) {
        const response = await useNuxtApp().$axios.get(`${this.url}/orders`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${this.token}`,
          },
        });

        this.nbre_vente = response.data.data.summary.total_transactions;
        this.montant_vente = response.data.data.summary.total_sum;
        if (response.data.data.orders.length > 0) {
          this.orders = response.data.data.orders;
        }
      } else {
        this.afficherCnx();
      }
    },
    async filtrage() {
      if (this.dt_debut && this.dt_fin) {
        if (this.token) {
          const response = await useNuxtApp().$axios.get(
            `${this.url}/orders?start_date=${formatDateTimeSecond(
              this.dt_debut
            )}&end_date=${formatDateTimeSecond(this.dt_fin)}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `${this.token}`,
              },
            }
          );

          this.nbre_vente = response.data.data.summary.total_transactions;
          this.montant_vente = response.data.data.summary.total_sum;
          if (response.data.data.orders.length > 0) {
            this.orders = response.data.data.orders;
          } else {
            this.orders = [];
          }
        } else {
          this.afficherCnx();
        }
      }
    },
    async refraichir(){
      this.initialize();
      this.dt_debut=null;
      this.dt_fin=null;
    },
    async detailItem(item) {
      if (item.order_id > 0) {
        if (this.token) {
          const response = await useNuxtApp().$axios.get(
            `${this.url}/orders/${item.order_id}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `${this.token}`,
              },
            }
          );

          this.nbre_item =
            response.data.data.items.original.data.nbre_item.number_item;
          this.editedItem = response.data.data.detail[0];

          this.orders_item = response.data.data.items.original.data.panier;

          this.dialogDetail = true;
        } else {
          this.afficherCnx();
        }
      }
    },
    closeDetail() {
      this.dialogDetail = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    printItem(item) {
      if (item.order_id > 0) {
        window.open(`${this.url}/printOrder/${item.order_id}`, "_blank");
      }
    },
    afficherCnx() {
      this.msg = "Connectez - vous! ou réessayez la connexion";
      this.err = true;
      this.snackbar = true;
    },
  },
  computed: {
    orderLength() {
      return this.orders.length;
    },
  },
};
</script>
<style scoped></style>
