<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const userData = ref(null);
const error = ref(null);
const router = useRouter();

const fetchUserData = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_API_URL}/api/user`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    userData.value = response.data;
  } catch (err) {
    error.value = err.response ? err.response.data.message : err.message;
  }
};

const logout = () => {
  localStorage.removeItem("token");
  router.push("/signin");
};

onMounted(fetchUserData);
</script>

<template>
  <div v-if="userData" class="flex items-center justify-center h-screen">
    <div class="text-center">
      <h2 class="text-2xl">ยินดีต้อนรับ {{ userData.email }}</h2>
      <p class="mt-2 text-lg">เบอร์โทร: {{ userData.phone }}</p>
      <button
        @click="logout"
        class="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-800"
      >
        Sign out
      </button>
    </div>
  </div>
  <div v-else>
    <p v-if="error" class="text-red-600">{{ error }}</p>
    <p v-else>Loading...</p>
  </div>
</template>
