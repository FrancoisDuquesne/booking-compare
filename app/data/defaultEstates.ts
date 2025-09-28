import type { Estate } from '~/types/estate';

export const defaultEstates: Estate[] = [
  {
    url: 'https://www.booking.com/hotel/es/villa-samar-altea.fr.html?label=msn-_*ipi4csWbMJFg*Qb30F5w-80608133315299%3Atikwd-80608308434614%3Aloc-14%3Aneo%3Amte%3Alp616%3Adec%3Aqsbooking&aid=2369661&ucfs=1&checkin=2025-12-20&checkout=2025-12-25&dest_id=-406131&dest_type=city&group_adults=7&no_rooms=1&group_children=0&nflt=oos%3D1%3Bprice%3DEUR-350-450-1%3Bht_id%3D220%3Bht_id%3D213%3Bprivacy_type%3D3%3Bht_id%3D228%3Bentire_place_bedroom_count%3D4%3Breview_score%3D90%3Bhotelfacility%3D4&srpvid=af3048ef6f4805e0&srepoch=1757674145&matching_block_id=39659301_414720911_7_0_0&atlas_src=sr_iw_title#map_closed',
    name: 'Villa Samar Altea Grupo Terra de Mar, alojamientos con encanto',
    price: '€420/night',
    rating: '9.4/10',
    location: 'Sorolla, 11, 03590 Altea, Espagne',
    image:
      'https://cf.bstatic.com/xdata/images/hotel/max500/258347354.jpg?k=9af9fd1c4041078bde60d0f0361deca1902895825f083df8b67f07de72d73632&o=&hp=1',
  },
  {
    url: 'https://www.booking.com/hotel/es/casa-en-primera-linea-de-playa-pucol.fr.html?aid=2369661&label=msn-_%2Aipi4csWbMJFg%2AQb30F5w-80608133315299%3Atikwd-80608308434614%3Aloc-14%3Aneo%3Amte%3Alp616%3Adec%3Aqsbooking&sid=6ccab3c3e23eedd0177dfbbd49e2223e&all_sr_blocks=981892601_370451345_8_0_0&checkin=2025-12-20&checkout=2025-12-25&dest_id=1523&dest_type=region&dist=0&group_adults=7&group_children=0&hapos=1&highlighted_blocks=981892601_370451345_8_0_0&hpos=1&matching_block_id=981892601_370451345_8_0_0&no_rooms=1&req_adults=7&req_children=0&room1=A%2CA%2CA%2CA%2CA%2CA%2CA&sb_price_type=total&sr_order=popularity&sr_pri_blocks=981892601_370451345_8_0_0__103500&srepoch=1757852613&srpvid=b72a55f7147200a5&type=total&ucfs=1&',
    name: 'Casa en primera linea de playa',
    price: '€350/night',
    rating: '9.0/10',
    location: '13 Avinguda dels Pescadors, 46530 Puzol, Espagne',
    image:
      'https://cf.bstatic.com/xdata/images/hotel/max500/442843977.jpg?k=e6bd7a365011fad222c492645642fb5645b2e15a152826499002dc6a8554bdfa&o=&hp=1',
  },
  {
    url: 'https://www.booking.com/hotel/es/asa-la-marina-by-sh-hoteles.fr.html?label=msn-_*ipi4csWbMJFg*Qb30F5w-80608133315299%3Atikwd-80608308434614%3Aloc-14%3Aneo%3Amte%3Alp616%3Adec%3Aqsbooking&aid=2369661',
    name: 'ASA Hotel La Marina',
    price: '€380/night',
    rating: '9.1/10',
    location:
      'Carrer Alcalalí - Esquina Calle Vall De Laguard, 03760 Ondara, Espagne',
    image:
      'https://cf.bstatic.com/xdata/images/hotel/max500/562928066.jpg?k=64cbc9f6e3af2a3fa4e9815d1d4e6e94cb261e437e7c49ea262d081b369f463d&o=&hp=1',
  },
];

export function createDefaultEstates(): Estate[] {
  return defaultEstates.map((estate) => ({ ...estate }));
}
