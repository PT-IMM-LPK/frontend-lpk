<script setup>
import { ref } from 'vue';

const phoneNumber = ref('');
const password = ref('');
</script>

<template>
  <div
    class="w-screen h-screen fixed inset-0 flex items-center justify-center bg-center bg-cover bg-no-repeat"
    style="background-image: url('/image_asset/backgrond.png')"
  >
    <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 border border-gray-100">
      
        <img src="/image_asset/IMM.svg" class="w-32 h-auto block mx-auto" />

        <div class="flex flex-col gap-3 text-center w-full">
          <div class="flex flex-col gap-1 mt-4">
            <p class="text-black text-sm font-bold">
              Layanan Permintaan Kendaraan
            </p>
            <p class="text-black text-sm -mt-1 font-bold">
              Operasional PT Indominco Mandiri
            </p>
          </div>
          
          <div class="flex flex-col gap-4">
            <input 
              id="phone_number"
              v-model="phoneNumber"
              type="tel"
              placeholder="Nomor Handphone"
              autocomplete="tel"
              class="w-full px-4 py-3 border border-gray-300 bg-white rounded-lg text-sm text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
             <input 
              id="phone_number"
              v-model="password"
              type="tel"
              placeholder="Password"
              autocomplete="tel"
              class="w-full px-4 py-3 border border-gray-300 bg-white rounded-lg text-sm text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>
      </div>
    </div>
</template>
