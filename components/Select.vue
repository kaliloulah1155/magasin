<template>
    <div>
        <label for="select-option" class="text-h6 mx-3">{{ label }}</label>
        <div class="mt-2"> 
            <select v-model="inputComputed" class="text-h6 champ text-center v-field__input  h-75 mx-4 border elevation-2"  > 
                <option :value="0" selected>{{ placeholder }}</option>
                <template v-for="option in options">
                            <template v-if="option.id !=null">
                                <option  :value="option.id"  :key="option.id">{{ option.label }}</option>
                            </template>
                    </template>
            </select>
        </div>
    </div>
</template>
<script setup lang="ts">
import { defineProps, defineEmits, toRefs, computed } from 'vue';

const emit = defineEmits<{ (e: 'update:input', value: number): void }>()
const props = defineProps<{
    options: Array<any>,
    placeholder:String,
    label: string,
    input: number,
}>()

const { label, input } = toRefs(props)

const inputComputed = computed({
    get: () => input.value,
    set: (val: number) => emit('update:input', val)
})
</script>
<style scoped>
 
 .champ{
    width: 30rem;
 }
 .champ::after{
    content:"zz";
 }
</style>