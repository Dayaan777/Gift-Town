import { supabase } from "@/lib/supabase";

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

export interface OrderSlipItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  quantity?: number;
  category?: string;
}

/**
 * Generate a short, readable random code like GT-8492
 */
export function generateShortCode(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `GT-${num}`;
}

/**
 * Persist an order slip to Supabase so it can be viewed via clean short link /order/GT-XXXX
 */
export async function createOrderSlip(params: {
  title: string;
  items: OrderSlipItem[];
  totalPrice?: number;
  notes?: string;
}): Promise<string> {
  const { title, items, totalPrice, notes } = params;
  const shortCode = generateShortCode();
  const calculatedTotal =
    totalPrice ??
    items.reduce((sum, it) => sum + (it.price || 0) * (it.quantity || 1), 0);

  const payload = {
    code: shortCode,
    title,
    total: calculatedTotal,
    items,
    notes,
    createdAt: new Date().toISOString(),
  };

  try {
    const { error } = await supabase.from("hamper_items").insert([
      {
        id: `slip-${shortCode}`,
        name: shortCode,
        type: "order_slip",
        category: "order_slip",
        image: items[0]?.image || "/logo.png",
        subtitle: JSON.stringify(payload),
        price: calculatedTotal,
        is_active: false,
      },
    ]);

    if (!error) {
      return shortCode;
    }
  } catch (err) {
    console.error("Failed to persist order slip:", err);
  }

  // Fallback: return short code even if DB fails
  return shortCode;
}

/**
 * Format WhatsApp message for a single product with short Order Slip link
 */
export async function formatSingleProductOrder(params: {
  name: string;
  price?: string | number;
  image?: string;
  categoryTag?: string;
}): Promise<string> {
  const { name, price, image, categoryTag } = params;
  const numericPrice =
    typeof price === "number"
      ? price
      : Number(String(price || "0").replace(/,/g, "")) || 0;

  const shortCode = await createOrderSlip({
    title: name,
    items: [
      {
        id: "prod-single",
        name,
        price: numericPrice,
        image: image || "",
        category: categoryTag,
      },
    ],
    totalPrice: numericPrice,
  });

  const formattedPrice =
    typeof price === "number" ? price.toLocaleString() : price || "Custom";

  let text = `Hi Gift Town! 🎁 I want to order this product:\n\n`;
  text += `🛍️ *Product*: ${name.trim()}\n`;
  if (categoryTag) {
    text += `🏷️ *Category*: ${categoryTag.trim()}\n`;
  }
  text += `💰 *Price*: PKR ${formattedPrice}\n\n`;
  text += `🧾 *Order Slip*: ${SITE_BASE_URL}/order/${shortCode}\n\n`;
  text += `Please confirm availability and delivery details!`;

  return text;
}

/**
 * Format WhatsApp message for multi-item / custom orders with short Order Slip link
 */
export async function formatMultiItemOrder(params: {
  title?: string;
  items: OrderSlipItem[];
  totalPrice?: number;
  notes?: string;
}): Promise<string> {
  const { title = "Custom Order", items, totalPrice, notes } = params;
  const calculatedTotal =
    totalPrice ??
    items.reduce((sum, it) => sum + (it.price || 0) * (it.quantity || 1), 0);

  const shortCode = await createOrderSlip({
    title,
    items,
    totalPrice: calculatedTotal,
    notes,
  });

  let text = `Hi Gift Town! 🎁 I want to place a ${title}:\n\n`;
  text += `📋 *Selected Items (${items.length} items)*:\n`;

  // Include up to 4 items summary in chat text, rest viewable on slip
  items.slice(0, 4).forEach((it, idx) => {
    const qty = it.quantity && it.quantity > 1 ? ` (x${it.quantity})` : "";
    text += `${idx + 1}. ${it.name}${qty} - PKR ${it.price.toLocaleString()}\n`;
  });

  if (items.length > 4) {
    text += `... and ${items.length - 4} more items\n`;
  }

  text += `\n💰 *Total Amount*: PKR ${calculatedTotal.toLocaleString()}\n\n`;
  text += `🧾 *View Complete Visual Order Slip & Photos*:\n`;
  text += `${SITE_BASE_URL}/order/${shortCode}\n\n`;
  text += `Please confirm availability and delivery details!`;

  return text;
}
