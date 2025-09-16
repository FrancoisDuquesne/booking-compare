<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import { UButton, ImgPreview } from "#components";
import { titleCase } from "scule";

interface Estate {
  url: string;
  name: string;
  price: string;
  rating: string;
  location: string;
  image?: string;
}

// State
const urlInput = ref(
  "https://www.booking.com/hotel/es/villa-samar-altea.fr.html?label=msn-_*ipi4csWbMJFg*Qb30F5w-80608133315299%3Atikwd-80608308434614%3Aloc-14%3Aneo%3Amte%3Alp616%3Adec%3Aqsbooking&aid=2369661&ucfs=1&checkin=2025-12-20&checkout=2025-12-25&dest_id=-406131&dest_type=city&group_adults=7&no_rooms=1&group_children=0&nflt=oos%3D1%3Bprice%3DEUR-350-450-1%3Bht_id%3D220%3Bht_id%3D213%3Bprivacy_type%3D3%3Bht_id%3D228%3Bentire_place_bedroom_count%3D4%3Breview_score%3D90%3Bhotelfacility%3D4&srpvid=af3048ef6f4805e0&srepoch=1757674145&matching_block_id=39659301_414720911_7_0_0&atlas_src=sr_iw_title#map_closed",
);
// "https://www.booking.com/hotel/es/asa-la-marina-by-sh-hoteles.fr.html?label=msn-_*ipi4csWbMJFg*Qb30F5w-80608133315299%3Atikwd-80608308434614%3Aloc-14%3Aneo%3Amte%3Alp616%3Adec%3Aqsbooking&aid=2369661"
const estates = ref<Estate[]>([
  {
    url: "https://www.booking.com/hotel/es/villa-samar-altea.fr.html?label=msn-_*ipi4csWbMJFg*Qb30F5w-80608133315299%3Atikwd-80608308434614%3Aloc-14%3Aneo%3Amte%3Alp616%3Adec%3Aqsbooking&aid=2369661&ucfs=1&checkin=2025-12-20&checkout=2025-12-25&dest_id=-406131&dest_type=city&group_adults=7&no_rooms=1&group_children=0&nflt=oos%3D1%3Bprice%3DEUR-350-450-1%3Bht_id%3D220%3Bht_id%3D213%3Bprivacy_type%3D3%3Bht_id%3D228%3Bentire_place_bedroom_count%3D4%3Breview_score%3D90%3Bhotelfacility%3D4&srpvid=af3048ef6f4805e0&srepoch=1757674145&matching_block_id=39659301_414720911_7_0_0&atlas_src=sr_iw_title#map_closed",
    name: "Villa Samar Altea Grupo Terra de Mar, alojamientos con encanto",
    price: "",
    rating: "Avec une note de 9.4",
    location: "Sorolla, 11, 03590 Altea, Espagne",
    image:
      "https://cf.bstatic.com/xdata/images/hotel/max500/258347354.jpg?k=9af9fd1c4041078bde60d0f0361deca1902895825f083df8b67f07de72d73632&o=&hp=1",
  },
  {
    url: "https://www.booking.com/hotel/es/casa-en-primera-linea-de-playa-pucol.fr.html?aid=2369661&label=msn-_%2Aipi4csWbMJFg%2AQb30F5w-80608133315299%3Atikwd-80608308434614%3Aloc-14%3Aneo%3Amte%3Alp616%3Adec%3Aqsbooking&sid=6ccab3c3e23eedd0177dfbbd49e2223e&all_sr_blocks=981892601_370451345_8_0_0&checkin=2025-12-20&checkout=2025-12-25&dest_id=1523&dest_type=region&dist=0&group_adults=7&group_children=0&hapos=1&highlighted_blocks=981892601_370451345_8_0_0&hpos=1&matching_block_id=981892601_370451345_8_0_0&no_rooms=1&req_adults=7&req_children=0&room1=A%2CA%2CA%2CA%2CA%2CA%2CA&sb_price_type=total&sr_order=popularity&sr_pri_blocks=981892601_370451345_8_0_0__103500&srepoch=1757852613&srpvid=b72a55f7147200a5&type=total&ucfs=1&",
    name: "Casa en primera linea de playa",
    price: "",
    rating: "Avec une note de 9",
    location: "13 Avinguda dels Pescadors, 46530 Puzol, Espagne",
    image:
      "https://cf.bstatic.com/xdata/images/hotel/max500/442843977.jpg?k=e6bd7a365011fad222c492645642fb5645b2e15a152826499002dc6a8554bdfa&o=&hp=1",
  },
  {
    url: "https://www.booking.com/hotel/es/asa-la-marina-by-sh-hoteles.fr.html?label=msn-_*ipi4csWbMJFg*Qb30F5w-80608133315299%3Atikwd-80608308434614%3Aloc-14%3Aneo%3Amte%3Alp616%3Adec%3Aqsbooking&aid=2369661",
    name: "ASA Hotel La Marina",
    price: "",
    rating: "Avec une note de 9.1",
    location:
      "Carrer Alcalalí - Esquina Calle Vall De Laguard, 03760 Ondara, Espagne",
    image:
      "https://cf.bstatic.com/xdata/images/hotel/max500/562928066.jpg?k=64cbc9f6e3af2a3fa4e9815d1d4e6e94cb261e437e7c49ea262d081b369f463d&o=&hp=1",
  },
]);

// Columns definition
const columns: TableColumn<Estate>[] = [
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) =>
      h(ImgPreview, { url: row.original.image, class: "max-w-44" }),
  },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "price", header: "Price" },
  { accessorKey: "rating", header: "Rating" },
  { accessorKey: "location", header: "Location" },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) =>
      h("div", { class: "flex items-center gap-1" }, [
        h(UButton, {
          size: "sm",
          color: "info",
          variant: "ghost",
          icon: "i-mdi-link-variant",
          to: row.original.url,
          target: "_blank",
        }),
        h(UButton, {
          icon: "i-mdi-trash-can",
          size: "sm",
          color: "error",
          variant: "ghost",
          onClick: () => removeEstate(row.original.url),
        }),
      ]),
  },
];

// Add a new estate (no more scraping here)
async function addEstate() {
  const url = urlInput.value.trim();
  if (!url || estates.value.some((e) => e.url === url)) {
    urlInput.value = "";
    return;
  }

  try {
    const estate = await $fetch("/api/scrape", { params: { url } });
    if (!estate.error) {
      estates.value.push(estate);
    }
  } catch (err) {
    console.error("Scraping failed:", err);
  }

  urlInput.value = "";
}

function removeEstate(url: string) {
  estates.value = estates.value.filter((e) => e.url !== url);
}
</script>

<template>
  <div class="bg-muted h-screen space-y-10 p-10">
    <UContainer>
      <h1 class="mb-5 text-2xl font-bold">Booking.com & Airbnb Comparison</h1>

      <UCard>
        <div class="flex gap-2">
          <UInput
            v-model="urlInput"
            placeholder="Enter Booking.com URL"
            clearable
            @keyup.enter="addEstate"
            class="flex-1"
          />
          <UButton
            color="primary"
            @click="addEstate"
            label="Add"
            icon="i-mdi-plus"
          >
            Add
          </UButton>
        </div>
      </UCard>
    </UContainer>
    <UTable
      v-if="estates.length"
      :columns="columns"
      :data="estates"
      row-key="url"
    />

    <!-- <div v-if="estates.length" class="flex gap-4">
      <div>
        <div class="h-34"></div>
        <div
          v-for="[key, value] in Object.entries(estates[0])"
          class="flex h-20 items-center gap-4"
        >
          <p class="text-lg font-semibold">{{ titleCase(key) }}</p>
        </div>
      </div>

      <div
        v-for="estate in estates"
        class="bg-default max-w-sm space-y-6 overflow-auto rounded-xl"
      >
        <ImgPreview :url="estate.image" />
        <div class="p-2 sm:p-4">
          <div
            v-for="[key, value] in Object.entries(estate)"
            class="flex h-20 items-center"
          >
            <p class="text-sm">{{ value }}</p>
          </div>
        </div>
      </div>
    </div> -->
    <div v-else class="flex w-full items-center justify-center">
      <UAlert
        title="Add Url"
        icon="i-mdi-database-off"
        size="xl"
        variant="soft"
        color="warning"
        class="max-w-sm"
      />
    </div>
  </div>
</template>
