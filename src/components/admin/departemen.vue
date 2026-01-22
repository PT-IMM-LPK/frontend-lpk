<script setup>
import { ref, provide } from "vue";
import Aside from "../bar/aside.vue";
import HeaderAdmin from "../bar/header-admin.vue";

const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

provide('toggleMobileMenu', toggleMobileMenu);
</script>

<template>
  <div class="min-h-screen flex flex-col font-['Montserrat']">
    <div class="flex flex-1 overflow-hidden">
      <Aside />

      <div class="flex flex-col flex-1 w-full lg:ml-0 overflow-hidden">
        <HeaderAdmin />

        <main class="bg-[#EFEFEF] flex-1 flex flex-col p-3 overflow-hidden">
          <div class="bg-white rounded-lg shadow-md p-5 flex-1 flex flex-col overflow-y-auto">
            <!-- Content goes here -->
          </div>
        </main>
      </div>
    </div>
  </div>
</template>