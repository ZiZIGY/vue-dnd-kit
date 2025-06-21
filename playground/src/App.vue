<script setup lang="ts">
  import { ref } from 'vue';

  const formData = ref({
    name: '',
    email: '',
    message: '',
  });

  const rules = {
    name: [(v: string) => !!v || 'Имя обязательно'],
    email: [
      (v: string) => !!v || 'Email обязателен',
      (v: string) => /.+@.+\..+/.test(v) || 'Email должен быть валидным',
    ],
    message: [(v: string) => !!v || 'Сообщение обязательно'],
  };
</script>

<template>
  <v-app>
    <v-main>
      <v-container class="py-8">
        <v-row justify="center">
          <v-col
            cols="12"
            md="8"
            lg="6"
          >
            <v-card class="pa-6">
              <v-card-title class="text-h4 mb-4">
                FormBuilder Demo
              </v-card-title>

              <v-form @submit.prevent>
                <v-text-field
                  v-model="formData.name"
                  label="Имя"
                  :rules="rules.name"
                  variant="outlined"
                  class="mb-4"
                />

                <v-text-field
                  v-model="formData.email"
                  label="Email"
                  type="email"
                  :rules="rules.email"
                  variant="outlined"
                  class="mb-4"
                />

                <v-textarea
                  v-model="formData.message"
                  label="Сообщение"
                  :rules="rules.message"
                  variant="outlined"
                  rows="4"
                  class="mb-6"
                />

                <v-btn
                  color="primary"
                  size="large"
                  block
                  type="submit"
                >
                  Отправить
                </v-btn>
              </v-form>

              <v-divider class="my-6" />

              <v-card-text>
                <h3>Данные формы:</h3>
                <pre>{{ JSON.stringify(formData, null, 2) }}</pre>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
  pre {
    background: #f5f5f5;
    padding: 16px;
    border-radius: 8px;
    font-size: 14px;
    overflow-x: auto;
  }
</style>
