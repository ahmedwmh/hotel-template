/**
 * High-quality 5-star hotel imagery (Unsplash).
 * Used for hero carousel, rooms, offers, room details, breadcrumb, gallery.
 * Fallback to local paths if needed.
 */
const U = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=85`;

export const hotelImages = {
  /** Hero carousel (3 slides) */
  hero: [
    U("1566073771259-6a8506099945", 1920), // luxury hotel pool
    U("1582719508461-905c673771fd", 1920), // hotel exterior
    U("1542314831-068cd1dbfeeb", 1920),    // resort
  ],
  /** Rooms section carousel (6+) */
  rooms: [
    U("1631049307264-da0ec9d70304", 800), // bedroom
    U("1590490360182-c33d57733427", 800), // hotel room
    U("1611892440504-42a792e24d32", 800), // suite
    U("1595576508898-0ad5c879a061", 800), // modern room
    U("1591088398332-8a7791972843", 800), // luxury room
    U("1578683010232-d715112a32", 800),   // hotel room
  ],
  /** Offers section (4) */
  offers: [
    U("1631049307264-da0ec9d70304", 600),
    U("1590490360182-c33d57733427", 600),
    U("1611892440504-42a792e24d32", 600),
    U("1595576508898-0ad5c879a061", 600),
  ],
  /** Room details page slider (2) */
  roomDetails: [
    U("1631049307264-da0ec9d70304", 1200),
    U("1590490360182-c33d57733427", 1200),
  ],
  /** Breadcrumb / page header */
  breadcrumb: U("1582719508461-905c673771fd", 1920),
  /** Footer gallery (6) */
  gallery: [
    U("1566073771259-6a8506099945", 400),
    U("1582719508461-905c673771fd", 400),
    U("1631049307264-da0ec9d70304", 400),
    U("1590490360182-c33d57733427", 400),
    U("1611892440504-42a792e24d32", 400),
    U("1542314831-068cd1dbfeeb", 400),
  ],
  /** Testimonial background */
  testimonialBg: U("1566073771259-6a8506099945", 1920),
} as const;
