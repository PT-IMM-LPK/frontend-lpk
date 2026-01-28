<script setup>
import { ref, provide } from "vue";
import Aside from "../bar/aside.vue";
import HeaderAdmin from "../bar/header-admin.vue";
import {
  MagnifyingGlassIcon,
  TrashIcon,
  PlusIcon,
  XMarkIcon,
  PencilSquareIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CheckIcon,
} from "@heroicons/vue/24/outline";

const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

provide("toggleMobileMenu", toggleMobileMenu);
</script>

<template>
  <div class="h-screen flex flex-col font-['Montserrat']">
    <div class="flex flex-1 overflow-hidden">
      <!-- Aside Sidebar - Push content style -->
      <Aside :isOpen="isSidebarOpen" :onClose="closeSidebar" />

      <!-- Main Content Area -->
      <div class="flex flex-col flex-1 min-w-0 overflow-hidden">
        <HeaderAdmin />

        <!-- Content -->
        <main class="bg-[#EFEFEF] flex-1 flex flex-col p-3 overflow-hidden">
          <div
            class="bg-white rounded-lg shadow-md p-5 flex-1 flex flex-col overflow-y-auto"
          >
            <!-- Content goes here -->
            <div
              class="flex items-center gap-3 pb-4 border-b shrink-0 flex-none justify-between"
            >
              <!-- Button pertanyaan  -->
              <div class="flex items-center gap-3">
                <button
                  @click="openTambahPertanyaan"
                  class="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-white bg-[#6444C6] hover:bg-[#5c3db8] transition text-sm"
                >
                  <PlusIcon class="w-5 h-5" />
                  <span>Tambah Pertanyaan</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>
