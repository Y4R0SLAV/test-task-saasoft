import vuetify from 'eslint-config-vuetify'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  vuetify(),
  {
    rules: {
      'no-extra-semi': 'off',
    },
  },
)
