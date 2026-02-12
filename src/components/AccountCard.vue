<template>
  <v-card>
    <v-card-text>
      <v-row class="flex-nowrap align-center">
        <!-- Метка -->
        <v-col class="flex-grow-1">
          <v-text-field
            label="Метка"
            :model-value="labelInput"
            @update:model-value="updateLabel"
            @blur="tryUpdate"
            dense
            :rules="labelRules"
            persistent-hint
          />
        </v-col>

        <!-- Тип записи -->
        <v-col class="flex-grow-1">
          <v-select
            label="Тип записи"
            :model-value="editable.type"
            @update:model-value="val => changeType(val as AccountType)"
            dense
            :items="typeOptions"
          />
        </v-col>

        <!-- Логин -->
        <v-col class="flex-grow-1">
          <v-text-field
            label="Логин"
            :model-value="editable.login"
            @update:model-value="val => editable.login = val"
            @blur="tryUpdate"
            dense
            :rules="credentialRules"
          />
        </v-col>

        <!-- Пароль (только Local) -->
        <v-col v-if="editable.type === AccountType.Local" class="flex-grow-1">
          <v-text-field
            label="Пароль"
            :model-value="editable.password ?? ''"
            @update:model-value="val => editable.password = val"
            @blur="tryUpdate"
            dense
            :rules="credentialRules"
            :type="passwordType()"
          >
            <template v-slot:append-inner>
              <v-icon @click="toggleShowPass">
                {{ passwordIcon }}
              </v-icon>
            </template>
          </v-text-field>
        </v-col>

        <!-- Кнопка удаления -->
        <v-col cols="auto" class="ml-auto d-flex align-center">
          <v-btn color="error" icon @click="$emit('remove', editable.id)" size="small">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { AccountType, type Account } from '@/stores/account';
import { labelRules, credentialRules, isAccountValid } from '@/composables/useAccountValidation';
import { usePasswordToggle } from '@/composables/usePasswordToggle';

const props = defineProps<{ account: Account }>();
const emit = defineEmits<{
  (e: 'update', account: Account): void;
  (e: 'remove', id: number): void;
}>();

// Локальная копия для редактирования
const editable = ref<Account>({ ...props.account });

// Переключение пароля
const { showPass, icon: passwordIcon, type: passwordType } = usePasswordToggle(editable.value.showPass);
const toggleShowPass = () => {
  showPass.value = !showPass.value;
  editable.value.showPass = showPass.value;
};

// Метка: строка через разделитель ;
const labelInput = ref(editable.value.labels.map(l => l.text).join(';'));

const updateLabel = (value: string) => {
  labelInput.value = value;
  if (value) {
    editable.value.labels = value.split(';').map(text => ({ text }));
  } else {
    editable.value.labels = [];
  }
};

// Смена типа
const changeType = (newType: AccountType) => {
  editable.value.type = newType;
  if (newType === AccountType.LDAP) {
    editable.value.password = null;
  }
  tryUpdate();
};

// Валидация и отправка события
const tryUpdate = () => {
  if (isAccountValid(editable.value)) {
    emit('update', editable.value);
  }
};

const typeOptions = [
  { title: 'LDAP', value: AccountType.LDAP },
  { title: 'Локальная', value: AccountType.Local },
];
</script>