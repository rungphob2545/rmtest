<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const emailOrPhone = ref("");
const password = ref("");
const emailOrPhoneError = ref("");
const passwordError = ref("");

const router = useRouter();
const rememberMe = ref(false);

const validateInput = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10,15}$/;
  let isValid = true;

  if (!emailOrPhone.value) {
    emailOrPhoneError.value = "Email or phone number is required.";
    isValid = false;
  } else if (
    !emailRegex.test(emailOrPhone.value) &&
    !phoneRegex.test(emailOrPhone.value)
  ) {
    emailOrPhoneError.value = "Please enter a valid email or phone number.";
    isValid = false;
  } else {
    emailOrPhoneError.value = "";
  }

  if (password.value.length < 4 || password.value.length > 60) {
    passwordError.value =
      "Your password must contain between 4 and 60 characters.";
    isValid = false;
  } else {
    passwordError.value = "";
  }

  return isValid;
};

const handleSignIn = async () => {
  if (!validateInput()) {
    return;
  }

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_APP_API_URL}/api/user/login`,
      {
        emailOrPhone: emailOrPhone.value,
        password: password.value,
      }
    );

    localStorage.setItem("token", response.data.token);
    router.push("/home");
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      if (error.response.data.field === "emailOrPhone") {
        emailOrPhoneError.value = error.response.data.message;
      } else if (error.response.data.field === "password") {
        passwordError.value = error.response.data.message;
      }
    } else {
      emailOrPhoneError.value = "Error signing in";
    }
    console.log(error);
  }
};
const goToSignUp = () => {
  router.push({ path: "/signup" });
};
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="bg-black p-10 rounded-lg shadow-lg max-w-2xl w-full">
      <h2 class="text-4xl mb-8 text-start">Sign In</h2>
      <form @submit.prevent="handleSignIn">
        <div class="mb-4">
          <input
            v-model="emailOrPhone"
            type="text"
            required
            class="w-full p-5 rounded-t rounded placeholder:text-sm bg-[#393d40]"
            :class="{ 'border-yellow-600 border-b-2': emailOrPhoneError }"
            placeholder="Email or phone number"
          />
          <p
            v-if="emailOrPhoneError"
            class="text-yellow-600 text-sm mt-1 text-start"
          >
            {{ emailOrPhoneError }}
          </p>
        </div>
        <div class="mb-4">
          <input
            v-model="password"
            type="password"
            required
            min="4"
            max="60"
            class="w-full p-5 rounded placeholder:text-sm bg-[#393d40]"
            :class="{ 'border-yellow-600  border-b-2': emailOrPhoneError }"
            placeholder="Password"
          />
          <p
            v-if="passwordError"
            class="text-yellow-600 text-sm mt-1 text-start"
          >
            {{ passwordError }}
          </p>
        </div>
        <button
          type="submit"
          class="w-full bg-red-600 text-white p-3 rounded hover:bg-red-700"
        >
          Sign In
        </button>
        <div class="flex items-center justify-between my-6">
          <label class="flex items-center">
            <input
              type="checkbox"
              v-model="rememberMe"
              class="form-checkbox text-blue-500 focus:outline-none"
            />
            <span class="ml-2 text-sm text-gray-400">Remember Me</span>
          </label>
          <a href="#" class="text-sm text-gray-400 hover:underline"
            >Need help?</a
          >
        </div>
        <p class="mt-4 text-right">
          <button @click="goToSignUp" class="text-blue-500">Sign Up</button>
        </p>
      </form>
    </div>
  </div>
</template>

<style></style>
