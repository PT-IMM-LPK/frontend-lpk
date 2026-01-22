<script setup>
import { ref, provide, computed } from "vue";
import Aside from "../bar/aside.vue";
import HeaderAdmin from "../bar/header-admin.vue";
import {
  MagnifyingGlassIcon,
  Bars3BottomLeftIcon,
  ArrowUpTrayIcon,
  TrashIcon,
  CheckIcon,
  PencilSquareIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from "@heroicons/vue/24/outline";

const isMobileMenuOpen = ref(false);
const searchQuery = ref("");
const currentPage = ref(1);
const selectedRowIds = ref([]);
const itemsPerPage = 10;

// Mock data untuk testing
const tableData = ref([
  {
    id: 1,
    nomorTiket: "GA-TR-01",
    nik: "12345678901234567890",
    nama: "John Doe",
    email: "john.doe@company.com",
    departemen: "IT",
    lokasi: "Desabinaan",
    keperluan: "Dinas",
    layanan: "Izin Khusus Kendaraan operasional",
    waktuPeminjaman: "2024-01-21 10:30:45",
    waktuSelesai: "2024-01-21 12:30:45",
    headApproval: false,
    transApproval: false,
    gaApproval: true,
    gsApproval: false,
  },
  {
    id: 2,
    nomorTiket: "GA-TR-02",
    nik: "09876543210987654321",
    nama: "Jane Smith",
    email: "jane.smith@company.com",
    departemen: "HR",
    lokasi: "NonBinaan",
    keperluan: "Pribadi",
    layanan: "Layanan Pool",
    waktuPeminjaman: "2024-01-21 11:00:00",
    waktuSelesai: "2024-01-21 13:00:00",
    headApproval: true,
    transApproval: true,
    gaApproval: false,
    gsApproval: true,
  },
]);

// Filtered data based on search
const filteredTableData = computed(() => {
  if (!searchQuery.value) {
    return tableData.value;
  }
  return tableData.value.filter(
    (item) =>
      item.nama.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.nomorTiket.toLowerCase().includes(searchQuery.value.toLowerCase()),
  );
});

// Paginated data
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredTableData.value.slice(start, end);
});

// Total pages
const totalPages = computed(() => {
  return Math.ceil(filteredTableData.value.length / itemsPerPage);
});

// Start and end index for pagination display
const startIndex = computed(() => {
  return (currentPage.value - 1) * itemsPerPage + 1;
});

const endIndex = computed(() => {
  return Math.min(
    currentPage.value * itemsPerPage,
    filteredTableData.value.length,
  );
});

// Select all checkbox
const selectAllChecked = computed(() => {
  if (paginatedData.value.length === 0) return false;
  return paginatedData.value.every((item) =>
    selectedRowIds.value.includes(item.id),
  );
});

// Helper functions
const isRowSelected = (id) => {
  return selectedRowIds.value.includes(id);
};

const selectRow = (id) => {
  if (isRowSelected(id)) {
    selectedRowIds.value = selectedRowIds.value.filter((rowId) => rowId !== id);
  } else {
    selectedRowIds.value.push(id);
  }
};

const toggleSelectAll = () => {
  if (selectAllChecked.value) {
    paginatedData.value.forEach((item) => {
      selectedRowIds.value = selectedRowIds.value.filter(
        (id) => id !== item.id,
      );
    });
  } else {
    paginatedData.value.forEach((item) => {
      if (!isRowSelected(item.id)) {
        selectedRowIds.value.push(item.id);
      }
    });
  }
};

const getResultColor = (hasil) => {
  return hasil === "Lolos"
    ? { bg: "#DCFCE7", text: "#166534" }
    : { bg: "#FEE2E2", text: "#991B1B" };
};

const handleEdit = (id) => {
  console.log("Edit item:", id);
};

const handleApprove = (id) => {
  const item = tableData.value.find((row) => row.id === id);
  if (item) {
    item.persetujuan = !item.persetujuan;
  }
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

// Function untuk toggle mobile menu dari header
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

// Function untuk membuka filter
const openFilter = () => {
  console.log("Filter opened");
};

// Provide untuk digunakan di header
provide("toggleMobileMenu", toggleMobileMenu);
</script>

<template>
  <div class="min-h-screen flex flex-col font-['Montserrat']">
    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar -->
      <Aside />

      <div class="flex flex-col flex-1 w-full lg:ml-0 overflow-hidden">
        <HeaderAdmin />

        <!-- Content -->
        <main class="bg-[#EFEFEF] flex-1 flex flex-col p-3 overflow-hidden">
          <div
            class="bg-white rounded-lg shadow-md p-5 flex-1 flex flex-col overflow-y-auto"
          >
            <!-- Content goes here -->
            <!-- Toolbar -->
            <div
              class="flex items-center gap-3 pb-4 border-b shrink-0 flex-none justify-end"
            >
              <!-- Search Input with Icon Inside -->
              <div class="relative flex min-w-56">
                <MagnifyingGlassIcon
                  class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                />
                <input
                  v-model="searchQuery"
                  @input="currentPage = 1"
                  type="text"
                  placeholder="Cari..."
                  class="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <!-- Filter Button -->
              <button
                @click="openFilter"
                class="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition text-sm"
              >
                <Bars3BottomLeftIcon class="w-4 h-4" />
                <span>Filter</span>
              </button>

              <!-- Export Button -->
              <button
                class="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition text-sm"
              >
                <ArrowUpTrayIcon class="w-4 h-4" />
                <span>Export</span>
              </button>

              <!-- Delete Button -->
              <button
                :disabled="selectedRowIds.length === 0"
                class="flex items-center gap-2 px-3 py-2 rounded-md transition text-sm"
                :class="
                  selectedRowIds.length > 0
                    ? 'bg-red-100 text-red-700 border border-red-300 hover:bg-red-200'
                    : 'bg-gray-100 text-gray-400 border border-gray-300 cursor-not-allowed'
                "
              >
                <TrashIcon class="w-4 h-4" />
                <span>Hapus</span>
              </button>
            </div>
            <!-- Tabel -->
            <div
              class="flex-1 flex flex-col gap-4 bg-gray-50 p-1 rounded-lg border border-gray-200 overflow-hidden"
            >
              <div
                class="overflow-x-auto overflow-y-auto rounded-lg border bg-white max-h-105"
              >
                <table class="w-full border-collapse">
                  <thead>
                    <tr class="border-b-2 border-gray-400 bg-gray-50">
                      <th
                        rowspan="2"
                        class="px-4 py-3 text-center font-semibold text-gray-700 whitespace-nowrap min-w-12 border-r border-gray-300"
                      >
                        <div class="relative w-5 h-5">
                          <input
                            type="checkbox"
                            :checked="selectAllChecked"
                            @change="toggleSelectAll"
                            class="w-5 h-5 cursor-pointer rounded-md border-2 appearance-none bg-white border-gray-600 checked:bg-blue-500 checked:border-blue-500"
                            style="
                              appearance: none;
                              -webkit-appearance: none;
                              -moz-appearance: none;
                            "
                            title="Pilih semua / Batal pilih semua"
                          />
                          <!-- Check Icon -->
                          <CheckIcon
                            v-if="selectAllChecked"
                            class="absolute inset-0 m-auto w-3.5 h-3.5 text-white pointer-events-none"
                          />
                        </div>
                      </th>
                      <th
                        rowspan="2"
                        class="px-4 py-3 text-center text-sm font-semibold text-gray-700 whitespace-nowrap min-w-24 border-r border-gray-300"
                      >
                        Nomor Tiket
                      </th>
                      <th
                        rowspan="2"
                        class="px-4 py-3 text-center text-sm font-semibold text-gray-700 whitespace-nowrap min-w-28 border-r border-gray-300"
                      >
                        NIK
                      </th>
                      <th
                        rowspan="2"
                        class="px-4 py-3 text-center text-sm font-semibold text-gray-700 whitespace-nowrap min-w-28 border-r border-gray-300"
                      >
                        Nama
                      </th>
                      <th
                        rowspan="2"
                        class="px-4 py-3 text-center text-sm font-semibold text-gray-700 whitespace-nowrap min-w-32 border-r border-gray-300"
                      >
                        Email
                      </th>
                      <th
                        rowspan="2"
                        class="px-4 py-3 text-center text-sm font-semibold text-gray-700 whitespace-nowrap min-w-24 border-r border-gray-300"
                      >
                        Departemen
                      </th>
                      <th
                        rowspan="2"
                        class="px-4 py-3 text-center text-sm font-semibold text-gray-700 whitespace-nowrap min-w-24 border-r border-gray-300"
                      >
                        Lokasi
                      </th>
                      <th
                        rowspan="2"
                        class="px-4 py-3 text-center text-sm font-semibold text-gray-700 whitespace-nowrap min-w-20 border-r border-gray-300"
                      >
                        Keperluan
                      </th>
                      <th
                        rowspan="2"
                        class="px-4 py-3 text-center text-sm font-semibold text-gray-700 whitespace-nowrap min-w-20 border-r border-gray-300"
                      >
                        Layanan
                      </th>
                      <th
                        rowspan="2"
                        class="px-4 py-3 text-center text-sm font-semibold text-gray-700 whitespace-nowrap min-w-40 border-r border-gray-300"
                      >
                        Waktu Peminjaman
                      </th>
                      <th
                        rowspan="2"
                        class="px-4 py-3 text-center text-sm font-semibold text-gray-700 whitespace-nowrap min-w-40 border-r border-gray-300"
                      >
                        Waktu Selesai
                      </th>
                      <th
                        colspan="4"
                        class="px-4 py-3 text-center text-sm font-semibold text-gray-700 whitespace-nowrap min-w-full border-b border-gray-300 border-r"
                      >
                        Persetujuan
                      </th>
                      <th
                        rowspan="2"
                        class="px-4 py-3 text-center text-sm font-semibold text-gray-700 whitespace-nowrap min-w-16"
                      >
                        Edit
                      </th>
                    </tr>
                    <tr class="border-b-2 border-gray-400 bg-gray-50">
                      <th
                        class="px-4 py-3 text-center text-sm font-semibold text-gray-700 whitespace-nowrap min-w-20 border-r border-gray-300"
                      >
                        Head
                      </th>
                      <th
                        class="px-4 py-3 text-center text-sm font-semibold text-gray-700 whitespace-nowrap min-w-24 border-r border-gray-300"
                      >
                        Transportasi
                      </th>
                      <th
                        class="px-4 py-3 text-center text-sm font-semibold text-gray-700 whitespace-nowrap min-w-20 border-r border-gray-300"
                      >
                        GA
                      </th>
                      <th
                        class="px-4 py-3 text-center text-sm font-semibold text-gray-700 whitespace-nowrap min-w-20 border-r border-gray-300"
                      >
                        GS
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="row in paginatedData"
                      :key="row.id"
                      class="border-b border-gray-200 hover:bg-gray-50 transition cursor-pointer"
                      :class="{ 'bg-blue-50': isRowSelected(row.id) }"
                    >
                      <td
                        class="px-4 py-3 whitespace-nowrap min-w-12 text-center border-r border-gray-300"
                      >
                        <div class="relative w-5 h-5 mx-auto">
                          <input
                            type="checkbox"
                            :checked="isRowSelected(row.id)"
                            @change="selectRow(row.id)"
                            @click.stop
                            class="w-5 h-5 cursor-pointer rounded-md border-2 appearance-none bg-white border-gray-600 checked:bg-blue-500 checked:border-blue-500"
                          />
                          <!-- Check Icon -->
                          <CheckIcon
                            v-if="isRowSelected(row.id)"
                            class="absolute inset-0 m-auto w-3.5 h-3.5 text-white pointer-events-none"
                          />
                        </div>
                      </td>
                      <td
                        class="px-4 py-3 text-gray-800 text-xs font-medium whitespace-nowrap min-w-24 text-center border-r border-gray-300"
                      >
                        {{ row.nomorTiket }}
                      </td>
                      <td
                        class="px-4 py-3 text-gray-800 text-xs font-medium whitespace-nowrap min-w-28 text-center border-r border-gray-300"
                      >
                        {{ row.nik }}
                      </td>
                      <td
                        class="px-4 py-3 text-gray-800 text-xs font-medium whitespace-nowrap min-w-28 text-center border-r border-gray-300"
                      >
                        {{ row.nama }}
                      </td>
                      <td
                        class="px-4 py-3 text-gray-800 text-xs font-medium whitespace-nowrap min-w-32 text-center border-r border-gray-300"
                      >
                        {{ row.email }}
                      </td>
                      <td
                        class="px-4 py-3 text-gray-800 text-xs font-medium whitespace-nowrap min-w-24 text-center border-r border-gray-300"
                      >
                        {{ row.departemen }}
                      </td>
                      <td
                        class="px-4 py-3 text-gray-800 text-xs font-medium whitespace-nowrap min-w-24 text-center border-r border-gray-300"
                      >
                        <span
                          class="px-2 py-1 rounded-md text-xs font-semibold"
                          :class="
                            row.lokasi === 'Desabinaan'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-blue-100 text-blue-700'
                          "
                        >
                          {{ row.lokasi }}
                        </span>
                      </td>
                      <td
                        class="px-4 py-3 text-gray-800 text-xs font-medium whitespace-nowrap min-w-20 text-center border-r border-gray-300"
                      >
                        <span
                          class="px-2 py-1 rounded-md text-xs font-semibold"
                          :class="
                            row.keperluan === 'Dinas'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-green-100 text-green-700'
                          "
                        >
                          {{ row.keperluan }}
                        </span>
                      </td>
                      <td
                        class="px-4 py-3 text-gray-800 text-xs font-medium whitespace-nowrap min-w-20 text-center border-r border-gray-300"
                      >
                        <span
                          class="px-2 py-1 rounded-md text-xs font-semibold"
                          :class="
                            row.layanan === 'Izin Khusus Kendaraan operasional'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-green-100 text-green-700'
                          "
                        >
                          {{ row.layanan }}
                        </span>
                      </td>
                      <td
                        class="px-4 py-3 text-gray-800 text-xs font-medium whitespace-nowrap min-w-40 text-center border-r border-gray-300"
                      >
                        {{ row.waktuPeminjaman }}
                      </td>
                      <td
                        class="px-4 py-3 text-gray-800 text-xs font-medium whitespace-nowrap min-w-40 text-center border-r border-gray-300"
                      >
                        {{ row.waktuSelesai }}
                      </td>
                      <td
                        class="px-4 py-3 whitespace-nowrap min-w-20 text-center border-r border-gray-300"
                      >
                        <div class="flex items-center justify-center gap-2">
                          <button
                            @click="row.headApproval = true"
                            :class="[
                              'p-1.5 rounded-lg transition border-2',
                              row.headApproval
                                ? 'text-green-500 bg-green-100 border-green-500'
                                : 'text-gray-400 hover:text-green-500 border-gray-300 hover:border-green-400',
                            ]"
                            title="Approve"
                          >
                            <CheckCircleIcon class="w-6 h-6" />
                          </button>
                          <button
                            @click="row.headApproval = false"
                            :class="[
                              'p-1.5 rounded-lg transition border-2',
                              !row.headApproval
                                ? 'text-red-500 bg-red-100 border-red-500'
                                : 'text-gray-400 hover:text-red-500 border-gray-300 hover:border-red-400',
                            ]"
                            title="Decline"
                          >
                            <XCircleIcon class="w-6 h-6" />
                          </button>
                        </div>
                      </td>
                      <td
                        class="px-4 py-3 whitespace-nowrap min-w-24 text-center border-r border-gray-300"
                      >
                        <div class="flex items-center justify-center gap-2">
                          <button
                            @click="row.transApproval = true"
                            :class="[
                              'p-1.5 rounded-lg transition border-2',
                              row.transApproval
                                ? 'text-green-500 bg-green-100 border-green-500'
                                : 'text-gray-400 hover:text-green-500 border-gray-300 hover:border-green-400',
                            ]"
                            title="Approve"
                          >
                            <CheckCircleIcon class="w-6 h-6" />
                          </button>
                          <button
                            @click="row.transApproval = false"
                            :class="[
                              'p-1.5 rounded-lg transition border-2',
                              !row.transApproval
                                ? 'text-red-500 bg-red-100 border-red-500'
                                : 'text-gray-400 hover:text-red-500 border-gray-300 hover:border-red-400',
                            ]"
                            title="Decline"
                          >
                            <XCircleIcon class="w-6 h-6" />
                          </button>
                        </div>
                      </td>
                      <td
                        class="px-4 py-3 whitespace-nowrap min-w-20 text-center border-r border-gray-300"
                      >
                        <div class="flex items-center justify-center gap-2">
                          <button
                            @click="row.gaApproval = true"
                            :class="[
                              'p-1.5 rounded-lg transition border-2',
                              row.gaApproval
                                ? 'text-green-500 bg-green-100 border-green-500'
                                : 'text-gray-400 hover:text-green-500 border-gray-300 hover:border-green-400',
                            ]"
                            title="Approve"
                          >
                            <CheckCircleIcon class="w-6 h-6" />
                          </button>
                          <button
                            @click="row.gaApproval = false"
                            :class="[
                              'p-1.5 rounded-lg transition border-2',
                              !row.gaApproval
                                ? 'text-red-500 bg-red-100 border-red-500'
                                : 'text-gray-400 hover:text-red-500 border-gray-300 hover:border-red-400',
                            ]"
                            title="Decline"
                          >
                            <XCircleIcon class="w-6 h-6" />
                          </button>
                        </div>
                      </td>
                      <td
                        class="px-4 py-3 whitespace-nowrap min-w-20 text-center border-r border-gray-300"
                      >
                        <div class="flex items-center justify-center gap-2">
                          <button
                            @click="row.gsApproval = true"
                            :class="[
                              'p-1.5 rounded-lg transition border-2',
                              row.gsApproval
                                ? 'text-green-500 bg-green-100 border-green-500'
                                : 'text-gray-400 hover:text-green-500 border-gray-300 hover:border-green-400',
                            ]"
                            title="Approve"
                          >
                            <CheckCircleIcon class="w-6 h-6" />
                          </button>
                          <button
                            @click="row.gsApproval = false"
                            :class="[
                              'p-1.5 rounded-lg transition border-2',
                              !row.gsApproval
                                ? 'text-red-500 bg-red-100 border-red-500'
                                : 'text-gray-400 hover:text-red-500 border-gray-300 hover:border-red-400',
                            ]"
                            title="Decline"
                          >
                            <XCircleIcon class="w-6 h-6" />
                          </button>
                        </div>
                      </td>
                      <td
                        class="px-4 py-3 whitespace-nowrap min-w-16 text-center"
                      >
                        <button
                          @click="handleEdit(row.id)"
                          class="p-2 text-gray-600 rounded-md hover:bg-blue-200 transition"
                          title="Edit"
                        >
                          <PencilSquareIcon class="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Pagination -->
              <div
                class="flex flex-col md:flex-row justify-between md:justify-end items-center gap-3 md:gap-4 pt-3 md:pt-4 border-t border-gray-200"
              >
                <span
                  class="text-xs md:text-sm text-gray-700 font-medium order-2 md:order-1"
                >
                  {{ startIndex }} - {{ endIndex }} of
                  {{ filteredTableData.length }}
                </span>
                <div class="flex gap-2 order-1 md:order-2">
                  <button
                    @click="previousPage"
                    :disabled="currentPage === 1"
                    class="px-2 md:px-3 py-1 md:py-2 border border-gray-300 rounded-md text-gray-700 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
                  >
                    &lt;
                  </button>
                  <button
                    @click="nextPage"
                    :disabled="currentPage === totalPages"
                    class="px-2 md:px-3 py-1 md:py-2 border border-gray-300 rounded-md text-gray-700 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
                  >
                    &gt;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>
