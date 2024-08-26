<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const email = ref("");
const phone = ref("");
const password = ref("");
const confirmPassword = ref("");
const emailError = ref("");
const phoneError = ref("");
const passwordError = ref("");
const confirmPasswordError = ref("");
const router = useRouter();

const validateInput = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10,15}$/;
  let isValid = true;

  // email check
  if (!email.value) {
    emailError.value = "Email is required.";
    isValid = false;
  } else if (!emailRegex.test(email.value)) {
    emailError.value = "Please enter a valid email.";
    isValid = false;
  } else {
    emailError.value = "";
  }

  // phone check
  if (!phone.value) {
    phoneError.value = "Phone number is required.";
    isValid = false;
  } else if (!phoneRegex.test(phone.value)) {
    phoneError.value = "Please enter a valid phone number.";
    isValid = false;
  } else {
    phoneError.value = "";
  }

  // password check
  if (password.value.length < 4 || password.value.length > 60) {
    passwordError.value =
      "Your password must contain between 4 and 60 characters.";
    isValid = false;
  } else {
    passwordError.value = "";
  }

  if (password.value !== confirmPassword.value) {
    confirmPasswordError.value = "Passwords do not match.";
    isValid = false;
  } else {
    confirmPasswordError.value = "";
  }

  return isValid;
};

const goToSignIn = () => {
  router.push({ path: "/signin" });
};

const handleSignUp = async () => {
  if (!validateInput()) {
    return;
  }

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_APP_API_URL}/api/user/register`,
      {
        email: email.value,
        phone: phone.value,
        password: password.value,
      }
    );
    alert("Create account success");
    goToSignIn();
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      if (error.response.data.field === "email") {
        emailError.value = error.response.data.message;
      } else if (error.response.data.field === "phone") {
        phoneError.value = error.response.data.message;
      } else if (error.response.data.field === "password") {
        passwordError.value = error.response.data.message;
      }
    } else {
      emailError.value = "Error signing up";
    }
    console.log(error);
  }
};
</script>
<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="bg-black p-10 rounded-lg shadow-lg max-w-2xl w-full">
      <h2 class="text-4xl mb-8 text-start">Sign Up</h2>
      <form @submit.prevent="handleSignUp">
        <div class="mb-6">
          <input
            v-model="email"
            type="text"
            required
            class="w-full p-5 rounded-t placeholder:text-sm bg-[#393d40]"
            :class="{ 'border-yellow-600 border-b-2': emailError }"
            placeholder="Email"
          />
          <p v-if="emailError" class="text-yellow-600 text-sm mt-1 text-start">
            {{ emailError }}
          </p>
        </div>
        <div class="mb-6">
          <input
            v-model="phone"
            type="text"
            required
            class="w-full p-5 rounded-t placeholder:text-sm bg-[#393d40]"
            :class="{ 'border-yellow-600 border-b-2': phoneError }"
            placeholder="Phone number"
          />
          <p v-if="phoneError" class="text-yellow-600 text-sm mt-1 text-start">
            {{ phoneError }}
          </p>
        </div>
        <div class="mb-6 flex space-x-4">
          <input
            v-model="password"
            type="password"
            required
            class="w-1/2 p-5 rounded-t placeholder:text-sm bg-[#393d40]"
            :class="{ 'border-yellow-600 border-b-2': passwordError }"
            placeholder="Password"
          />
          <input
            v-model="confirmPassword"
            type="password"
            required
            class="w-1/2 p-5 rounded-t placeholder:text-sm bg-[#393d40]"
            :class="{ 'border-yellow-600 border-b-2': confirmPasswordError }"
            placeholder="Confirm Password"
          />
        </div>
        <div v-if="passwordError || confirmPasswordError" class="mb-6">
          <p v-if="passwordError" class="text-yellow-600 text-sm text-start">
            {{ passwordError }}
          </p>
          <p
            v-if="confirmPasswordError"
            class="text-yellow-600 text-sm text-start"
          >
            {{ confirmPasswordError }}
          </p>
        </div>
        <button
          type="submit"
          class="w-full bg-red-600 text-white p-3 rounded hover:bg-red-700"
        >
          Sign Up
        </button>
        <p class="mt-6 text-right">
          Already have an account?
          <button @click="goToSignIn" class="text-blue-500">Sign In</button>
        </p>
      </form>
    </div>
  </div>
</template>
