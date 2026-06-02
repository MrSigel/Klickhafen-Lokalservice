const fallbackSiteUrl = "https://klickhafen-lokalservice.de";

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || fallbackSiteUrl).replace(/\/$/, "");

export const serviceAreas = [
  "Castrop-Rauxel",
  "Dortmund",
  "Herne",
  "Bochum",
  "Umgebung rund um 44577 Castrop-Rauxel",
];

export const serviceNames = [
  "Gartenpflege",
  "Rasen mähen",
  "Hecken schneiden",
  "Reinigung",
  "Fensterreinigung",
  "Gebäudereinigung",
  "Möbelmontage",
  "Küchenmontage",
  "Laminat verlegen",
  "Klick-Vinyl verlegen",
  "Entrümpelung",
  "Abtransport",
  "Objektpflege",
  "Notfallservice",
  "Schlüsseldienst",
  "Türöffnung",
  "WC-Verstopfung",
  "Abfluss verstopft",
  "Rohrverstopfung",
];

export const faqItems = [
  {
    question: "Muss ich Bilder senden?",
    answer:
      "Bilder helfen uns, den Aufwand besser einzuschätzen. Sie können bis zu 5 Bilder oder Videos hochladen.",
  },
  {
    question: "Ist der Kostenrechner verbindlich?",
    answer:
      "Nein. Der Kostenrechner zeigt nur eine unverbindliche Orientierung. Der genaue Preis wird nach Prüfung Ihrer Angaben bestätigt.",
  },
  {
    question: "Welche Orte werden bedient?",
    answer:
      "Wir sind rund um Castrop-Rauxel, Dortmund, Herne, Bochum und Umgebung im Einsatz.",
  },
  {
    question: "Sind Festpreise möglich?",
    answer: "Ja. Je nach Auftrag sind Stundenpreis oder Festpreis möglich.",
  },
  {
    question: "Kann ich regelmäßige Pflege buchen?",
    answer:
      "Ja. Wiederkehrende Arbeiten sind wöchentlich, monatlich, saisonal oder jährlich möglich.",
  },
  {
    question: "Wie schnell bekomme ich eine Rückmeldung?",
    answer: "In der Regel melden wir uns zeitnah nach Eingang Ihrer Anfrage zurück.",
  },
];

export const siteDescription =
  "Klickhafen Lokalservice übernimmt Gartenpflege, Reinigung, Montage, Bodenverlegung, Entrümpelung, Notfallservice und Objektpflege in Castrop-Rauxel, Dortmund, Herne und Bochum.";

export function absoluteUrl(path = "/") {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteUrl}/#localbusiness`,
    name: "Klickhafen Lokalservice",
    legalName: "Klickhafen Lokalservice - Enrico Gross",
    slogan: "Haus, Garten & Objektservice in Castrop-Rauxel und Umgebung",
    description: siteDescription,
    url: siteUrl,
    logo: absoluteUrl("/klickhafen_logo_transparent.png"),
    image: absoluteUrl("/klickhafen_favicon_512.png"),
    telephone: "+4915563535989",
    email: "kontakt@klickhafen.de",
    priceRange: "€€",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Gertherstraße 76",
      postalCode: "44577",
      addressLocality: "Castrop-Rauxel",
      addressRegion: "Nordrhein-Westfalen",
      addressCountry: "DE",
    },
    areaServed: serviceAreas.map((area) => ({
      "@type": "AdministrativeArea",
      name: area,
    })),
    makesOffer: serviceNames.map((service) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: service,
        areaServed: serviceAreas,
      },
    })),
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+4915563535989",
      email: "kontakt@klickhafen.de",
      contactType: "customer service",
      areaServed: "DE-NW",
      availableLanguage: ["de-DE"],
    },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: "Klickhafen Lokalservice",
    url: siteUrl,
    inLanguage: "de-DE",
    description: siteDescription,
    publisher: {
      "@id": `${siteUrl}/#localbusiness`,
    },
  };
}

export function serviceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${siteUrl}/#services`,
    name: "Haus, Garten & Objektservice",
    provider: {
      "@id": `${siteUrl}/#localbusiness`,
    },
    serviceType: serviceNames,
    areaServed: serviceAreas,
    description:
      "Lokale Dienstleistungen für Garten, Reinigung, Montage, Bodenverlegung, Entrümpelung und regelmäßige Objektpflege.",
  };
}

export function faqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${siteUrl}/#faq`,
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function structuredData() {
  return [localBusinessSchema(), websiteSchema(), serviceSchema(), faqSchema()];
}
