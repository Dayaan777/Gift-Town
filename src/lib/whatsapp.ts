/**
 * Central WhatsApp configuration & message formatting helper for Gift Town
 */

export const WHATSAPP_PHONE_NUMBER = "923071327708";
export const WHATSAPP_DISPLAY_NUMBER = "+92 307 1327708";

export const SITE_BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://gift-town.netlify.app";

/**
 * Build a standard wa.me URL with pre-filled encoded text
 */
export function getWhatsAppUrl(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_PHONE_NUMBER}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

/**
 * Format a single product WhatsApp inquiry/order message with title, price, and direct image preview
 */
export function formatSingleProductWhatsAppMessage(params: {
  name: string;
  price?: string | number;
  image?: string;
  categoryTag?: string;
}): string {
  const { name, price, image, categoryTag } = params;

  let text = `Hi Gift Town! 🎁 I want to order this product:\n\n`;
  text += `🛍️ *Product*: ${name.trim()}\n`;
  if (categoryTag) {
    text += `🏷️ *Category*: ${categoryTag.trim()}\n`;
  }
  if (price) {
    const formattedPrice =
      typeof price === "number" ? price.toLocaleString() : price;
    text += `💰 *Price*: PKR ${formattedPrice}\n`;
  }
  if (image) {
    const fullImageUrl = image.startsWith("http")
      ? image
      : `${SITE_BASE_URL}${image.startsWith("/") ? "" : "/"}${image}`;
    text += `📸 *Photo*: ${fullImageUrl}\n`;
  }
  text += `\nPlease confirm availability and delivery details!`;
  return text;
}

/**
 * Item structure for multi-product / custom orders
 */
export interface OrderSlipItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  quantity?: number;
  category?: string;
}

/**
 * Compress and encode items into a short, safe URL query string for the visual slip
 */
export function encodeOrderItems(items: OrderSlipItem[]): string {
  try {
    const minimal = items.map((it) => ({
      n: it.name,
      p: it.price,
      img: it.image || "",
      q: it.quantity || 1,
    }));
    return encodeURIComponent(JSON.stringify(minimal));
  } catch {
    return "";
  }
}

/**
 * Decode items from the query string on the order view page
 */
export function decodeOrderItems(encoded: string): OrderSlipItem[] {
  try {
    const parsed = JSON.parse(decodeURIComponent(encoded));
    if (!Array.isArray(parsed)) return [];
    return parsed.map((it: any, idx: number) => ({
      id: `slip-${idx}`,
      name: it.n || "Custom Item",
      price: Number(it.p) || 0,
      image: it.img || "",
      quantity: Number(it.q) || 1,
    }));
  } catch {
    return [];
  }
}

/**
 * Format multi-item / custom order WhatsApp message with itemized bill and single visual order slip link
 */
export function formatMultiItemWhatsAppMessage(params: {
  title?: string;
  items: OrderSlipItem[];
  totalPrice?: number;
  notes?: string;
}): string {
  const { title = "Custom Tailored Package", items, totalPrice, notes } = params;
  const calculatedTotal =
    totalPrice ??
    items.reduce((sum, it) => sum + (it.price || 0) * (it.quantity || 1), 0);

  let text = `Hi Gift Town! 🎁 I want to order a ${title}:\n\n`;
  text += `📋 *Selected Items (${items.length})*:\n`;

  items.forEach((it, idx) => {
    const qty = it.quantity && it.quantity > 1 ? ` (x${it.quantity})` : "";
    text += `${idx + 1}. ${it.name}${qty} - PKR ${it.price.toLocaleString()}\n`;
  });

  text += `\n💰 *Total Amount*: PKR ${calculatedTotal.toLocaleString()}\n`;

  if (notes) {
    text += `📝 *Notes*: ${notes}\n`;
  }

  // Generate visual order slip link
  const encodedQuery = encodeOrderItems(items);
  if (encodedQuery) {
    text += `\n🧾 *View Complete Visual Order Slip & Photos*:\n`;
    text += `${SITE_BASE_URL}/order/view?slip=${encodedQuery}&title=${encodeURIComponent(
      title
    )}&total=${calculatedTotal}\n`;
  }

  text += `\nPlease confirm availability and delivery details!`;
  return text;
}
