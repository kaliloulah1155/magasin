<template>
    <div class="dashboard ma-4">
        <v-banner lines="one" color="warning">
            <template v-slot:text>
                <h1 class="text-subtitle-1 text-grey">Dashboard</h1>
            </template>
        </v-banner>
        <v-container class="my-5"></v-container>
    </div>
</template>
<script setup>
definePageMeta({
    layout: 'master'
})
</script>