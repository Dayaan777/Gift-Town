import React from "react";

export default function JsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gift-town.netlify.app";

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    name: "Gift Town",
    alternateName: [
      "GiftTown",
      "Gift Town Pakistan",
      "Gift Town Official",
      "Gift Town Online",
      "Gift-Town",
    ],
    url: baseUrl,
    inLanguage: "en-PK",
    description:
      "Official website of Gift Town Pakistan. Handcrafted luxury gift hampers, fresh floral bouquets, money bouquets, chocolate boxes, and bespoke ceremonial bridal suites delivered nationwide.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/all-products?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const storeSchema = {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    "@id": `${baseUrl}/#store`,
    name: "Gift Town",
    alternateName: "Gift Town Pakistan",
    url: baseUrl,
    logo: `${baseUrl}/images/hero-banner-pc-hd.png`,
    image: `${baseUrl}/images/hero-banner-pc-hd.png`,
    description:
      "Gift Town is Pakistan's premier bespoke gifting studio specializing in luxury gift hampers, money bouquets, Baat Pakki suites, and personalized celebration surprises with express delivery across all of Pakistan.",
    currenciesAccepted: "PKR",
    paymentAccepted: "Bank Transfer, JazzCash, EasyPaisa, Cash on Delivery",
    priceRange: "PKR 1500 - PKR 85000",
    areaServed: [
      {
        "@type": "Country",
        name: "Pakistan",
      },
      {
        "@type": "City",
        name: "Karachi",
      },
      {
        "@type": "City",
        name: "Lahore",
      },
      {
        "@type": "City",
        name: "Islamabad",
      },
      {
        "@type": "City",
        name: "Rawalpindi",
      },
      {
        "@type": "City",
        name: "Hyderabad",
      },
      {
        "@type": "City",
        name: "Faisalabad",
      },
      {
        "@type": "City",
        name: "Multan",
      },
      {
        "@type": "City",
        name: "Peshawar",
      },
      {
        "@type": "City",
        name: "Quetta",
      },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Gift Town Collections",
      itemListElement: [
        {
          "@type": "OfferCatalog",
          name: "Money & Currency Bouquets",
          description: "Artisan cash cone bouquets handcrafted with fresh florals and fairy lights.",
        },
        {
          "@type": "OfferCatalog",
          name: "Celebration Hampers",
          description: "Curated birthday, anniversary, and apology luxury gift hampers.",
        },
        {
          "@type": "OfferCatalog",
          name: "Wedding & Baat Pakki Packages",
          description: "Complete ceremonial bridal trousseau sets, dry fruit trays, and mithai platters.",
        },
        {
          "@type": "OfferCatalog",
          name: "Custom Gift Studio",
          description: "Personalized build-your-own hamper builder with tailored selections.",
        },
      ],
    },
    sameAs: [
      "https://github.com/Dayaan777/Gift-Town",
      "https://gift-town.netlify.app",
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is Gift Town?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Gift Town is Pakistan's premier online gift boutique offering personalized gift hampers, money bouquets, flower arrangements, chocolate boxes, and grand wedding celebration packages delivered nationwide across Pakistan.",
        },
      },
      {
        "@type": "Question",
        name: "Does Gift Town deliver all over Pakistan?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, Gift Town delivers handcrafted gift packages nationwide across Pakistan, including Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, Hyderabad, Thatta, Makli, and all other cities.",
        },
      },
      {
        "@type": "Question",
        name: "Can overseas Pakistanis order gifts from Gift Town?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! Overseas Pakistanis living in the UK, USA, UAE, Canada, Saudi Arabia, and worldwide can easily send surprise gifts, bouquets, and hampers to their family and loved ones in Pakistan with direct WhatsApp coordination and international bank payment.",
        },
      },
      {
        "@type": "Question",
        name: "Can I customize my own gift package at Gift Town?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, Gift Town features an interactive 'Custom Gift Studio' and 'Pick & Choose' wedding suites where you can select your own custom baskets, chocolates, cash denominations, cards, and accessories.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(storeSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
