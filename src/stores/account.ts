import { defineStore } from 'pinia';
import { ref } from 'vue';

type ACCOUNT_TYPE = 'LDAP' | 'Local';

export enum AccountType {
    LDAP = 'LDAP',
    Local = 'Local',
}

const DEFAULT_LOGIN_VALUE = 'Значение';

export interface Account {
  id: number;
  labels: { text: string }[];
  type: ACCOUNT_TYPE;
  login: string;
  password: string | null;
  showPass: boolean;
}

export const useAccountsStore = defineStore('accounts', () => {
  const accounts = ref<Account[]>([]);
  let nextId = 1;

  const addAccount = () => {
    accounts.value.push({
      id: nextId++,
      labels: [],
      type: AccountType.LDAP,
      login: DEFAULT_LOGIN_VALUE,
      password: null,
      showPass: false,
    });
  };

  const removeAccount = (id: number) => {
    accounts.value = accounts.value.filter((acc) => acc.id !== id);
  };

  const updateAccount = (updated: Account) => {
    const index = accounts.value.findIndex((acc) => acc.id === updated.id);
    if (index !== -1) {
      accounts.value[index] = { ...updated };
    }
  };

  return { accounts, addAccount, removeAccount, updateAccount };
});