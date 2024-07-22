<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12" md="3">
                <v-card class="mx-auto" max-width="400" color="blue lighten-2" dark>
                    <v-card-text class="d-flex align-center justify-center">

                        <div class="">
                            <h3 class="text-h3">32 / 1.323.000 F</h3>
                            <p class="text-h4 mt-4">Ventes journalier</p>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" md="3">
                <v-card class="mx-auto" max-width="400" color="green lighten-2" dark>
                    <v-card-text class="d-flex align-center justify-center">
                        <div>
                            <h3 class="text-h3">85</h3>
                            <p class="text-h4 mt-4">Commandes</p>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" md="3">
                <v-card class="mx-auto" max-width="400" color="orange lighten-2" dark>
                    <v-card-text class="d-flex align-center justify-center">
                        <div>
                            <h3 class="text-h3">6596</h3>
                            <p class="text-h4 mt-4">Total Clients</p>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" md="3">
                <v-card class="mx-auto" max-width="400" color="blue lighten-4" dark>
                    <v-card-text class="d-flex align-center justify-center">
                        <div>
                            <h3 class="text-h3">4 / 4 323 F</h3>
                            <p class="text-h4 mt-4">Dépenses</p>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        
    </v-container>

    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title>
              Liste des produits ventes
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="dialog = true">Add Product</v-btn>
            </v-card-title>
            <v-data-table
              :headers="headers"
              :items="products"
              class="elevation-1"
            >
              <template v-slot:item.actions="{ item }">
                <v-icon small @click="editItem(item)">mdi-pencil</v-icon>
                <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>

      <v-dialog v-model="dialog" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field v-model="editedItem.name" label="Product Name"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field v-model="editedItem.price" label="Price" type="number"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field v-model="editedItem.quantity" label="Quantity" type="number"></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
            <v-btn color="blue darken-1" text @click="save">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
</template>

<script>

import { useAuthStore } from '../../stores/auth'


export default {
  data: () => ({
    dialog: false,
    headers: [
      { text: 'Product Name', value: 'name' },
      { text: 'Price', value: 'price' },
      { text: 'Quantity', value: 'quantity' },
      { text: 'Actions', value: 'actions', sortable: false }
    ],
     products: [
      { name: 'Product 1', price: 10.99, quantity: 100 },
      { name: 'Product 2', price: 15.99, quantity: 50 },
      { name: 'Product 3', price: 7.99, quantity: 200 },
      { name: 'Product 4', price: 20.00, quantity: 30 },
      { name: 'Product 5', price: 5.50, quantity: 150 },
    ],
    editedIndex: -1,
    editedItem: {
      name: '',
      price: 0,
      quantity: 0,
    },
    defaultItem: {
      name: '',
      price: 0,
      quantity: 0,
    }
  }),
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Product' : 'Edit Product'
    }
  },
  methods: {
    editItem (item) {
      this.editedIndex = this.products.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    deleteItem (item) {
      const index = this.products.indexOf(item)
      confirm('Are you sure you want to delete this item?') && this.products.splice(index, 1)
    },
    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    save () {
      if (this.editedIndex > -1) {
        Object.assign(this.products[this.editedIndex], this.editedItem)
      } else {
        this.products.push(this.editedItem)
      }
      this.close()
    }
  }
}

    definePageMeta({
        middleware: 'auth',
        layout: 'master'
    })

    //Get Session of user
    const authStore = useAuthStore()
    const { status } = useAuth()


    if (status.value == "unauthenticated") {
        authStore.data = {}
    }


</script>


<style >

.headline {
  font-size: 24px;
  font-weight: bold;
}
    .v-card {
        border-radius: 12px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    .v-card-title {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
    }

    .v-card-subtitle {
        text-align: center;
        font-size: 20px;
    }

    .v-card-text {
        text-align: center;
        font-size: 16px;
    }
</style>