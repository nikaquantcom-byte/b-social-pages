import { useState, useMemo, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMap, CircleMarker } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import { useQuery } from "@tanstack/react-query";
import { fetchPlaces, fetchEvents, type Place, type Event as SupabaseEvent } from "@/lib/supabase";

// Prevent Leaflet from injecting default marker image (red pin)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({ iconUrl: '', iconRetinaUrl: '', shadowUrl: '' });

import { Search, X, Plus, Minus, Navigation, Star, ExternalLink, Users, MapPin as MapPinIcon } from "lucide-react";
import { CalmBottomNav } from "@/components/CalmBottomNav";
import { OPLEVELSER_NAER_DIG } from "@/data/feedData";
import { searchTags } from "@/lib/tagTree";
import { useJoin } from "@/context/JoinContext";
import { useTags } from "@/context/TagContext";
import { Link } from "wouter";

/* ══════════════════════════════════════════════
   KORT v3 — Dyb opdatering
   ══════════════════════════════════════════════ */

type PinCategory = "sport" | "kultur" | "natur" | "musik" | "mad" | "spil" | "events" | "mtb" | "vandring" | "loeb" | "hund" | "fiskeri" | "badning" | "shelter" | "dyrespot" | "kreativt" | "fitness" | "outdoor" | "socialt" | "karriere" | "tech" | "aktiv_sport" | "mad_hangout" | "rejser" | "logi" | "wellness" | "communities" | "ture" | "aktiv";

interface MapPin {
  id: string;
  name: string;
  lat: number;
  lng: number;
  category: PinCategory;
  description: string;
  rating: number;
  ratingCount?: number;
  isEvent?: boolean;
  isSupabaseEvent?: boolean;
  spots?: { current: number; total: number };
  season?: string;
  difficulty?: string;
  tags?: string[];
  city?: string;
  fromSupabase?: boolean;
  image?: string;
  date?: string;
  price?: number | null;
  eventId?: string;
}

/* ── Category config ── */
const CATEGORY_META: Record<string, { label: string; emoji: string; hex: string }> = {
  // 10 locked categories
  events:      { label: "Events",              emoji: "🎉", hex: "#eab308" },
  logi:        { label: "Logi & base",         emoji: "🏕️", hex: "#b45309" },
  ture:        { label: "Ture & eventyr",      emoji: "🥾", hex: "#16a34a" },
  natur:       { label: "Natur",               emoji: "🌿", hex: "#4ECDC4" },
  aktiv:       { label: "Aktiv & sport",       emoji: "⚽", hex: "#3b82f6" },
  mad:         { label: "Mad & hangouts",      emoji: "🍽️", hex: "#f59e0b" },
  kultur:      { label: "Oplevelser & kultur", emoji: "🎭", hex: "#a855f7" },
  rejser:      { label: "Rejser & transport",  emoji: "🚆", hex: "#0284c7" },
  communities: { label: "Communities",         emoji: "👥", hex: "#dc2626" },
  wellness:    { label: "Wellness",            emoji: "🧘", hex: "#14b8a6" },
  // Legacy / sub-category pins
  sport:       { label: "Sport",        emoji: "⚽", hex: "#3b82f6" },
  musik:       { label: "Musik",        emoji: "🎵", hex: "#ec4899" },
  mad_hangout: { label: "Mad & Hangout",emoji: "🍽️", hex: "#f59e0b" },
  spil:        { label: "Spil",         emoji: "🎲", hex: "#3b82f6" },
  mtb:         { label: "MTB",          emoji: "🚵", hex: "#f97316" },
  vandring:    { label: "Vandring",     emoji: "🥾", hex: "#65a30d" },
  loeb:        { label: "Løb",          emoji: "🏃", hex: "#06b6d4" },
  hund:        { label: "Hund",         emoji: "🐕", hex: "#ca8a04" },
  fiskeri:     { label: "Fiskeri",      emoji: "🎣", hex: "#0d9488" },
  badning:     { label: "Badning",      emoji: "🏊", hex: "#0ea5e9" },
  shelter:     { label: "Shelter",      emoji: "⛺", hex: "#78716c" },
  dyrespot:    { label: "Dyrespot",     emoji: "🦌", hex: "#15803d" },
  kreativt:    { label: "Kreativt",     emoji: "🖌️", hex: "#f43f5e" },
  fitness:     { label: "Fitness",      emoji: "💪", hex: "#ea580c" },
  outdoor:     { label: "Outdoor",      emoji: "🌲", hex: "#16a34a" },
  socialt:     { label: "Socialt",      emoji: "❤️", hex: "#dc2626" },
  karriere:    { label: "Karriere",     emoji: "💼", hex: "#64748b" },
  tech:        { label: "Tech",         emoji: "💻", hex: "#0891b2" },
  aktiv_sport: { label: "Aktiv Sport",  emoji: "🏃", hex: "#3b82f6" },
};

/* ── Header images per category for detail sheet ── */
const PIN_HEADER_IMAGES: Record<string, string> = {
  sport:    "https://images.unsplash.com/photo-1461896836934-bd45ba3ff2b3?w=600",
  kultur:   "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=600",
  natur:    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600",
  musik:    "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600",
  mad:      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600",
  mad_hangout: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600",
  spil:     "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=600",
  events:   "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600",
  mtb:      "https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?w=600",
  vandring: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600",
  loeb:     "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600",
  hund:     "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600",
  fiskeri:  "https://images.unsplash.com/photo-1504309092620-4d0ec726efa4?w=600",
  badning:  "https://images.unsplash.com/photo-1519314793478-81a89b69502e?w=600",
  shelter:  "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600",
  dyrespot: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=600",
  kreativt: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600",
  fitness:  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600",
  outdoor:  "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600",
  socialt:  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600",
  karriere: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600",
  tech:     "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600",
  aktiv_sport: "https://images.unsplash.com/photo-1461896836934-bd45ba3ff2b3?w=600",
  // New 10 locked categories
  rejser:      "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=600",
  logi:        "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600",
  wellness:    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600",
  communities: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600",
  ture:        "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600",
  aktiv:       "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600",
};

/* ── All hardcoded map pins ── */
export const HARDCODED_PINS: MapPin[] = [
  // AALBORG — SPORT
  { id: "s1", name: "Aalborg Portland Park", lat: 57.043, lng: 9.903, category: "sport", description: "Hjemsted for AaB — Aalborgs professionelle fodboldstadion med plads til 14.000 tilskuere.", rating: 4.5 },
  { id: "s2", name: "Gigantium", lat: 57.025, lng: 9.945, category: "sport", description: "Nordjyllands største sports- og eventarena. Ishockey, håndbold, koncerter og messer.", rating: 4.3 },
  { id: "s3", name: "Aalborg Svømmehal", lat: 57.046, lng: 9.917, category: "sport", description: "Centralt beliggende svømmehal med 50m bassin, varmtvandsbassin og wellness.", rating: 4.0 },
  { id: "s4", name: "Kildeparken", lat: 57.047, lng: 9.927, category: "sport", description: "Populær park til løb, fodbold og udendørs træning. Perfekt til 5-mands.", rating: 4.4 },
  { id: "s5", name: "DGI Huset Nordkraft", lat: 57.048, lng: 9.923, category: "sport", description: "Fitnesscenter, klatrevæg og badmintonbaner i det ikoniske Nordkraft-bygning.", rating: 4.6 },

  // AALBORG — KULTUR
  { id: "k1", name: "Kunsten Museum", lat: 57.042, lng: 9.899, category: "kultur", description: "Museum for moderne og samtidskunst. Tegnet af Alvar Aalto. Skulpturpark og udstillinger.", rating: 4.7 },
  { id: "k2", name: "Utzon Center", lat: 57.052, lng: 9.923, category: "kultur", description: "Arkitektur- og designcenter opkaldt efter Jørn Utzon. Beliggende ved havnefronten.", rating: 4.5 },
  { id: "k3", name: "Aalborg Teater", lat: 57.047, lng: 9.920, category: "kultur", description: "Danmarks ældste provinsscene med teater, musikteater og moderne forestillinger.", rating: 4.4 },
  { id: "k4", name: "Musikkens Hus", lat: 57.051, lng: 9.925, category: "kultur", description: "Koncerthus ved havnen med fantastisk akustik. Klassisk, jazz og verdensmusik.", rating: 4.8 },
  { id: "k5", name: "Nordkraft Kulturhus", lat: 57.048, lng: 9.922, category: "kultur", description: "Kulturcenter i gammelt elværk. Biograf, teater, musik og spisesteder.", rating: 4.5 },
  { id: "k6", name: "Aalborg Historiske Museum", lat: 57.048, lng: 9.920, category: "kultur", description: "Byens historie fra middelalder til nutid. Gratis adgang.", rating: 4.1 },

  // AALBORG — NATUR
  { id: "n1", name: "Lindholm Høje", lat: 57.075, lng: 9.893, category: "natur", description: "Vikingegravplads med over 700 grave. Fantastisk udsigt over Limfjorden og Aalborg.", rating: 4.8 },
  { id: "n2", name: "Fjordstien", lat: 57.053, lng: 9.915, category: "natur", description: "Smuk gang- og cykelsti langs Limfjorden. Perfekt til en rolig tur med udsigt.", rating: 4.3 },
  { id: "n3", name: "Aalborg Zoo", lat: 57.037, lng: 9.897, category: "natur", description: "Nordjyllands dyrehave med over 1.500 dyr. Populært for familier og dyreelskere.", rating: 4.4 },
  { id: "n4", name: "Mølleparken", lat: 57.045, lng: 9.917, category: "natur", description: "Grøn oase midt i Aalborg. Perfekt til en pause, picnic eller en stille gåtur.", rating: 4.0 },
  { id: "n5", name: "Østre Anlæg", lat: 57.046, lng: 9.930, category: "natur", description: "Historisk parkanlæg med store træer, stier og bænke. Roligt og fredfyldt.", rating: 4.2 },
  { id: "n6", name: "Limfjorden strand", lat: 57.055, lng: 9.910, category: "natur", description: "Strandområde med udsigt over Limfjorden. Perfekt til en solnedgangstur.", rating: 4.5 },

  // AALBORG — MAD & DRIKKE
  { id: "m1", name: "Jomfru Ane Gade", lat: 57.048, lng: 9.921, category: "mad", description: "Aalborgs berømte gågade med restauranter, barer og caféer. Altid liv og stemning.", rating: 4.2 },
  { id: "m2", name: "Streetfood Aalborg", lat: 57.048, lng: 9.922, category: "mad", description: "Street food marked i Nordkraft med køkkener fra hele verden. Budget-venligt.", rating: 4.3 },
  { id: "m3", name: "Café Frederiksberg", lat: 57.044, lng: 9.912, category: "mad", description: "Hyggelig café med god kaffe, brunch og hjemmelavet kage. Perfekt mødested.", rating: 4.5 },
  { id: "m4", name: "Duus Vinkjælder", lat: 57.047, lng: 9.920, category: "mad", description: "Historisk vinkjælder fra 1624. Vin, mad og atmosfære i Aalborgs ældste kælder.", rating: 4.6 },
  { id: "m5", name: "Skomagerkrækken", lat: 57.045, lng: 9.905, category: "mad", description: "Charmerende gade med små butikker og caféer i historiske bindingsværkshuse.", rating: 4.4 },

  // AALBORG — SPIL
  { id: "sp1", name: "Brætspilscaféen", lat: 57.046, lng: 9.918, category: "spil", description: "Over 500 brætspil at vælge imellem. Kaffe, øl og snacks. Perfekt til en hyggelig aften.", rating: 4.7 },
  { id: "sp2", name: "Escape House Aalborg", lat: 57.047, lng: 9.915, category: "spil", description: "Escape rooms med flere temaer. Teambuilding og sjov for venner og familie.", rating: 4.5 },

  // AALBORG — EVENTS (social meetups)
  { id: "e1", name: "Havnefronten meetup", lat: 57.051, lng: 9.920, category: "events", description: "Ugentlig social gåtur langs havnefronten. Alle er velkomne — mød nye mennesker.", rating: 4.6, isEvent: true, spots: { current: 3, total: 8 } },
  { id: "e2", name: "Kildeparken gåtur", lat: 57.047, lng: 9.927, category: "events", description: "Afslappet gåtur i parken med kaffe bagefter. Perfekt for nye i byen.", rating: 4.4, isEvent: true, spots: { current: 2, total: 5 } },
  { id: "e3", name: "Fodbold 5-mands", lat: 57.047, lng: 9.928, category: "events", description: "Hyggelig fodbold i Kildeparken. Alle niveauer. Vi mangler altid folk.", rating: 4.3, isEvent: true, spots: { current: 4, total: 5 } },
  { id: "e4", name: "Brætspil-aften Vestbyen", lat: 57.044, lng: 9.910, category: "events", description: "Settlers, Catan og pizza. Alle niveauer velkomne.", rating: 4.5, isEvent: true, spots: { current: 3, total: 6 } },

  // MTB & TRAILS
  { id: "mtb1", name: "Hammer Bakker MTB-spor", lat: 57.105, lng: 9.862, category: "mtb", description: "Tekniske MTB-spor i Hammer Bakker. 3 ruter: grøn, blå, rød. Fantastisk terræn.", rating: 4.7, difficulty: "Middel/Svær" },
  { id: "mtb2", name: "Rold Skov Trails", lat: 56.836, lng: 9.827, category: "mtb", description: "Lange MTB-stier gennem Rold Skov. Kuperet terræn med tekniske sektioner.", rating: 4.5, difficulty: "Middel" },
  { id: "mtb3", name: "Dall Villaby MTB", lat: 57.015, lng: 9.870, category: "mtb", description: "Let MTB-rute perfekt til begyndere. Flad skovsti med sjove bump.", rating: 4.0, difficulty: "Let" },

  // VANDRING
  { id: "vdr1", name: "Fjordstien vandrerute", lat: 57.053, lng: 9.915, category: "vandring", description: "Smuk vandresti langs Limfjorden fra Aalborg til Nibe.", rating: 4.6, difficulty: "Let" },
  { id: "vdr2", name: "Rold Skov Troldestien", lat: 56.840, lng: 9.830, category: "vandring", description: "Eventyrlig vandresti gennem sprækkedalen i Rold Skov. 5 km rundtur.", rating: 4.8, difficulty: "Middel" },
  { id: "vdr3", name: "Lindholm Høje rundtur", lat: 57.075, lng: 9.893, category: "vandring", description: "Kort vandring med vikinge-historie og panoramaudsigt.", rating: 4.5, difficulty: "Let" },
  { id: "vdr4", name: "Drastrup Skov", lat: 57.020, lng: 9.840, category: "vandring", description: "Smuk vandrerute med panoramaudsigt over Limfjorden.", rating: 4.4, difficulty: "Let" },

  // LØB
  { id: "lob1", name: "Kildeparken løberute", lat: 57.047, lng: 9.927, category: "loeb", description: "3-5 km løberute i Kildeparken. Fladt, oplyst om aftenen.", rating: 4.4, difficulty: "Let" },
  { id: "lob2", name: "Havnefronten løbestræk", lat: 57.051, lng: 9.921, category: "loeb", description: "Flad rute langs havnefronten. Ca. 4 km tur/retur.", rating: 4.3, difficulty: "Let" },

  // HUND
  { id: "hnd1", name: "Lindholm Hundeskov", lat: 57.078, lng: 9.890, category: "hund", description: "Indhegnet hundeskov med masser af plads. Vandpost og bænke.", rating: 4.5 },
  { id: "hnd2", name: "Skovhaven Hundepark", lat: 57.035, lng: 9.900, category: "hund", description: "Stor indhegnet hundepark. Separate arealer for store og små hunde.", rating: 4.2 },

  // FISKERI
  { id: "fsk1", name: "Limfjorden fiskeplads", lat: 57.058, lng: 9.910, category: "fiskeri", description: "God fiskeplads ved Limfjorden. Havørred, fladfisk og hornfisk i sæson.", rating: 4.3 },
  { id: "fsk2", name: "Nibe Bredning", lat: 56.990, lng: 9.640, category: "fiskeri", description: "Kendt fiskested ved Nibe. Gode muligheder for havørred fra kysten.", rating: 4.6 },

  // BADNING
  { id: "bad1", name: "Aalborg Havnebad", lat: 57.050, lng: 9.905, category: "badning", description: "Aalborgs populære havnebad ved Vestre Bådehavn. Sauna og solterrasse. Gratis.", rating: 4.7 },
  { id: "bad2", name: "Egholm Strand", lat: 57.065, lng: 9.870, category: "badning", description: "Naturlig sandstrand på Egholm. Perfekt sommerdag.", rating: 4.4 },

  // SHELTER
  { id: "shl1", name: "Egholm shelter", lat: 57.068, lng: 9.868, category: "shelter", description: "Primitiv shelter på Egholm med bålplads. Fantastisk stjernehimmel.", rating: 4.6 },
  { id: "shl2", name: "Rold Skov shelter", lat: 56.838, lng: 9.825, category: "shelter", description: "Skovly i hjertet af Rold Skov. Bålplads, vand og toilet tæt på.", rating: 4.4 },

  // DYRESPOT
  { id: "dyr1", name: "Lille Vildmose dyrespot", lat: 56.880, lng: 10.200, category: "dyrespot", description: "Se vilde kronsdyr, vildsvin og ørne. Bedst ved solopgang.", rating: 4.9 },
  { id: "dyr2", name: "Egholm vilde heste", lat: 57.066, lng: 9.865, category: "dyrespot", description: "Vilde heste og køer på Egholm. Tæt på og frit tilgængeligt.", rating: 4.5 },

  // SOCIAL from feedData
  ...OPLEVELSER_NAER_DIG.map((a) => {
    const LOCATION_COORDS: Record<string, [number, number]> = {
      "Café Nordkraft": [57.048, 9.922], "Utzon Center": [57.052, 9.923],
      "Hammer Bakker": [57.105, 9.862], "Brætspilscaféen": [57.046, 9.918],
      "Kildeparken": [57.047, 9.927], "Streetfood Aalborg": [57.048, 9.922],
      "Havnefronten": [57.051, 9.921], "Aalborg → Nibe": [57.046, 9.915],
      "Vestre Bådehavn": [57.050, 9.905], "Søgaards Bryghus": [57.047, 9.919],
      "NOVI Innovation": [57.015, 9.985], "Aalborg Kajakklub": [57.052, 9.908],
    };
    const [lat, lng] = LOCATION_COORDS[a.location] || [57.048, 9.918];
    return {
      id: a.id, name: a.title, lat, lng, category: "events" as PinCategory,
      description: a.description, rating: 4.3, isEvent: true, spots: a.spots, image: a.image,
    } satisfies MapPin;
  }),

  // KØBENHAVN
  { id: "cph1", name: "Tivoli", lat: 55.674, lng: 12.568, category: "kultur", description: "Verdens næstældste forlystelsespark. Koncerter, mad og eventyr.", rating: 4.7 },
  { id: "cph2", name: "Nyhavn", lat: 55.680, lng: 12.591, category: "mad", description: "Ikonisk havnepromenade med farverige huse, restauranter og caféer.", rating: 4.5 },
  { id: "cph3", name: "Kødbyen", lat: 55.668, lng: 12.561, category: "mad", description: "Trendy kødby-kvarter med gallerier, restauranter og natklubber.", rating: 4.4 },

  // AARHUS
  { id: "aar1", name: "ARoS Kunstmuseum", lat: 56.154, lng: 10.200, category: "kultur", description: "Ikonisk kunstmuseum med Rainbow Panorama på taget.", rating: 4.8 },
  { id: "aar2", name: "Den Gamle By", lat: 56.160, lng: 10.191, category: "kultur", description: "Åben friluftsmuseum med historiske bygninger fra hele Danmark.", rating: 4.7 },

  // ODENSE
  { id: "ode1", name: "HC Andersen Hus", lat: 55.396, lng: 10.390, category: "kultur", description: "Museum dedikeret til HC Andersen med interaktive udstillinger.", rating: 4.6 },

  // NIBE
  { id: "nib1", name: "Nibe Havn", lat: 56.988, lng: 9.635, category: "natur", description: "Hyggelig lille fiskerihavn med caféer og udsigt over Limfjorden.", rating: 4.3 },
  { id: "nib2", name: "Nibe Festival plads", lat: 56.990, lng: 9.638, category: "musik", description: "Hjem for Nibe Festival — populær sommermusikfestival.", rating: 4.7 },

  // SKAGEN
  { id: "ska1", name: "Grenen", lat: 57.748, lng: 10.635, category: "natur", description: "Danmarks nordligste punkt. Her mødes Skagerrak og Kattegat.", rating: 4.9 },

  // ROLD SKOV
  { id: "rol1", name: "Rebild Bakker", lat: 56.836, lng: 9.827, category: "natur", description: "Smuk nationalpark i Rold Skov. Vandreruter og sprækkedal.", rating: 4.7 },

  // MUSIK
  { id: "mu1", name: "Skråen Musiksted", lat: 57.049, lng: 9.922, category: "musik", description: "Aalborgs legendære spillested i Nordkraft. Live musik.", rating: 4.6 },
  { id: "mu2", name: "Studenterhuset", lat: 57.047, lng: 9.921, category: "musik", description: "Live musik, jamsessions og kulturelle events.", rating: 4.2 },

  // KREATIVT
  { id: "kr1", name: "Kunsten Museum atelierer", lat: 57.042, lng: 9.899, category: "kreativt", description: "Museum for moderne kunst med atelierer og workshops.", rating: 4.7 },
  { id: "kr2", name: "Nordkraft Atelierer", lat: 57.048, lng: 9.923, category: "kreativt", description: "Åbne atelierer. Keramik, maleri, fotografi og DIY-workshops.", rating: 4.4 },
  { id: "kr3", name: "Aalborg Fotoklub", lat: 57.045, lng: 9.915, category: "kreativt", description: "Fotoklub med ugentlige fotwalks og workshops.", rating: 4.3 },

  // FITNESS
  { id: "fi1", name: "CrossFit Aalborg", lat: 57.040, lng: 9.925, category: "fitness", description: "CrossFit-box med fællesskab i fokus. WODs og open gym.", rating: 4.6 },
  { id: "fi2", name: "Aalborg Klatreklub", lat: 57.044, lng: 9.910, category: "fitness", description: "Indendørs klatrecenter med bouldering og topreb.", rating: 4.5 },
  { id: "fi3", name: "Vestre Bådehavns Vinterbad", lat: 57.050, lng: 9.905, category: "fitness", description: "Vinterbadning med sauna. Kold dukkert og varmt fællesskab.", rating: 4.8 },

  // OUTDOOR
  { id: "ou1", name: "Egholm Fuglereservat", lat: 57.065, lng: 9.865, category: "outdoor", description: "Fuglereservat med udsigtsTårn. Vådenge og vadefugle.", rating: 4.6 },
  { id: "ou2", name: "Lille Vildmose Naturcenter", lat: 56.880, lng: 10.200, category: "outdoor", description: "Guidede ture i Nordeuropas største højmose. Krondyr og ørne.", rating: 4.9 },
  { id: "ou3", name: "Aalborg Kajakklub", lat: 57.052, lng: 9.908, category: "outdoor", description: "Kajakklub ved Limfjorden. Lån kajak eller SUP-board.", rating: 4.4 },
  { id: "ou4", name: "Aalborg Ridecenter", lat: 57.030, lng: 9.880, category: "outdoor", description: "Rideskole med heste til alle niveauer.", rating: 4.3 },

  // SOCIALT
  { id: "so1", name: "Café Ministeriet", lat: 57.047, lng: 9.919, category: "socialt", description: "Hyggelig café med brætspil og bogklub.", rating: 4.5 },
  { id: "so2", name: "Studenterhuset Aalborg", lat: 57.047, lng: 9.921, category: "socialt", description: "Kulturhus med sprogcafé, filmklub og sociale events.", rating: 4.3 },
  { id: "so3", name: "Frivilligcenter Aalborg", lat: 57.046, lng: 9.916, category: "socialt", description: "Mødested for frivillige. Forældregrupper og netværk.", rating: 4.2 },

  // EVENTS
  { id: "ev1", name: "Aalborg Comedy Club", lat: 57.048, lng: 9.920, category: "events", description: "Stand-up comedy med lokale og nationale komikere.", rating: 4.5, isEvent: true },
  { id: "ev2", name: "Søgaards Bryghus — Pub Quiz", lat: 57.047, lng: 9.919, category: "events", description: "Ugentlig pub quiz med øl fra eget bryggeri.", rating: 4.6, isEvent: true },
  { id: "ev3", name: "Nytorv Loppemarked", lat: 57.048, lng: 9.918, category: "events", description: "Månedligt loppemarked med vintage og genbrug.", rating: 4.3, isEvent: true },

  // KARRIERE
  { id: "ka1", name: "Aalborg Startupværksted", lat: 57.046, lng: 9.922, category: "karriere", description: "Co-working space og iværksættermøø.", rating: 4.4 },
  { id: "ka2", name: "NOVI Innovation", lat: 57.015, lng: 9.985, category: "karriere", description: "Nordjyllands største innovationsmøø.", rating: 4.5 },
  { id: "ka3", name: "AAU Inkubator", lat: 57.015, lng: 9.975, category: "karriere", description: "Aalborg Universitets iværksættermøø.", rating: 4.3 },

  // TECH
  { id: "te1", name: "Aalborg Hackerspace", lat: 57.044, lng: 9.912, category: "tech", description: "Maker space med 3D-printere og coding meetups.", rating: 4.4 },
  { id: "te2", name: "NOVI Science Park", lat: 57.015, lng: 9.985, category: "tech", description: "Tech-hub med gaming events og drone-workshops.", rating: 4.5 },
];

export const ALL_PINS = HARDCODED_PINS;

// City coordinate lookup
const CITY_COORDS: Record<string, [number, number]> = {
  "Aalborg": [57.048, 9.9187],
  "København": [55.676, 12.568],
  "Aarhus": [56.162, 10.203],
  "Odense": [55.396, 10.388],
  "Esbjerg": [55.467, 8.452],
  "Vejle": [55.711, 9.536],
  "Randers": [56.462, 10.036],
  "Viborg": [56.453, 9.402],
  "Herning": [56.139, 8.974],
  "Silkeborg": [56.170, 9.545],
  "Horsens": [55.862, 9.850],
  "Kolding": [55.490, 9.472],
  "Roskilde": [55.642, 12.080],
  "Hjørring": [57.464, 9.982],
  "Frederikshavn": [57.440, 10.536],
  "Slagelse": [55.402, 11.354],
  "Holbæk": [55.717, 11.713],
  "Næstved": [55.230, 11.760],
  "Helsingborg": [56.036, 12.614],
};

// Default fallback (Aalborg)
const DEFAULT_LAT = 57.048;
const DEFAULT_LNG = 9.9187;

/* ── Supabase place → category mapping ── */
const SUPABASE_CAT_MAP: Record<string, PinCategory> = {
  natur: "natur", hike: "natur", vandring: "vandring", hundeskov: "hund",
  shelter: "shelter", dyrespot: "dyrespot", fiskeri: "fiskeri",
  strand: "badning", badning: "badning", vand: "badning", badestrand: "badning",
  kultur: "kultur", museum: "kultur", kreativt: "kreativt",
  sport: "sport", aktiv_sport: "aktiv_sport", loeb: "loeb", mtb: "mtb", fitness: "fitness",
  mad: "mad", mad_hangout: "mad_hangout",
  // New 10 locked categories
  rejser: "rejser", transport: "rejser", tog: "rejser", bus: "rejser", faerge: "rejser",
  logi: "logi", camping: "logi", vandrerhjem: "logi", hytter: "logi", glamping: "logi",
  wellness: "wellness", yoga: "wellness", meditation: "wellness", sauna: "wellness",
  communities: "communities", bogklub: "communities", braetspil: "communities",
  ture: "ture", eventyr: "ture", kajak: "ture",
  aktiv: "aktiv",
};

function placeToPin(place: Place): MapPin {
  let cat: PinCategory = "natur";
  const cats = [...(place.main_categories || []), ...(place.tags || [])];
  for (const c of cats) {
    const key = c.toLowerCase().replace(/[\s-]/g, "");
    for (const [mapKey, val] of Object.entries(SUPABASE_CAT_MAP)) {
      if (key.includes(mapKey) || mapKey.includes(key)) { cat = val; break; }
    }
    if (cat !== "natur") break;
  }
  return {
    id: `sb-${place.id}`, name: place.name, lat: place.latitude, lng: place.longitude,
    category: cat, description: place.description, rating: place.rating_avg || 0,
    ratingCount: place.rating_count || 0, tags: place.tags, city: place.city, fromSupabase: true,
  };
}

/* ── Supabase event → MapPin ── */
function supabaseEventToPin(event: SupabaseEvent): MapPin | null {
  if (!event.latitude || !event.longitude) return null;
  return {
    id: `ev-${event.id}`,
    eventId: event.id,
    name: event.title,
    lat: event.latitude,
    lng: event.longitude,
    category: "events",
    description: event.description,
    rating: 0,
    isEvent: true,
    isSupabaseEvent: true,
    fromSupabase: true,
    tags: event.interest_tags || [],
    image: event.image_url || undefined,
    date: event.date,
    price: event.price,
    city: event.location,
  };
}

/* ── Pin icon: colored emoji circle ── */
function createEmojiIcon(emoji: string, hex: string, size: number = 32): L.DivIcon {
  return L.divIcon({
    className: "b-pin",
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${hex};border:2.5px solid rgba(255,255,255,0.9);box-shadow:0 2px 8px rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;font-size:${Math.round(size * 0.45)}px;line-height:1;">${emoji}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

/* ── Haversine distance ── */
function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/* ── Map internal components ── */
function ZoomControls() {
  const map = useMap();
  return (
    <div className="absolute bottom-28 right-3 z-[1000] flex flex-col gap-1.5">
      <button onClick={() => map.zoomIn()} className="w-10 h-10 rounded-xl bg-[#0f142d]/90 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 hover:bg-white/15 transition-colors shadow-lg" data-testid="button-zoom-in">
        <Plus size={18} />
      </button>
      <button onClick={() => map.zoomOut()} className="w-10 h-10 rounded-xl bg-[#0f142d]/90 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 hover:bg-white/15 transition-colors shadow-lg" data-testid="button-zoom-out">
        <Minus size={18} />
      </button>
    </div>
  );
}

function MapRecenter({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => { map.flyTo(center, zoom, { duration: 0.8 }); }, [center, zoom, map]);
  return null;
}

/* ── Pin detail bottom sheet ── */
function PinDetail({ pin, onClose }: { pin: MapPin; onClose: () => void }) {
  const meta = CATEGORY_META[pin.category] || CATEGORY_META["natur"];
  const dist = distanceKm(DEFAULT_LAT, DEFAULT_LNG, pin.lat, pin.lng);
  const distText = dist < 1 ? `${Math.round(dist * 1000)} m` : `${dist.toFixed(1)} km`;
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${pin.lat},${pin.lng}`;
  const headerImg = pin.image || PIN_HEADER_IMAGES[pin.category] || PIN_HEADER_IMAGES["natur"];

  return (
    <div className="absolute bottom-20 left-3 right-3 z-[1100] animate-in slide-in-from-bottom-4 duration-300" data-testid="pin-detail">
      <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(15, 20, 45, 0.96)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)" }}>
        {/* Header image */}
        <div className="h-28 relative overflow-hidden">
          <img src={headerImg} alt={pin.name} className="absolute inset-0 w-full h-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f142d] via-[#0f142d]/40 to-transparent" />
          {/* Category badge */}
          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ background: pin.isSupabaseEvent ? "#f97316" : meta.hex }}>
            {pin.isSupabaseEvent ? "🎉 Event" : `${meta.emoji} ${meta.label}`}
          </span>
          {pin.fromSupabase && (
            <span className="absolute top-2.5 right-10 px-2 py-0.5 rounded-full bg-[#4ECDC4]/90 text-white text-[9px] font-bold">DB</span>
          )}
          <button onClick={onClose} className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white/80 hover:bg-black/60" data-testid="button-close-detail">
            <X size={14} />
          </button>
        </div>

        <div className="p-3.5">
          <h3 className="text-white font-bold text-[15px] leading-tight mb-1">{pin.name}</h3>

          {/* Rating + distance */}
          <div className="flex items-center gap-2 mb-2 text-[11px]">
            <div className="flex items-center gap-0.5">
              <Star size={11} className="text-amber-400 fill-amber-400" />
              <span className="text-white/60">{pin.rating.toFixed(1)}</span>
              {pin.ratingCount ? <span className="text-white/30">({pin.ratingCount})</span> : null}
            </div>
            <span className="text-white/20">·</span>
            <span className="text-white/50 flex items-center gap-0.5"><MapPinIcon size={10} />{distText}</span>
            {pin.city && (<><span className="text-white/20">·</span><span className="text-white/50">{pin.city}</span></>)}
            {pin.difficulty && (
              <>
                <span className="text-white/20">·</span>
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                  pin.difficulty === "Let" ? "bg-green-500/20 text-green-400" :
                  pin.difficulty === "Middel" ? "bg-amber-500/20 text-amber-400" :
                  "bg-red-500/20 text-red-400"
                }`}>{pin.difficulty}</span>
              </>
            )}
          </div>

          {/* Tags */}
          {pin.tags && pin.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {pin.tags.slice(0, 5).map(t => (
                <span key={t} className="px-1.5 py-0.5 rounded-full bg-white/8 text-white/40 text-[9px]">{t}</span>
              ))}
            </div>
          )}

          {/* Event date + price */}
          {pin.isSupabaseEvent && pin.date && (
            <div className="flex items-center gap-2 mb-2 text-[11px]">
              <span className="text-[#f97316] font-medium">
                {new Date(pin.date).toLocaleDateString("da-DK", { day: "numeric", month: "short", year: "numeric" })}
              </span>
              {pin.price != null && (
                <>
                  <span className="text-white/20">·</span>
                  <span className="text-white/60">{pin.price === 0 ? "Gratis" : `${pin.price} kr`}</span>
                </>
              )}
            </div>
          )}

          <p className="text-white/55 text-xs leading-relaxed mb-3">{pin.description}</p>

          {/* Event spots */}
          {pin.isEvent && pin.spots && (
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-white/40 text-[10px] flex items-center gap-1"><Users size={10} />{pin.spots.current}/{pin.spots.total} tilmeldt</span>
                <span className={`text-[10px] font-semibold ${(pin.spots.total - pin.spots.current) <= 1 ? "text-orange-400" : "text-[#4ECDC4]"}`}>
                  {pin.spots.total - pin.spots.current} pladser
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div className={`h-full rounded-full ${(pin.spots.total - pin.spots.current) <= 1 ? "bg-orange-400" : "bg-[#4ECDC4]"}`} style={{ width: `${(pin.spots.current / pin.spots.total) * 100}%` }} />
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2">
            {pin.isSupabaseEvent && pin.eventId ? (
              <>
                <Link href={`/event/${pin.eventId}`} className="flex-1 py-2.5 rounded-xl bg-[#f97316] text-white text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-[#ea580c] transition-colors">
                  Deltag
                </Link>
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="py-2.5 px-3 rounded-xl bg-white/10 text-white text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-white/15 transition-colors">
                  <Navigation size={13} />
                </a>
              </>
            ) : pin.fromSupabase ? (
              <>
                <Link href={`/sted/${pin.id.startsWith('sb-') ? pin.id.slice(3) : pin.id}`} className="flex-1 py-2.5 rounded-xl bg-[#4ECDC4] text-white text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-[#0ea572] transition-colors">
                  Se mere
                </Link>
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="py-2.5 px-3 rounded-xl bg-white/10 text-white text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-white/15 transition-colors">
                  <ExternalLink size={13} />
                </a>
              </>
            ) : (
              <>
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="flex-1 py-2.5 rounded-xl bg-[#4ECDC4] text-white text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-[#0ea572] transition-colors">
                  <Navigation size={13} /> Vis rute
                </a>
                {pin.isEvent && (
                  <button className="flex-1 py-2.5 rounded-xl bg-[#f97316] text-white text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-[#ea580c] transition-colors">
                    Deltag
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════ KORT PAGE ═══════════════════ */
export default function Kort() {
  const { city } = useTags();
  const [priceFilter, setPriceFilter] = useState<"alle" | "gratis" | "premium">("alle");
  const [search, setSearch] = useState("");
  const [selectedPin, setSelectedPin] = useState<MapPin | null>(null);
  const [flyTo, setFlyTo] = useState<{ center: [number, number]; zoom: number } | null>(null);
  const [showLayer, setShowLayer] = useState<"alle" | "steder" | "events">("alle");
  const searchRef = useRef<HTMLInputElement>(null);

  // Dynamic user location from profile city
  const [USER_LAT, USER_LNG] = CITY_COORDS[city] || [DEFAULT_LAT, DEFAULT_LNG];

  // Fetch Supabase places
  const { data: supabasePlaces } = useQuery<Place[]>({
    queryKey: ["supabase-places"],
    queryFn: fetchPlaces,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch Supabase events
  const { data: supabaseEvents } = useQuery<SupabaseEvent[]>({
    queryKey: ["supabase-events-map"],
    queryFn: fetchEvents,
    staleTime: 5 * 60 * 1000,
  });

  // Convert events to pins
  const eventPins = useMemo(() => {
    return (supabaseEvents || [])
      .map(supabaseEventToPin)
      .filter((p): p is MapPin => p !== null);
  }, [supabaseEvents]);

  // Merge pins
  const allPins = useMemo(() => {
    const sbPins = (supabasePlaces || []).map(placeToPin);
    const sbNames = new Set(sbPins.map(p => p.name.toLowerCase()));
    const hardcodedFiltered = HARDCODED_PINS.filter(p => !sbNames.has(p.name.toLowerCase()));
    const placePins = [...sbPins, ...hardcodedFiltered];
    return [...placePins, ...eventPins];
  }, [supabasePlaces, eventPins]);

  const PREMIUM_CATS = new Set(["kultur", "mad", "mad_hangout", "musik", "events", "karriere", "tech", "rejser", "logi"]);
  const GRATIS_CATS = new Set(["natur", "vandring", "mtb", "loeb", "hund", "fiskeri", "badning", "shelter", "dyrespot", "outdoor", "sport", "aktiv_sport", "aktiv", "fitness", "socialt", "spil", "kreativt", "ture", "communities", "wellness"]);

  const filteredPins = useMemo(() => {
    return allPins.filter((p) => {
      // Layer toggle: events vs places
      if (showLayer === "events" && !p.isSupabaseEvent) return false;
      if (showLayer === "steder" && p.isSupabaseEvent) return false;
      if (priceFilter === "gratis" && PREMIUM_CATS.has(p.category)) return false;
      if (priceFilter === "premium" && GRATIS_CATS.has(p.category)) return false;
      const q = search.toLowerCase();
      if (!q) return true;
      // Tag-tree-aware search
      const tagResults = searchTags(q);
      const expandedTerms = [q, ...tagResults.map(t => t.tag.toLowerCase()), ...tagResults.map(t => t.label.toLowerCase())];
      return expandedTerms.some(term =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(term)))
      );
    });
  }, [priceFilter, search, allPins, showLayer]);

  // Pre-create emoji icons for each category
  const categoryIcons = useMemo(() => {
    const icons: Record<string, L.DivIcon> = {};
    for (const [key, meta] of Object.entries(CATEGORY_META)) {
      icons[key] = createEmojiIcon(meta.emoji, meta.hex, 34);
    }
    return icons;
  }, []);

  // Distinct pulsing icon for Supabase events (orange/coral)
  const supabaseEventIcon = useMemo(() => L.divIcon({
    className: "b-pin",
    html: `<div style="width:36px;height:36px;border-radius:50%;background:#f97316;border:3px solid rgba(255,255,255,0.95);box-shadow:0 0 14px rgba(249,115,22,0.6),0 2px 8px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;font-size:16px;line-height:1;animation:b-event-pulse 2s ease-out infinite;">🎉</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  }), []);

  function handleRecenter() {
    setFlyTo({ center: [USER_LAT, USER_LNG], zoom: 14 });
    setSelectedPin(null);
  }

  function handlePinClick(pin: MapPin) {
    setSelectedPin(pin);
    setFlyTo({ center: [pin.lat, pin.lng], zoom: 15 });
  }

  return (
    <div className="relative w-full h-svh pb-[72px]" data-testid="kort-page">
      {/* ── Search bar + Gratis / Premium ── */}
      <div className="absolute top-0 left-0 right-0 z-[1000] pt-12 px-4 pb-2" style={{ background: "linear-gradient(to bottom, rgba(10,14,35,0.92) 60%, transparent)" }}>
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              ref={searchRef}
              type="search"
              placeholder="Søg steder..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setSelectedPin(null); }}
              className="w-full pl-10 pr-8 py-2.5 rounded-xl text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-1 focus:ring-[#4ECDC4]/50"
              style={{ background: "rgba(20, 26, 55, 0.9)", border: "1px solid rgba(255,255,255,0.1)" }}
              data-testid="input-search-map"
            />
            {search && (
              <button onClick={() => { setSearch(""); searchRef.current?.blur(); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
                <X size={14} />
              </button>
            )}
          </div>
          <button
            onClick={() => { setPriceFilter(priceFilter === "gratis" ? "alle" : "gratis"); setSelectedPin(null); }}
            className={`px-3.5 py-2.5 rounded-xl text-[11px] font-semibold transition-all whitespace-nowrap flex-shrink-0 ${
              priceFilter === "gratis" ? "bg-[#4ECDC4] text-white shadow-lg shadow-[#4ECDC4]/30" : "text-white/60 hover:text-white/80"
            }`}
            style={priceFilter !== "gratis" ? { background: "rgba(20, 26, 55, 0.9)", border: "1px solid rgba(255,255,255,0.1)" } : undefined}
            data-testid="filter-gratis"
          >
            Gratis
          </button>
          <button
            onClick={() => { setPriceFilter(priceFilter === "premium" ? "alle" : "premium"); setSelectedPin(null); }}
            className={`px-3.5 py-2.5 rounded-xl text-[11px] font-semibold transition-all whitespace-nowrap flex-shrink-0 ${
              priceFilter === "premium" ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30" : "text-white/60 hover:text-white/80"
            }`}
            style={priceFilter !== "premium" ? { background: "rgba(20, 26, 55, 0.9)", border: "1px solid rgba(255,255,255,0.1)" } : undefined}
            data-testid="filter-premium"
          >
            Premium
          </button>
        </div>
        {/* Layer toggle + pin count */}
        <div className="mt-2 px-1 flex items-center gap-3">
          <div className="flex gap-1.5">
            {(["alle", "steder", "events"] as const).map(layer => (
              <button
                key={layer}
                onClick={() => { setShowLayer(layer); setSelectedPin(null); }}
                className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all ${
                  showLayer === layer
                    ? layer === "events"
                      ? "bg-[#f97316] text-white"
                      : "bg-[#4ECDC4] text-white"
                    : "bg-white/8 text-white/40 hover:text-white/60"
                }`}
                data-testid={`filter-layer-${layer}`}
              >
                {layer === "alle" ? "📍 Alle" : layer === "steder" ? "🏛️ Steder" : "🎉 Events"}
              </button>
            ))}
          </div>
          <span className="text-white/30 text-[10px]">
            {filteredPins.length} {showLayer === "events" ? "events" : showLayer === "steder" ? "steder" : "pins"}
            {showLayer === "alle" && eventPins.length > 0 && ` (${eventPins.length} events)`}
          </span>
        </div>
      </div>

      {/* ── Leaflet Map ── */}
      <MapContainer
        center={[USER_LAT, USER_LNG]}
        zoom={12}
        className="w-full h-full"
        zoomControl={false}
        attributionControl={false}
        style={{ background: "#0D1220" }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
        />

        {/* User location pulse */}
        <CircleMarker center={[USER_LAT, USER_LNG]} radius={7} pathOptions={{ color: "#3b82f6", fillColor: "#3b82f6", fillOpacity: 1, weight: 3, opacity: 0.4 }} />
        <CircleMarker center={[USER_LAT, USER_LNG]} radius={18} pathOptions={{ color: "#3b82f6", fillColor: "#3b82f6", fillOpacity: 0.12, weight: 1, opacity: 0.2 }} />

        {/* Clustered pins */}
        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={50}
          spiderfyOnMaxZoom
          showCoverageOnHover={false}
          iconCreateFunction={(cluster: any) => {
            const count = cluster.getChildCount();
            const size = count > 50 ? 48 : count > 20 ? 42 : 36;
            return L.divIcon({
              html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:rgba(16,185,129,0.85);border:2.5px solid rgba(255,255,255,0.8);box-shadow:0 2px 12px rgba(16,185,129,0.4);display:flex;align-items:center;justify-content:center;font-size:${size > 42 ? 14 : 12}px;font-weight:700;color:white;">${count}</div>`,
              className: "b-pin",
              iconSize: L.point(size, size),
            });
          }}
        >
          {filteredPins.map((pin) => (
            <Marker
              key={pin.id}
              position={[pin.lat, pin.lng]}
              icon={pin.isSupabaseEvent ? supabaseEventIcon : (categoryIcons[pin.category] || createEmojiIcon("📍", "#4ECDC4", 34))}
              eventHandlers={{ click: () => handlePinClick(pin) }}
            />
          ))}
        </MarkerClusterGroup>

        <ZoomControls />
        {flyTo && <MapRecenter center={flyTo.center} zoom={flyTo.zoom} />}
      </MapContainer>

      {/* ── Recenter button ── */}
      <button
        onClick={handleRecenter}
        className="absolute bottom-28 left-3 z-[1000] w-10 h-10 rounded-xl bg-[#0f142d]/90 backdrop-blur-md border border-white/10 flex items-center justify-center text-[#4ECDC4] hover:bg-white/15 transition-colors shadow-lg"
        data-testid="button-near-me"
      >
        <Navigation size={18} />
      </button>

      {/* ── Pin Detail ── */}
      {selectedPin && <PinDetail pin={selectedPin} onClose={() => setSelectedPin(null)} />}

      <CalmBottomNav />

      <style>{`
        @keyframes b-event-pulse {
          0% { box-shadow: 0 0 14px rgba(249,115,22,0.6), 0 2px 8px rgba(0,0,0,0.4); }
          50% { box-shadow: 0 0 22px rgba(249,115,22,0.9), 0 2px 8px rgba(0,0,0,0.4); }
          100% { box-shadow: 0 0 14px rgba(249,115,22,0.6), 0 2px 8px rgba(0,0,0,0.4); }
        }
      `}</style>
    </div>
  );
   }
