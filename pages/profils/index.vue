<template>
  <div class="dashboard ma-4">
    <v-banner lines="one" color="warning">
      <template v-slot:text>
        <h1 class="text-subtitle-1 text-grey">Gestion des profils</h1>
      </template>
      <template v-slot:actions>
        <v-btn
          @click="saveData"
          text="Valider"
          variant="flat"
          color="blue-lighten-4"
          size="large"
          >Valider</v-btn
        >
      </template>
    </v-banner>
    <v-container class="my-5">
      <div class="d-flex justify-center mb-6">
        <v-sheet class="ma-2 pa-2">
          <Select
            label="Liste des profils"
            placeholder="Veuillez selectionner"
            v-model:input="selectedProfilId"
            :options="options"
            @change="fetchMenus"
          />
        </v-sheet>
      </div>

      <!-- BEGIN: Wizard Layout -->
      <v-container>
        <div class="overflow-x-auto table-container">
          <table class="table" v-if="selectedProfilId">
            <thead class="table-dark">
              <tr>
                <th>Menu</th>
                <template v-for="action in arr_actions" :key="action.id">
                  <th>{{ action.libelle }}</th>
                </template>
              </tr>
            </thead>
            <tbody>
              <tr v-for="menu in arr_menus" :key="menu.resourceId">
                <td>{{ menu.resourceName }}</td>
                <td
                  class="text-center"
                  v-for="action in menu.permissions"
                  :key="action.action_id"
                >
                  <input
                    type="checkbox"
                    :name="`${menu.resourceId}-${action.action_id}`"
                    :checked="action.habilitation ? true : false"
                    v-model="formData[`${menu.resourceId}-${action.action_id}`]"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </v-container>
      <!-- END: Wizard Layout -->
    </v-container>
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
export default {
  setup() {
    definePageMeta({
      layout: "master",
    });
    const authStore = useAuthStore();
    const { token } = useAuth();
    const router = useRouter();
    return { authStore, token,router };
  },
  data: () => ({
    snackbar: false,
    msg: "",
    err: false,
    selectedProfilId: 0,
    options: [],
    arr_actions: [],
    arr_menus: [],
    formData: {},
    url: useRuntimeConfig().public.apiBase,
  }),
  mounted() {
    this.initialize();
    this.createAction();

    this.fetchMenus();
  },
  methods: {
    async initialize() {
      if (this.token) {
        const response = await useNuxtApp().$axios.get(`${this.url}/profils`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${this.token}`,
          },
        });

        if (response.data.data.length > 0) {
  // Extraction et filtrage des nouvelles options
  let res = response.data.data
    .filter((item) => item.id !== null)
    .map((item) => {
      return { id: item.id, label: item.libelle };
    });

  // Concaténation avec les options existantes
  const combinedOptions = this.options.concat(res);

  // Utilisation d'un Set pour retirer les doublons basés sur les id
  const uniqueOptions = Array.from(
    new Map(combinedOptions.map((item) => [item.id, item])).values()
  );

  // Mise à jour des options sans doublons
  this.options = uniqueOptions;
}

      } else {
        this.afficherCnx();
      }
    },
    async createAction() {
      if (this.token) {
        const response = await useNuxtApp().$axios.get(`${this.url}/actions`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${this.token}`,
          },
        });
        if (response.data.data.length > 0) {
          this.arr_actions = response.data.data;
        }
      } else {
        this.afficherCnx();
      }
    },
    async updateMenu() {
      if (this.token) {
        const response = await useNuxtApp().$axios.get(`${this.url}/infoUser`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${this.token}`,
          },
        });
        
        if (response.data.menus.length > 0) {
           window.location.reload();
        }   


      } else {
        this.afficherCnx();
      }
    },
    async fetchMenus() {
      if (this.token) {
        if (this.selectedProfilId > 0) {
          const response = await useNuxtApp().$axios.get(
            `${this.url}/permissions/${this.selectedProfilId}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `${this.token}`,
              },
            }
          );

          if (response.data.length > 0) {
            response.data.map((resp) => {
              this.arr_menus = resp.menus;
              resp.menus.map((menu) => {
                menu.permissions.map((perm) => {
                  this.formData[`${menu.resourceId}-${perm.action_id}`] =
                    perm.habilitation;
                });
              });
            });
          }
        }
      } else {
        this.afficherCnx();
      }
    },

    afficherCnx() {
      this.msg = "Connectez - vous! ou réessayez la connexion";
      this.err = true;
      this.snackbar = true;
    },
    afficherMsg(messg) {
      this.msg = messg;
      this.err = false;
      this.snackbar = true;
      this.initialize();
    },
    async saveData() {
      if (this.token) {
        if (this.selectedProfilId > 0) {
          const response = await useNuxtApp().$axios.post(
            `${this.url}/permissions`,
            {
              profil_id: this.selectedProfilId, // Remplacer par la valeur du profil sélectionné
              choices: this.formData,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `${this.token}`,
              },
            }
          );

          if (response.status == 201) {
            this.updateMenu();
            this.afficherMsg("Mise à jour effectué avec succès");
          }
        }
      } else {
        this.afficherCnx();
      }
    },
  },
};
</script>
<style scoped>
.table-container {
  width: 100%;
  overflow-x: scroll; /* Ajoute le défilement horizontal */
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
  font-size: 1rem;
  font-family: Arial, sans-serif;
  text-align: left;
}

.table th,
.table td {
  padding: 0.75rem;
  border: 1px solid #ddd;
}

.table th {
  background-color: #343a40;
  color: white;
  text-transform: uppercase;
  text-align: center;
}

.table tbody tr:nth-child(even) {
  background-color: #f2f2f2;
}

.table tbody tr:hover {
  background-color: #e9ecef;
}

.table-dark {
  background-color: #343a40;
  color: white;
}

.table-dark th {
  background-color: #343a40;
  color: white;
}

input[type="checkbox"] {
  width: 20px;
  height: 20px;
}
</style>
