<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>Учётные записи</h2>
      </v-col>
      <v-col class="text-right">
        <v-btn color="primary" @click="addAccount">+</v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col class="d-flex align-center">
        <v-icon color="grey" class="mr-2">mdi-help-circle</v-icon>
        <p>Для указания нескольких меток используйте разделитель ;</p>
      </v-col>
    </v-row>

    <v-row v-for="account in accounts" :key="account.id">
      <v-col cols="12">
        <AccountCard
          :account="account"
          @update="updateAccount"
          @remove="removeAccount"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useAccountsStore, type Account } from '@/stores/account';
import { storeToRefs } from 'pinia';
import AccountCard from './AccountCard.vue';

const store = useAccountsStore();
const { accounts } = storeToRefs(store);
const { addAccount, removeAccount, updateAccount } = store;
</script>