export const CONTACT_INFO = {
  phone: process.env.NEXT_PUBLIC_PHONE || "+91 9995616166",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "9995616166",
  email: process.env.NEXT_PUBLIC_EMAIL || "simaartsindia@gmail.com",
  facebook: process.env.NEXT_PUBLIC_FACEBOOK || "https://facebook.com",
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM || "https://instagram.com",
  youtube: process.env.NEXT_PUBLIC_YOUTUBE || "https://youtube.com",
  mapEmbedUrl: process.env.NEXT_PUBLIC_MAP_EMBED_URL || "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3914.980903717614!2d75.9529!3d11.1148!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba64f48d1ab3b05%3A0x820087cecaef4575!2sELBANO%20ROOFINGS!5e0!3m2!1sen!2sin!4v1777737554636!5m2!1sen!2sin",
  googleMapsUrl: "https://maps.app.goo.gl/EEaWKScbeBcGHxcX8",
};

export const CONTACT_LINKS = {
  tel: `tel:${CONTACT_INFO.phone.replace(/\s/g, "")}`,
  whatsapp: `https://wa.me/91${CONTACT_INFO.whatsapp}`,
  mailto: `mailto:${CONTACT_INFO.email}`,
};

