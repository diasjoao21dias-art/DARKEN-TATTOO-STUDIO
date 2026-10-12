// Dados do estúdio — edite aqui. Nenhum backend é necessário.
export const STUDIO = {
  name: "Darken Tattoo Studio",
  city: "Monte Carmelo — MG",
  address: "[Endereço do estúdio]",
  // Somente dígitos, com DDI + DDD. Ex.: 5534999999999
  whatsapp: "5534999999999",
  email: "contato@darkentattoo.com",
  instagram: "darkentattoo",
};

export const whatsappUrl = (text) => `https://wa.me/${STUDIO.whatsapp}?text=${encodeURIComponent(text)}`;
export const instagramUrl = `https://instagram.com/${STUDIO.instagram}`;
export const mailtoUrl = (subject, body) => `mailto:${STUDIO.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
