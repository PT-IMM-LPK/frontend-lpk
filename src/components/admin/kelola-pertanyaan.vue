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
  PencilIcon,
  ChevronDownIcon,
} from "@heroicons/vue/24/outline";

// Reactive state
const isMobileMenuOpen = ref(false);
const isSidebarOpen = ref(false);
const tambahPertanyaan = ref(false);
const editPertanyaan = ref(false);
const pertanyaanYangDiedit = ref(null);
const formPertanyaan = ref("");
const formEditPertanyaan = ref("");
const formJawabanList = ref([
  {
    id: Date.now(),
    tipe: "text",
    nama_jawaban: "",
    jawaban_text: "",
    jawaban_date: "",
    pilihan_list: [""],
  },
]);
const formEditJawabanList = ref([]);

// Daftar pertanyaan (contoh data)
const pertanyaanList = ref([
  {
    id: 1,
    pertanyaan: "Contoh Pertanyaan 1",
    jawaban: [
      {
        id: 1,
        nama_jawaban: "Nama Lengkap",
        tipe: "text",
        jawaban_text: "",
        jawaban_date: "",
        pilihan_list: [],
      },
      {
        id: 2,
        nama_jawaban: "Jenis Kelamin",
        tipe: "multiple",
        jawaban_text: "",
        jawaban_date: "",
        pilihan_list: ["Laki-laki", "Perempuan"],
      },
    ],
  },
]);

// Functions
const opentambahPertanyaan = () => {
  tambahPertanyaan.value = true;
  // Reset form
  formPertanyaan.value = "";
  formJawabanList.value = [
    {
      id: Date.now(),
      tipe: "text",
      nama_jawaban: "",
      jawaban_text: "",
      jawaban_date: "",
      pilihan_list: [""],
    },
  ];
};

const closetambahPertanyaan = () => {
  tambahPertanyaan.value = false;
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeSidebar = () => {
  isSidebarOpen.value = false;
};

const tambahKontainerPertanyaan = () => {
  formJawabanList.value.push({
    id: Date.now() + Math.random(),
    tipe: "text",
    nama_jawaban: "",
    jawaban_text: "",
    jawaban_date: "",
    pilihan_list: [""],
  });
};

const openEditPertanyaan = (pertanyaan) => {
  editPertanyaan.value = true;
  pertanyaanYangDiedit.value = pertanyaan;

  // Isi form edit dengan data pertanyaan yang dipilih
  formEditPertanyaan.value = pertanyaan.pertanyaan;

  // Clone jawaban ke form edit dengan struktur yang benar
  formEditJawabanList.value = pertanyaan.jawaban.map((jawab) => ({
    id: jawab.id || Date.now() + Math.random(),
    tipe: jawab.tipe || "text",
    nama_jawaban: jawab.nama_jawaban || "",
    jawaban_text: jawab.jawaban_text || "",
    jawaban_date: jawab.jawaban_date || "",
    pilihan_list: jawab.pilihan_list || [""],
  }));
};

const closeEditPertanyaan = () => {
  editPertanyaan.value = false;
  pertanyaanYangDiedit.value = null;
};

const tambahKontainerEditJawaban = () => {
  formEditJawabanList.value.push({
    id: Date.now() + Math.random(),
    tipe: "text",
    nama_jawaban: "",
    jawaban_text: "",
    jawaban_date: "",
    pilihan_list: [""],
  });
};

const simpanEditPertanyaan = () => {
  // Validasi
  if (!formEditPertanyaan.value.trim()) {
    alert("Pertanyaan tidak boleh kosong!");
    return;
  }

  // Update pertanyaan di list
  const index = pertanyaanList.value.findIndex(
    (p) => p.id === pertanyaanYangDiedit.value.id,
  );

  if (index > -1) {
    pertanyaanList.value[index] = {
      ...pertanyaanYangDiedit.value,
      pertanyaan: formEditPertanyaan.value,
      jawaban: formEditJawabanList.value.map((form) => ({
        id: form.id,
        nama_jawaban: form.nama_jawaban,
        tipe: form.tipe,
        jawaban_text: form.jawaban_text,
        jawaban_date: form.jawaban_date,
        pilihan_list:
          form.tipe === "multiple"
            ? form.pilihan_list.filter((o) => o.trim())
            : [],
      })),
    };
  }

  closeEditPertanyaan();
  alert("Pertanyaan berhasil diupdate!");
};

const hapusPertanyaan = (pertanyaan) => {
  if (confirm("Apakah Anda yakin ingin menghapus pertanyaan ini?")) {
    const index = pertanyaanList.value.findIndex((p) => p.id === pertanyaan.id);
    if (index > -1) {
      pertanyaanList.value.splice(index, 1);
    }
  }
};

const simpanPertanyaan = () => {
  // Validasi
  if (!formPertanyaan.value.trim()) {
    alert("Pertanyaan tidak boleh kosong!");
    return;
  }

  // Validasi jawaban
  for (let i = 0; i < formJawabanList.value.length; i++) {
    const form = formJawabanList.value[i];
    if (form.tipe === "text" && !form.jawaban_text.trim()) {
      alert(`Jawaban ${i + 1} tidak boleh kosong!`);
      return;
    }
    if (form.tipe === "date" && !form.jawaban_date) {
      alert(`Jawaban ${i + 1} harus memilih tanggal!`);
      return;
    }
    if (form.tipe === "multiple") {
      const validOptions = form.pilihan_list.filter((opt) => opt.trim());
      if (validOptions.length === 0) {
        alert(`Jawaban ${i + 1} harus memiliki minimal 1 opsi!`);
        return;
      }
    }
  }

  // Simpan pertanyaan baru
  const newPertanyaan = {
    id: Date.now(),
    pertanyaan: formPertanyaan.value,
    jawaban: formJawabanList.value.map((form) => ({
      id: form.id,
      nama_jawaban: form.nama_jawaban,
      tipe: form.tipe,
      jawaban_text: form.jawaban_text,
      jawaban_date: form.jawaban_date,
      pilihan_list:
        form.tipe === "multiple"
          ? form.pilihan_list.filter((o) => o.trim())
          : [],
    })),
  };

  pertanyaanList.value.push(newPertanyaan);
  closetambahPertanyaan();
  alert("Pertanyaan berhasil ditambahkan!");
};

provide("isMobileMenuOpen", isMobileMenuOpen);
provide("toggleMobileMenu", toggleMobileMenu);
</script>

<template>
  <div class="h-screen flex flex-col font-['Montserrat']">
    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar -->
      <Aside />

      <!-- Main Content -->
      <div class="flex flex-col flex-1 min-w-0 overflow-hidden">
        <HeaderAdmin />

        <main class="bg-[#EFEFEF] flex-1 flex flex-col p-3 overflow-hidden">
          <div
            class="bg-white rounded-lg shadow-md p-5 flex-1 flex flex-col overflow-hidden min-h-0"
          >
            <!-- HEADER (BUTTON AREA) -->
            <div class="flex items-center gap-3 border-b pb-3 shrink-0">
              <button
                @click="opentambahPertanyaan"
                class="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-white bg-[#6444C6] hover:bg-[#5c3db8] transition text-sm"
              >
                <PlusIcon class="w-5 h-5" />
                <span>Tambah Pertanyaan</span>
              </button>
            </div>

            <!-- CONTENT BOX (DI BAWAH BUTTON) -->
            <div
              class="flex-1 flex flex-col w-full bg-gray-50 rounded-lg border border-gray-200 min-h-0 overflow-hidden mt-4"
            >
              <div
                class="flex-1 flex flex-col gap-4 overflow-y-auto p-4 min-h-0"
              >
                <!-- Konten Pertanyaan -->
                <div
                  v-for="pertanyaan in pertanyaanList"
                  :key="pertanyaan.id"
                  class="flex flex-col w-full bg-white rounded-lg border border-gray-200 shrink-0"
                >
                  <div class="px-4 pb-4">
                    <div class="flex justify-between items-center mb-2 mt-4">
                      <label class="text-lg font-bold text-black"
                        >Pertanyaan</label
                      >
                      <div class="flex items-center gap-3">
                        <button
                          @click="openEditPertanyaan(pertanyaan)"
                          class="px-4 md:px-6 py-2 text-sm bg-linear-to-r from-[#A90CF8] to-[#9600E1] text-white rounded-xl hover:opacity-90 transition"
                        >
                          Edit
                        </button>
                        <button
                          @click="hapusPertanyaan(pertanyaan)"
                          class="px-4 md:px-6 py-2 text-sm bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>

                    <!-- Kolom Pertanyaan -->
                    <input
                      type="text"
                      :value="pertanyaan.pertanyaan"
                      disabled
                      class="cursor-not-allowed w-full p-2 border border-[#C3C3C3] bg-gray-100 text-gray-700 rounded-md text-sm mb-4"
                    />
                    <label class="block text-lg font-bold text-gray-800 mb-2">
                      Jawaban
                    </label>
                    <div class="space-y-3">
                      <div
                        v-for="(jawab, idx) in pertanyaan.jawaban"
                        :key="idx"
                        class="grid grid-cols-2 gap-4"
                      >
                        <!-- Kiri: Nama Jawaban -->
                        <div class="relative">
                          <input
                            type="text"
                            :value="jawab.nama_jawaban"
                            disabled
                            class="cursor-not-allowed w-full p-2 border border-[#C3C3C3] bg-gray-100 text-gray-800 rounded-md text-sm"
                          />
                        </div>

                        <!-- Kanan: Tipe Jawaban -->
                        <div class="relative">
                          <input
                            type="text"
                            :value="
                              jawab.tipe === 'text'
                                ? 'Input Text'
                                : jawab.tipe === 'date'
                                  ? 'Date'
                                  : 'Multiple Choice'
                            "
                            disabled
                            class="cursor-not-allowed w-full p-2 border border-[#C3C3C3] bg-gray-100 text-gray-700 rounded-md text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Empty state -->
                <div
                  v-if="pertanyaanList.length === 0"
                  class="flex flex-col items-center justify-center py-12 text-gray-500"
                >
                  <MagnifyingGlassIcon class="w-16 h-16 mb-4 text-gray-300" />
                  <p class="text-lg">Belum ada pertanyaan</p>
                  <p class="text-sm">
                    Klik tombol "Tambah Pertanyaan" untuk membuat pertanyaan
                    baru
                  </p>
                </div>
              </div>
            </div>

            <!-- Modal Tambah Pertanyaan -->
            <div
              v-if="tambahPertanyaan"
              class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
              @click.self="closetambahPertanyaan"
            >
              <div
                class="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-[0_4px_6px_rgba(0,0,0,0.1)] p-6 md:p-8"
              >
                <div
                  class="flex justify-between items-center mb-4 pb-3 border-b border-gray-300"
                >
                  <h2 class="text-lg md:text-xl font-semibold text-gray-900">
                    Tambah Pertanyaan
                  </h2>
                  <button
                    @click="closetambahPertanyaan"
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
                    >Pertanyaan</label
                  >
                  <div class="relative mb-6">
                    <input
                      type="text"
                      v-model="formPertanyaan"
                      placeholder="Masukkan pertanyaan"
                      class="w-full p-2 text-sm border border-[#C3C3C3] bg-white text-gray-700 rounded-sm focus:outline-none focus:border-[#A90CF8]"
                    />
                    <PencilIcon
                      class="absolute right-3 top-2.5 w-5 h-5 text-[#C3C3C3]"
                    />
                  </div>

                  <label class="block text-base font-medium text-black mb-2">
                    Kolom Jawaban
                  </label>

                  <div class="space-y-4">
                    <div
                      v-for="(form, index) in formJawabanList"
                      :key="form.id"
                      class="p-4 border border-gray-200 rounded-lg bg-gray-50"
                    >
                      <!-- Header -->
                      <div class="flex justify-between items-center mb-4">
                        <h3 class="font-semibold text-gray-700">
                          Jawaban {{ index + 1 }}
                        </h3>
                        <button
                          v-if="formJawabanList.length > 1"
                          @click="formJawabanList.splice(index, 1)"
                          class="text-red-600 hover:text-red-800 transition"
                        >
                          <TrashIcon class="w-5 h-5" />
                        </button>
                      </div>

                      <!-- GRID INPUT -->
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- KIRI: Nama Jawaban -->
                        <div>
                          <label
                            class="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Nama Jawaban
                          </label>
                          <input
                            type="text"
                            v-model="form.nama_jawaban"
                            placeholder="Contoh: Nama Lengkap, Tanggal Lahir, dll"
                            class="w-full p-2 border text-black border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#A90CF8]"
                          />
                        </div>

                        <!-- KANAN: PILIH TIPE -->
                        <div>
                          <label
                            class="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Tipe Jawaban
                          </label>
                          <div class="relative">
                            <select
                              v-model="form.tipe"
                              class="w-full p-2 pr-10 border border-gray-300 bg-white text-gray-700 rounded-md text-sm appearance-none focus:outline-none focus:border-[#A90CF8]"
                            >
                              <option value="text">Input Text</option>
                              <option value="multiple">Multiple Choice</option>
                              <option value="date">Date</option>
                            </select>
                            <ChevronDownIcon
                              class="absolute right-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none"
                            />
                          </div>
                        </div>
                      </div>

                      <!-- Multiple Choice Options (jika tipe multiple) -->
                      <div v-if="form.tipe === 'multiple'" class="mt-4">
                        <label
                          class="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Pilihan
                        </label>
                        <div class="space-y-2">
                          <div
                            v-for="(opt, i) in form.pilihan_list"
                            :key="i"
                            class="flex gap-2"
                          >
                            <input
                              type="text"
                              v-model="form.pilihan_list[i]"
                              placeholder="Masukkan pilihan"
                              class="flex-1 p-2 border text-black border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#A90CF8]"
                            />
                            <button
                              @click="form.pilihan_list.splice(i, 1)"
                              v-if="form.pilihan_list.length > 1"
                              class="text-red-500 hover:text-red-700 px-2"
                            >
                              ✕
                            </button>
                          </div>

                          <button
                            @click="form.pilihan_list.push('')"
                            class="text-sm text-blue-600 hover:underline"
                          >
                            + Tambah pilihan
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Tambah Jawaban Baru -->
                  <div class="flex justify-center gap-4 mt-6">
                    <button
                      @click="tambahKontainerPertanyaan"
                      class="flex items-center gap-2 px-10 py-2 text-sm border border-blue-300 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition"
                    >
                      <PlusIcon class="w-5 h-5" />
                      Tambah Jawaban
                    </button>

                    <button
                      @click="simpanPertanyaan"
                      class="flex items-center gap-2 px-10 py-2 text-sm bg-linear-to-r from-[#A90CF8] to-[#9600E1] text-white rounded-xl hover:opacity-90 transition"
                    >
                      <CheckIcon class="w-5 h-5" />
                      Simpan Pertanyaan
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Modal Edit Pertanyaan -->
            <div
              v-if="editPertanyaan"
              class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
              @click.self="closeEditPertanyaan"
            >
              <div
                class="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-[0_4px_6px_rgba(0,0,0,0.1)] p-6 md:p-8"
              >
                <div
                  class="flex justify-between items-center mb-4 pb-3 border-b border-gray-300"
                >
                  <h2 class="text-lg md:text-xl font-semibold text-gray-900">
                    Edit Pertanyaan
                  </h2>
                  <button
                    @click="closeEditPertanyaan"
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
                    >Pertanyaan</label
                  >
                  <div class="relative mb-6">
                    <input
                      type="text"
                      v-model="formEditPertanyaan"
                      placeholder="Masukkan pertanyaan"
                      class="w-full p-2 text-sm border border-[#C3C3C3] bg-white text-gray-700 rounded-sm focus:outline-none focus:border-[#A90CF8]"
                    />
                    <PencilIcon
                      class="absolute right-3 top-2.5 w-5 h-5 text-[#C3C3C3]"
                    />
                  </div>

                  <label class="block text-base font-medium text-black mb-2">
                    Kolom Jawaban
                  </label>

                  <div class="space-y-4">
                    <div
                      v-for="(form, index) in formEditJawabanList"
                      :key="form.id"
                      class="p-4 border border-gray-200 rounded-lg bg-gray-50"
                    >
                      <!-- Header -->
                      <div class="flex justify-between items-center mb-4">
                        <h3 class="font-semibold text-gray-700">
                          Jawaban {{ index + 1 }}
                        </h3>
                        <button
                          v-if="formEditJawabanList.length > 1"
                          @click="formEditJawabanList.splice(index, 1)"
                          class="text-red-600 hover:text-red-800 transition"
                        >
                          <TrashIcon class="w-5 h-5" />
                        </button>
                      </div>

                      <!-- GRID INPUT -->
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- KIRI: Nama Jawaban -->
                        <div>
                          <label
                            class="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Nama Jawaban
                          </label>
                          <input
                            type="text"
                            v-model="form.nama_jawaban"
                            placeholder="Contoh: Nama Lengkap, Tanggal Lahir, dll"
                            class="w-full p-2 border text-black border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#A90CF8]"
                          />
                        </div>

                        <!-- KANAN: PILIH TIPE -->
                        <div>
                          <label
                            class="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Tipe Jawaban
                          </label>
                          <div class="relative">
                            <select
                              v-model="form.tipe"
                              class="w-full p-2 pr-10 border border-gray-300 bg-white text-gray-700 rounded-md text-sm appearance-none focus:outline-none focus:border-[#A90CF8]"
                            >
                              <option value="text">Input Text</option>
                              <option value="multiple">Multiple Choice</option>
                              <option value="date">Date</option>
                            </select>
                            <ChevronDownIcon
                              class="absolute right-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none"
                            />
                          </div>
                        </div>
                      </div>

                      <!-- Multiple Choice Options (jika tipe multiple) -->
                      <div v-if="form.tipe === 'multiple'" class="mt-4">
                        <label
                          class="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Pilihan
                        </label>
                        <div class="space-y-2">
                          <div
                            v-for="(opt, i) in form.pilihan_list"
                            :key="i"
                            class="flex gap-2"
                          >
                            <input
                              type="text"
                              v-model="form.pilihan_list[i]"
                              placeholder="Masukkan pilihan"
                              class="flex-1 p-2 border text-black border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#A90CF8]"
                            />
                            <button
                              @click="form.pilihan_list.splice(i, 1)"
                              v-if="form.pilihan_list.length > 1"
                              class="text-red-500 hover:text-red-700 px-2"
                            >
                              ✕
                            </button>
                          </div>

                          <button
                            @click="form.pilihan_list.push('')"
                            class="text-sm text-blue-600 hover:underline"
                          >
                            + Tambah pilihan
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Tambah Jawaban Baru -->
                  <div class="flex justify-center gap-4 mt-6">
                    <button
                      @click="tambahKontainerEditJawaban"
                      class="flex items-center gap-2 px-10 py-2 text-sm border border-blue-300 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition"
                    >
                      <PlusIcon class="w-5 h-5" />
                      Tambah Jawaban
                    </button>

                    <button
                      @click="simpanEditPertanyaan"
                      class="flex items-center gap-2 px-10 py-2 text-sm bg-linear-to-r from-[#A90CF8] to-[#9600E1] text-white rounded-xl hover:opacity-90 transition"
                    >
                      <CheckIcon class="w-5 h-5" />
                      Update Pertanyaan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>
