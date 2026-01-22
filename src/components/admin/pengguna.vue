<script setup>
import { ref, computed, reactive, provide } from "vue";
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
  ChevronDownIcon,
} from "@heroicons/vue/24/outline";
import { PencilIcon } from "@heroicons/vue/24/solid";

// --- STATE ---
const isMobileMenuOpen = ref(false);
const selectedRowIds = ref([]);
const selectAllChecked = ref(false);
const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = 10;
const showTambahPengguna = ref(false);
const showEditPengguna = ref(false);
const sortOrder = ref("asc");
const loading = ref(false); // Indikator loading

// State untuk Form Input (Create & Update)
const formData = reactive({
  id: null,
  nama: "",
  nomorTelepon: "",
  tanggalLahir: "",
  departemen: "",
  role: "",
});

// Data Utama (Mock Data untuk testing)
const tableData = ref([
  { id: 1, namaPengguna: "Budi Santoso", nomorTelepon: "082123456789", tanggalLahir: "1990-05-15", departemen: "IT", role: "Admin" },
  { id: 2, namaPengguna: "Siti Nurhaliza", nomorTelepon: "085987654321", tanggalLahir: "1992-08-22", departemen: "HR", role: "User" },
]);

// Counter untuk ID baru
let idCounter = 6;

// --- LOCAL ACTIONS ---
// 1. Tambah Pengguna
const submitTambah = () => {
  if (!formData.nama.trim()) return alert("Nama Pengguna tidak boleh kosong");
  if (!formData.nomorTelepon.trim()) return alert("Nomor Telepon tidak boleh kosong");
  if (!formData.tanggalLahir) return alert("Tanggal Lahir tidak boleh kosong");
  if (!formData.departemen.trim()) return alert("Departemen tidak boleh kosong");
  if (!formData.role.trim()) return alert("Role tidak boleh kosong");
  
  tableData.value.push({
    id: idCounter++,
    namaPengguna: formData.nama,
    nomorTelepon: formData.nomorTelepon,
    tanggalLahir: formData.tanggalLahir,
    departemen: formData.departemen,
    role: formData.role,
  });
  
  alert("Pengguna berhasil ditambahkan");
  closeTambahPengguna();
};

// 2. Update Pengguna
const submitEdit = () => {
  if (!formData.nama.trim()) return alert("Nama Pengguna tidak boleh kosong");
  if (!formData.nomorTelepon.trim()) return alert("Nomor Telepon tidak boleh kosong");
  if (!formData.tanggalLahir) return alert("Tanggal Lahir tidak boleh kosong");
  if (!formData.departemen.trim()) return alert("Departemen tidak boleh kosong");
  if (!formData.role.trim()) return alert("Role tidak boleh kosong");

  const index = tableData.value.findIndex((item) => item.id === formData.id);
  if (index > -1) {
    tableData.value[index].namaPengguna = formData.nama;
    tableData.value[index].nomorTelepon = formData.nomorTelepon;
    tableData.value[index].tanggalLahir = formData.tanggalLahir;
    tableData.value[index].departemen = formData.departemen;
    tableData.value[index].role = formData.role;
  }

  alert("Pengguna berhasil diperbarui");
  closeEditPengguna();
};

// 3. Hapus Pengguna (Bulk Delete)
const handleDeleteSelected = () => {
  if (selectedRowIds.value.length === 0) return;
  if (!confirm(`Hapus ${selectedRowIds.value.length} Pengguna terpilih?`)) return;

  tableData.value = tableData.value.filter(
    (item) => !selectedRowIds.value.includes(item.id)
  );
  
  alert("Data terpilih berhasil dihapus");
  selectedRowIds.value = [];
  selectAllChecked.value = false;
};

// --- MODAL CONTROLLERS ---

const openTambahPengguna = () => {
  // Reset form
  formData.id = null;
  formData.nama = "";
  formData.nomorTelepon = "";
  formData.tanggalLahir = "";
  formData.departemen = "";
  formData.role = "";
  showTambahPengguna.value = true;
};

const closeTambahPengguna = () => {
  showTambahPengguna.value = false;
};

// Modified: Menerima parameter row untuk mengisi form edit
const openEditPengguna = (row) => {
  formData.id = row.id;
  formData.nama = row.namaPengguna;
  formData.nomorTelepon = row.nomorTelepon;
  formData.tanggalLahir = row.tanggalLahir;
  formData.departemen = row.departemen;
  formData.role = row.role;
  showEditPengguna.value = true;
};

const closeEditPengguna = () => {
  showEditPengguna.value = false;
};

// --- TABLE LOGIC (Existing Logic Preserved) ---

const selectRow = (rowId) => {
  const index = selectedRowIds.value.indexOf(rowId);
  if (index > -1) {
    selectedRowIds.value.splice(index, 1);
  } else {
    selectedRowIds.value.push(rowId);
  }
  selectAllChecked.value =
    selectedRowIds.value.length === tableData.value.length && tableData.value.length > 0;
};

const toggleSelectAll = () => {
  selectAllChecked.value = !selectAllChecked.value;
  if (selectAllChecked.value) {
    selectedRowIds.value = tableData.value.map((row) => row.id);
  } else {
    selectedRowIds.value = [];
  }
};

const isRowSelected = (rowId) => {
  return selectedRowIds.value.includes(rowId);
};

const normalizeString = (str) => {
  return str ? str.toLowerCase().replace(/[\s\-./]/g, "") : "";
};

const filteredTableData = computed(() => {
  if (!searchQuery.value.trim()) {
    return tableData.value;
  }
  const query = normalizeString(searchQuery.value);
  return tableData.value.filter((row) => {
    return normalizeString(row.namaPengguna).includes(query);
  });
});

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredTableData.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredTableData.value.length / itemsPerPage);
});

const startIndex = computed(() => {
  return (currentPage.value - 1) * itemsPerPage + 1;
});

const endIndex = computed(() => {
  return Math.min(
    currentPage.value * itemsPerPage,
    filteredTableData.value.length
  );
});

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

const sortByField = (field) => {
  if (sortOrder.value === "asc") {
    sortOrder.value = "desc";
    tableData.value = [...tableData.value].sort((a, b) => {
      const aVal = a[field] || "";
      const bVal = b[field] || "";
      return bVal.toString().localeCompare(aVal.toString());
    });
  } else {
    sortOrder.value = "asc";
    tableData.value = [...tableData.value].sort((a, b) => {
      const aVal = a[field] || "";
      const bVal = b[field] || "";
      return aVal.toString().localeCompare(bVal.toString());
    });
  }
  currentPage.value = 1;
};

// Lifecycle
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

        <div class="bg-[#EFEFEF] flex-1 flex flex-col p-3 overflow-hidden">
          <div class="bg-white rounded-lg shadow-md p-5 flex-1 flex flex-col overflow-y-auto">
            <!-- Content goes here -->
             <div
              class="flex items-center gap-3 pb-4 border-b shrink-0 flex-none justify-between"
            >
              <div class="flex items-center gap-3">
                <button
                  @click="openTambahPengguna"
                  class="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-white bg-[#6444C6] hover:bg-[#5c3db8] transition text-sm"
                >
                  <PlusIcon class="w-5 h-5" />
                  <span>Tambah Pengguna</span>
                </button>
              </div>

              <div class="flex items-center gap-3">
                <div class="relative flex min-w-56">
                  <MagnifyingGlassIcon
                    class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  />
                  <input
                    v-model="searchQuery"
                    @input="currentPage = 1"
                    type="text"
                    placeholder="Cari nama..."
                    class="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  @click="handleDeleteSelected"
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
            </div>

            <div
              class="flex-1 flex flex-col gap-4 bg-gray-50 p-1 rounded-lg border border-gray-200 overflow-hidden"
            >
              <div
                class="overflow-x-auto overflow-y-auto rounded-lg border bg-white max-h-105"
              >
                <div v-if="loading" class="p-4 text-center text-gray-500">
                  Memuat data...
                </div>

                <table v-else class="w-full border-collapse">
                  <thead>
                    <tr class="border-b-2 border-gray-400 bg-gray-50">
                      <th
                        class="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap w-12"
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
                          />
                          <CheckIcon
                            v-if="selectAllChecked"
                            class="absolute inset-0 m-auto w-4 h-4 text-white pointer-events-none"
                          />
                        </div>
                      </th>
                      <th
                        class="px-4 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap w-20"
                      >
                        No.
                      </th>
                      <th
                        class="px-4 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap cursor-pointer hover:bg-gray-100 transition"
                        @click="sortByField('namaPengguna')"
                      >
                        <div class="flex items-center gap-2">
                          <span>Nama</span>
                          <ArrowDownIcon
                            v-if="sortOrder === 'asc'"
                            class="w-4 h-4"
                          />
                          <ArrowUpIcon v-else class="w-4 h-4" />
                        </div>
                      </th>
                      <th
                        class="px-4 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap cursor-pointer hover:bg-gray-100 transition"
                        @click="sortByField('nomorTelepon')"
                      >
                        <div class="flex items-center gap-2">
                          <span>Nomor Telepon</span>
                        </div>
                      </th>
                      <th
                        class="px-4 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap cursor-pointer hover:bg-gray-100 transition"
                        @click="sortByField('tanggalLahir')"
                      >
                        <div class="flex items-center gap-2">
                          <span>Tanggal Lahir</span>
                        </div>
                      </th>
                      <th
                        class="px-4 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap cursor-pointer hover:bg-gray-100 transition"
                        @click="sortByField('departemen')"
                      >
                        <div class="flex items-center gap-2">
                          <span>Departemen</span>
                        </div>
                      </th>
                      <th
                        class="px-4 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap cursor-pointer hover:bg-gray-100 transition"
                        @click="sortByField('role')"
                      >
                        <div class="flex items-center gap-2">
                          <span>Role</span>
                        </div>
                      </th>
                      <th
                        class="px-4 py-3 text-right text-sm font-semibold text-gray-700 whitespace-nowrap flex-1"
                      >
                        Edit
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(row, index) in paginatedData"
                      :key="row.id"
                      class="border-b border-gray-200 hover:bg-gray-50 transition cursor-pointer"
                      :class="{ 'bg-blue-50': isRowSelected(row.id) }"
                    >
                      <td class="px-4 py-3 whitespace-nowrap w-12">
                        <div class="relative w-5 h-5">
                          <input
                            type="checkbox"
                            :checked="isRowSelected(row.id)"
                            @change="selectRow(row.id)"
                            @click.stop
                            class="w-5 h-5 cursor-pointer rounded-md border-2 appearance-none bg-white border-gray-600 checked:bg-blue-500 checked:border-blue-500"
                            style="
                              appearance: none;
                              -webkit-appearance: none;
                              -moz-appearance: none;
                            "
                          />
                          <CheckIcon
                            v-if="isRowSelected(row.id)"
                            class="absolute inset-0 m-auto w-4 h-4 text-white pointer-events-none"
                          />
                        </div>
                      </td>
                      <td
                        class="px-4 py-3 text-gray-800 text-xs whitespace-nowrap w-20"
                      >
                        {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                      </td>
                      <td
                        class="px-4 py-3 text-gray-800 text-xs whitespace-nowrap"
                      >
                        {{ row.namaPengguna }}
                      </td>
                      <td
                        class="px-4 py-3 text-gray-800 text-xs whitespace-nowrap"
                      >
                        {{ row.nomorTelepon }}
                      </td>
                      <td
                        class="px-4 py-3 text-gray-800 text-xs whitespace-nowrap"
                      >
                        {{ row.tanggalLahir }}
                      </td>
                      <td
                        class="px-4 py-3 text-gray-800 text-xs whitespace-nowrap"
                      >
                        {{ row.departemen }}
                      </td>
                      <td
                        class="px-4 py-3 text-gray-800 text-xs whitespace-nowrap"
                      >
                        {{ row.role }}
                      </td>
                      <td
                        class="px-4 py-3 text-gray-800 text-xs whitespace-nowrap text-right"
                      >
                        <button
                          @click="openEditPengguna(row)"
                          class="p-1 hover:bg-gray-100 rounded transition"
                        >
                          <PencilSquareIcon
                            class="w-4.5 h-4.5 text-black hover:text-blue-800"
                          />
                        </button>
                      </td>
                    </tr>
                    <tr v-if="paginatedData.length === 0 && !loading">
                      <td
                        colspan="8"
                        class="p-4 text-center text-sm text-gray-500"
                      >
                        Tidak ada data ditemukan.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div
                class="flex flex-col md:flex-row justify-between md:justify-end items-center gap-3 md:gap-4 pt-3 md:pt-4 border-t border-gray-200"
              >
                <span
                  class="text-xs md:text-sm text-gray-700 font-medium order-2 md:order-1"
                >
                  {{ filteredTableData.length ? startIndex : 0 }} -
                  {{ endIndex }} of
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
                    :disabled="currentPage === totalPages || totalPages === 0"
                    class="px-2 md:px-3 py-1 md:py-2 border border-gray-300 rounded-md text-gray-700 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
                  >
                    &gt;
                  </button>
                </div>
              </div>
            </div>

            <div
              v-if="showTambahPengguna"
              class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            >
              <div
                class="bg-white rounded-lg w-full max-w-md md:max-w-xl max-h-[90vh] overflow-y-auto shadow-[0_4px_6px_rgba(0,0,0,0.1)] p-6 md:p-8"
              >
                <div
                  class="flex justify-between items-center mb-4 pb-3 border-b border-gray-200"
                >
                  <h2 class="text-lg md:text-xl font-semibold text-gray-900">
                    Tambah Pengguna
                  </h2>
                  <button
                    @click="closeTambahPengguna"
                    class="shrink-0 p-1 hover:bg-gray-100 rounded-md transition"
                  >
                    <XMarkIcon
                      class="w-6 h-6 text-gray-600 hover:text-gray-900"
                    />
                  </button>
                </div>

                <div>
                  <label
                    class="block text-base font-medium text-black mb-2 mt-4"
                    >Nama Pengguna</label
                  >
                  <div class="relative">
                    <input
                      v-model="formData.nama"
                      type="text"
                      placeholder="Nama Pengguna"
                      class="w-full p-2 pr-10 text-sm border border-[#C3C3C3] bg-white text-gray-700 rounded-md focus:outline-none focus:border-[#A90CF8] focus:ring-2 focus:ring-[#A90CF8]/20"
                    />
                    <PencilIcon
                      class="absolute right-3 top-2.5 w-5 h-5 text-[#C3C3C3]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    class="block text-base font-medium text-black mb-2 mt-4"
                    >Nomor Telepon</label
                  >
                  <div class="relative">
                    <input
                      v-model="formData.nomorTelepon"
                      type="text"
                      placeholder="Nomor Telepon"
                      class="w-full p-2 pr-10 text-sm border border-[#C3C3C3] bg-white text-gray-700 rounded-md focus:outline-none focus:border-[#A90CF8] focus:ring-2 focus:ring-[#A90CF8]/20"
                    />
                    <PencilIcon
                      class="absolute right-3 top-2.5 w-5 h-5 text-[#C3C3C3]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    class="block text-base font-medium text-black mb-2 mt-4"
                    >Tanggal Lahir</label
                  >
                  <div class="relative">
                    <input
                      v-model="formData.tanggalLahir"
                      type="date"
                      placeholder="Tanggal Lahir"
                      class="w-full p-2 pr-2 text-sm border border-[#C3C3C3] bg-white text-gray-700 rounded-md focus:outline-none focus:border-[#A90CF8] focus:ring-2 focus:ring-[#A90CF8]/20"
                    />
                  </div>
                </div>

                <div>
                  <label
                    class="block text-base font-medium text-black mb-2 mt-4"
                    >Departemen</label
                  >
                  <div class="relative">
                    <input
                      v-model="formData.departemen"
                      type="text"
                      placeholder="Departemen"
                      class="w-full p-2 pr-10 text-sm border border-[#C3C3C3] bg-white text-gray-700 rounded-md focus:outline-none focus:border-[#A90CF8] focus:ring-2 focus:ring-[#A90CF8]/20"
                    />
                    <PencilIcon
                      class="absolute right-3 top-2.5 w-5 h-5 text-[#C3C3C3]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    class="block text-base font-medium text-black mb-2 mt-4"
                    >Role</label
                  >
                  <div class="relative">
                    <input
                      v-model="formData.role"
                      type="text"
                      placeholder="Role"
                      class="w-full p-2 pr-10 text-sm border border-[#C3C3C3] bg-white text-gray-700 rounded-md focus:outline-none focus:border-[#A90CF8] focus:ring-2 focus:ring-[#A90CF8]/20"
                    />
                    <ChevronDownIcon
                      class="absolute right-3 top-2.5 w-5 h-5 text-[#C3C3C3]"
                    />
                  </div>
                </div>

                <div class="flex justify-end gap-3 mt-6">
                  <button
                    @click="submitTambah"
                    :disabled="loading"
                    class="px-6 md:px-6 py-2 text-sm md:text-sm bg-linear-to-r from-[#A90CF8] to-[#9600E1] text-white rounded-xl hover:opacity-90 transition font-regular disabled:opacity-50"
                  >
                    {{ loading ? "Menyimpan..." : "Tambah Pengguna" }}
                  </button>
                  <button
                    @click="closeTambahPengguna"
                    class="px-6 md:px-6 py-2 text-sm md:text-sm border border-gray-300 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-regular"
                  >
                    Batal
                  </button>
                </div>
              </div>
            </div>

            <div
              v-if="showEditPengguna"
              class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            >
              <div
                class="bg-white rounded-lg w-full max-w-md md:max-w-xl max-h-[90vh] overflow-y-auto shadow-[0_4px_6px_rgba(0,0,0,0.1)] p-6 md:p-8"
              >
                <div
                  class="flex justify-between items-center mb-4 pb-3 border-b border-gray-200"
                >
                  <h2 class="text-lg md:text-xl font-semibold text-gray-900">
                    Edit Pengguna
                  </h2>
                  <button
                    @click="closeEditPengguna"
                    class="shrink-0 p-1 hover:bg-gray-100 rounded-md transition"
                  >
                    <XMarkIcon
                      class="w-6 h-6 text-gray-600 hover:text-gray-900"
                    />
                  </button>
                </div>

                <div>
                  <label
                    class="block text-base font-medium text-black mb-2 mt-4"
                    >Nama Pengguna</label
                  >
                  <div class="relative">
                    <input
                      v-model="formData.nama"
                      type="text"
                      placeholder="Nama Pengguna"
                      class="w-full p-2 pr-10 border text-sm border-[#C3C3C3] bg-white text-gray-700 rounded-md focus:outline-none focus:border-[#A90CF8] focus:ring-2 focus:ring-[#A90CF8]/20"
                    />
                    <PencilSquareIcon
                      class="absolute right-3 top-2.5 w-5 h-5 text-[#C3C3C3]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    class="block text-base font-medium text-black mb-2 mt-4"
                    >Nomor Telepon</label
                  >
                  <div class="relative">
                    <input
                      v-model="formData.nomorTelepon"
                      type="text"
                      placeholder="Nomor Telepon"
                      class="w-full p-2 pr-10 text-sm border border-[#C3C3C3] bg-white text-gray-700 rounded-md focus:outline-none focus:border-[#A90CF8] focus:ring-2 focus:ring-[#A90CF8]/20"
                    />
                    <PencilIcon
                      class="absolute right-3 top-2.5 w-5 h-5 text-[#C3C3C3]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    class="block text-base font-medium text-black mb-2 mt-4"
                    >Tanggal Lahir</label
                  >
                  <div class="relative">
                    <input
                      v-model="formData.tanggalLahir"
                      type="date"
                      placeholder="Tanggal Lahir"
                      class="w-full p-2 pr-2 text-sm border border-[#C3C3C3] bg-white text-gray-700 rounded-md focus:outline-none focus:border-[#A90CF8] focus:ring-2 focus:ring-[#A90CF8]/20"
                    />
                  </div>
                </div>

                <div>
                  <label
                    class="block text-base font-medium text-black mb-2 mt-4"
                    >Departemen</label
                  >
                  <div class="relative">
                    <input
                      v-model="formData.departemen"
                      type="text"
                      placeholder="Departemen"
                      class="w-full p-2 pr-10 text-sm border border-[#C3C3C3] bg-white text-gray-700 rounded-md focus:outline-none focus:border-[#A90CF8] focus:ring-2 focus:ring-[#A90CF8]/20"
                    />
                    <PencilIcon
                      class="absolute right-3 top-2.5 w-5 h-5 text-[#C3C3C3]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    class="block text-base font-medium text-black mb-2 mt-4"
                    >Role</label
                  >
                  <div class="relative">
                    <input
                      v-model="formData.role"
                      type="text"
                      placeholder="Role"
                      class="w-full p-2 pr-10 text-sm border border-[#C3C3C3] bg-white text-gray-700 rounded-md focus:outline-none focus:border-[#A90CF8] focus:ring-2 focus:ring-[#A90CF8]/20"
                    />
                    <ChevronDownIcon
                      class="absolute right-3 top-2.5 w-5 h-5 text-[#C3C3C3]"
                    />
                  </div>
                </div>

                <div class="flex justify-end gap-3 mt-6">
                  <button
                    @click="submitEdit"
                    :disabled="loading"
                    class="px-6 md:px-6 py-2 text-sm md:text-sm bg-linear-to-r from-[#A90CF8] to-[#9600E1] text-white rounded-xl hover:opacity-90 transition font-regular disabled:opacity-50"
                  >
                    {{ loading ? "Menyimpan..." : "Edit Pengguna" }}
                  </button>
                  <button
                    @click="closeEditPengguna"
                    class="px-6 md:px-6 py-2 text-sm md:text-sm border border-gray-300 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-regular"
                  >
                    Batal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>