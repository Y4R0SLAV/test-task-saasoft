import { defineStore } from 'pinia';
import { ref } from 'vue';

type ACCOUNT_TYPE = 'LDAP' | 'Local';

export enum AccountType {
    LDAP = 'LDAP',
    Local = 'Local',
}

const STORAGE_KEY = 'accounts';

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
      login: '',
      password: null,
      showPass: false,
    });
    saveAccounts();
  };

  const removeAccount = (id: number) => {
    accounts.value = accounts.value.filter((acc) => acc.id !== id);
    saveAccounts();
  };

  const updateAccount = (updated: Account) => {
    const index = accounts.value.findIndex((acc) => acc.id === updated.id);
    if (index !== -1) {
      accounts.value[index] = { ...updated };
    }
    saveAccounts();
  };

  // --- Сохранение в localStorage ---
  function saveAccounts() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts.value));
  }

  // --- Загрузка из localStorage ---
  function loadAccounts() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Account[];
        // Восстанавливаем корректную структуру
        accounts.value = parsed.map(acc => ({
          ...acc,
          // убедимся, что showPass всегда false
          showPass: false,
          // labels должны быть массивом объектов { text: string }
          labels: Array.isArray(acc.labels) 
              ? acc.labels.map(l => typeof l === 'string' ? { text: l } : l)
              : []
        }));
        // Вычисляем следующий доступный id
        const maxId = accounts.value.reduce((max, acc) => Math.max(max, acc.id), 0);
        nextId = maxId + 1;
      } catch (e) {
        console.error('Ошибка загрузки учётных записей из localStorage', e);
        accounts.value = [];
        nextId = 1;
      }
    }
  }

  // Иницилизация
  loadAccounts();

  return { accounts, addAccount, removeAccount, updateAccount };
});