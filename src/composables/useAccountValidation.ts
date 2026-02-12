import { type Account, AccountType } from '@/stores/account';

export const labelRules = [
    (v?: string) => !v || v.length <= 50 || 'Максимум 50 символов',
];

export const credentialRules = [
    (v?: string) => !!v || 'Обязательное поле',
    (v?: string) => !v || v.length <= 100 || 'Максимум 100 символов',
];

export function isAccountValid(account: Account): boolean {
    const labelString = account.labels.map(l => l.text).join(';');
    const labelValid = labelRules.every(rule => rule(labelString) === true);
    const credentialValid = credentialRules.every(rule => rule(account.login) === true);
    const passwordValid = account.type !== AccountType.Local ||
        credentialRules.every(rule => rule(account.password ?? undefined) === true);
    return labelValid && credentialValid && passwordValid;
}