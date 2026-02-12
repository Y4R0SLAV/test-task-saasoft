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
        <p> Для указания нескольких меток для одной пары логин/пароль используйте разделитель ; </p>
      </v-col>
    </v-row>
    <v-row v-for="account in accounts" :key="account.id">
      <v-col cols="12">
        <v-card>
          <v-card-text>
            <v-row class="flex-nowrap align-center">
              <v-col class="flex-grow-1">
                <v-text-field
                  label="Метка"
                  :model-value="getLabelInput(account)"
                  @update:model-value="newValue => setLabelInput(account, newValue)"
                  dense
                  :rules="labelRules"
                  @blur="validateAndUpdate(account)"
                  persistent-hint
                />
              </v-col>
              <v-col class="flex-grow-1">
                <v-select
                  label="Тип записи"
                  v-model="account.type"
                  dense
                  :items="types"
                  @update:model-value="validateAndUpdate(account)"
                />
              </v-col>
              <v-col class="flex-grow-1">
                <v-text-field
                  label="Логин"
                  dense
                  v-model="account.login"
                  :rules="requiredHundredRules"
                  @blur="validateAndUpdate(account)"
                />
              </v-col>
              <v-col class="flex-grow-1" v-if="account.type === 'Local'">
                <v-text-field
                  label="Пароль"
                  v-model="account.password"
                  dense
                  :rules="requiredHundredRules"
                  :type="getPassType(account)"
                  @blur="validateAndUpdate(account)"
                >
                  <template v-slot:append-inner>
                    <v-icon @click="account.showPass = !account.showPass"> 
                        {{ getPassIcon(account) }}
                    </v-icon>
                   </template>
                </v-text-field>
              </v-col>
              <v-col cols="auto" class="ml-auto d-flex align-center" >
                <v-btn color="error" icon @click="removeAccount(account.id)" size="small">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useAccountsStore, type Account, AccountType } from '@/stores/account';
import { storeToRefs } from 'pinia';

const store = useAccountsStore();
const { addAccount, removeAccount, updateAccount } = store;
const { accounts } = storeToRefs(store);

// Правила валидации
const labelRules = [
  (v?: string) => !v ? '' : v.length <= 50 || 'Максимум 50 символов',
];

const requiredHundredRules = [
  (v?: string) => !v ? 'Обязательное поле' : v.length <= 100 || 'Максимум 100 символов',
];

const types = [
  { title: 'LDAP', value: AccountType.LDAP },
  { title: 'Локальная', value: AccountType.Local },
];

const validateAndUpdate = (account: Account) => {
  // Для LDAP пароль null
  if (account.type === AccountType.LDAP) {
    account.password = null;
  }

  // Валидация (Vuetify rules уже покажут ошибки)
  // Но для сохранения проверяем, если нет ошибок
  const isValid = 
    requiredHundredRules.every((rule) => rule(account.login) === true) &&
    (account.type !== AccountType.Local || requiredHundredRules.every((rule) => rule(account.password) === true));

  if (isValid) {
    updateAccount(account);
  }
};

function getPassIcon(account: Account) {
    return account.showPass ? 'mdi-eye' : 'mdi-eye-off';
}

function getPassType(account: Account) {
    return account.showPass ? 'text' : 'password';
}

function getLabelInput(account: Account) {
    return account.labels.map((l) => l.text).join(';');
}

function setLabelInput(account: Account, value: string) {
    // Преобразование метки
    if (value) {
      account.labels = value
        .split(';')
        .map((text: string) => ({ text }));
    } else {
      account.labels = [];
    }
}
</script>