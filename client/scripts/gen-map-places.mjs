/**
 * ASCII-only script: builds map-places.ts with UTF-8 Bengali via \u escapes.
 * Run: node scripts/gen-map-places.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(__dirname, "../src/lib/dummy/map-places.ts");

const u = (s) => s;

const places = [
  {
    id: "madhupur-uz-health-complex",
    category: "hospital",
    name: {
      bn: u(
        "\u09ae\u09a7\u09c1\u09aa\u09c1\u09b0 \u0989\u09aa\u099c\u09c7\u09b2\u09be \u09b8\u09cd\u09ac\u09be\u09b8\u09cd\u09a5\u09cd\u09af \u0995\u09ae\u09aa\u09cd\u09b2\u09c7\u0995\u09cd\u09b8",
      ),
      en: "Madhupur Upazila Health Complex",
    },
    address: {
      bn: u(
        "\u09ae\u09a7\u09c1\u09aa\u09c1\u09b0, \u099f\u09be\u0982\u0997\u09be\u0987\u09b2 (\u0989\u09aa\u099c\u09c7\u09b2\u09be \u09b8\u09a6\u09b0, \u09b8\u09cd\u09ac\u09be\u09b8\u09cd\u09a5\u09cd\u09af \u0995\u09ae\u09aa\u09cd\u09b2\u09c7\u0995\u09cd\u09b8 \u09b0\u09cb\u09a1)",
      ),
      en: "Madhupur, Tangail (upazila HQ, Health Complex Road)",
    },
    description: {
      bn: u(
        "\u0989\u09aa\u099c\u09c7\u09b2\u09be\u09b0 \u09aa\u09cd\u09b0\u09a7\u09be\u09a8 \u09b8\u09b0\u0995\u09be\u09b0\u09bf \u09b8\u09cd\u09ac\u09be\u09b8\u09cd\u09a5\u09cd\u09af \u0995\u09c7\u09a8\u09cd\u09a6\u09cd\u09b0\u09c7\u0964 \u099c\u09b0\u09c1\u09b0\u09bf \u09ac\u09bf\u09ad\u09be\u0997, \u09ac\u09b9\u09bf\u09b0\u09cd\u09ac\u09bf\u09ad\u09be\u0997 (\u0993\u09aa\u09bf\u09a1\u09bf), \u09ae\u09be\u09a4\u09c3 \u0993 \u09b6\u09bf\u09b6\u09c1 \u09b8\u09cd\u09ac\u09be\u09b8\u09cd\u09a5\u09cd\u09af, \u099f\u09bf\u0995\u09be\u09a6\u09be\u09a8 \u0993 \u09a8\u09ae\u09c1\u09a8\u09be \u09b8\u0982\u0997\u09cd\u09b0\u09b9\u2014\u09ac\u09bf\u09b6\u09c7\u09b7\u099c\u09cd\u099e \u0995\u09cd\u09b2\u09bf\u09a8\u09bf\u0995\u09c7\u09b0 \u09b8\u09ae\u09af\u09bc\u09b8\u09c2\u099a\u09bf \u0995\u09be\u09b0\u09cd\u09af\u09be\u09b2\u09df\u09c7\u09b0 \u09a8\u09cb\u099f\u09bf\u09b8\u09c7 \u09aa\u09cd\u09b0\u0995\u09be\u09b6\u09bf\u09a4 \u09a5\u09be\u0995\u09c7\u0964",
      ),
      en: "The upazila’s main government hospital. Typical services include emergency, outpatient (OPD), maternal and child health, immunization, and lab collection—confirm specialist OPD days on notices at the facility.",
    },
    services: {
      bn: u(
        "\u099c\u09b0\u09c1\u09b0\u09bf \u00b7 \u0993\u09aa\u09bf\u09a1\u09bf \u00b7 \u09ae\u09be\u09a4\u09c3\u09b6\u09bf\u09b6\u09c1 \u00b7 \u099f\u09bf\u0995\u09be \u00b7 \u09b2\u09cd\u09af\u09be\u09ac \u09b8\u09b9\u09be\u09af\u09bc\u09a4\u09be",
      ),
      en: "Emergency · OPD · MCH · Immunization · Lab support",
    },
    hours: {
      bn: u(
        "\u099c\u09b0\u09c1\u09b0\u09bf: \u09a8\u09bf\u09af\u09bc\u09ae\u09bf\u09a4 \u09a8\u09c0\u09a4\u09bf\u09ae\u09be\u09b2\u09be \u0986\u09a8\u09c1\u09af\u09bc\u09be\u09af\u09bc\u09c0\u0964 \u09ac\u09b9\u09bf\u09b0\u09cd\u09ac\u09bf\u09ad\u09be\u0997: \u09b8\u09be\u09a7\u09be\u09b0\u09a3\u09a4 \u0995\u09b0\u09cd\u09ae\u09a6\u09bf\u09ac\u09b8\u09c7 \u09b8\u0995\u09be\u09b2\u2013\u09ac\u09bf\u0995\u09be\u09b2\u0964",
      ),
      en: "Emergency: 24h subject to policy. OPD: weekday daytime hours; confirm for holidays.",
    },
    image:
      "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=900&q=80",
    hotline: "16263",
    dutyPhone: "09228-56004",
    dutyOfficer: {
      bn: u(
        "\u0989\u09aa\u099c\u09c7\u09b2\u09be \u09b8\u09cd\u09ac\u09be\u09b8\u09cd\u09a5\u09cd\u09af \u0993 \u09aa\u09b0\u09bf\u09ac\u09be\u09b0 \u09aa\u09b0\u09bf\u0995\u09b2\u09cd\u09aa\u09a8\u09be \u0995\u09b0\u09cd\u09ae\u0995\u09b0\u09cd\u09a4\u09be: \u09a1\u09be. \u09ae\u09cb\u09b9\u09be\u09ae\u09cd\u09ae\u09a6 \u09b8\u09be\u0987\u09a6\u09c1\u09b0 \u09b0\u09b9\u09ae\u09be\u09a8 (\u09ae\u09cb\u09ac\u09be\u0987\u09b2: \u09e6\u09e7\u09e7\u09e6\u2013\u09ee\u09eb\u09e9\u09e9\u09e9\u09e9)",
      ),
      en: "Upazila Health & Family Planning Officer: Dr. Mohammad Saidur Rahman (mobile: 01710-853397)",
    },
    lat: 24.6169,
    lng: 90.0268,
  },
  {
    id: "madhupur-central-diagnostic",
    category: "hospital",
    name: {
      bn: u(
        "\u09ae\u09a7\u09c1\u09aa\u09c1\u09b0 \u09b8\u09c7\u09a8\u09cd\u099f\u09cd\u09b0\u09be\u09b2 \u09a1\u09be\u09af\u09bc\u09be\u0997\u09a8\u09b8\u09cd\u099f\u09bf\u0995 \u0985\u09cd\u09af\u09be\u09a8\u09cd\u09a1 \u09b9\u09be\u09b8\u09aa\u09be\u09a4\u09be\u09b2 \u09b2\u09bf\u09ae\u09bf\u099f\u09c7\u09a1",
      ),
      en: "Madhupur Central Diagnostic & Hospital Ltd.",
    },
    address: {
      bn: u(
        "\u09ae\u09a7\u09c1\u09aa\u09c1\u09b0 \u09ac\u09be\u099c\u09be\u09b0 \u09b8\u0982\u09b2\u0997\u09cd\u09a8, \u099f\u09be\u0982\u0997\u09be\u0987\u09b2 \u09b0\u09cb\u09a1",
      ),
      en: "Near Madhupur Bazar, Tangail Road",
    },
    description: {
      bn: u(
        "\u09ac\u09c7\u09b8\u09b0\u0995\u09be\u09b0\u09bf \u09a1\u09be\u09af\u09bc\u09be\u0997\u09a8\u09b8\u09cd\u099f\u09bf\u0995 \u0993 \u0987\u09a8\u09a1\u09cb\u09b0 \u099a\u09bf\u0995\u09bf\u09b8\u09cd\u09b8\u09be\u0964 \u0987\u0989\u098f\u09b8\u099c\u09bf, \u098f\u0995\u09cd\u09b8\u2013\u09b0\u09c7, \u09aa\u09cd\u09af\u09be\u09a5\u09cb\u09b2\u09cb\u099c\u09bf \u0993 \u0995\u09a8\u09b8\u09be\u09b2\u09cd\u099f\u09cd\u09af\u09be\u09a8\u09cd\u099f \u099a\u09cd\u09af\u09be\u09ae\u09cd\u09ac\u09be\u09b0\u2014\u09b8\u09c7\u09ac\u09be \u0993 \u09b8\u09ae\u09af\u09bc \u09b8\u09be\u09aa\u09cd\u09a4\u09be\u09b9\u09bf\u0995\u09ad\u09be\u09ac\u09c7 \u0986\u09aa\u09a1\u09c7\u099f \u09b9\u09a4\u09c7 \u09aa\u09be\u09b0\u09c7\u0964",
      ),
      en: "Private diagnostics and indoor care. USG, X-ray, pathology, and consultant chambers—hours and panels may change; confirm at reception.",
    },
    services: {
      bn: u(
        "\u09a1\u09be\u09af\u09bc\u09be\u0997\u09a8\u09b8\u09cd\u099f\u09bf\u0995 \u00b7 \u0987\u09a8\u09a1\u09cb\u09b0 \u00b7 \u0995\u09a8\u09b8\u09be\u09b2\u09cd\u099f\u09cd\u09af\u09be\u09a8\u09cd\u099f \u099a\u09cd\u09af\u09be\u09ae\u09cd\u09ac\u09be\u09b0",
      ),
      en: "Diagnostics · Indoor care · Consultant chambers",
    },
    hours: {
      bn: u(
        "\u09b8\u09be\u09a7\u09be\u09b0\u09a3\u09a4 \u09b8\u0995\u09be\u09b2 \u09ee\u09e6\u09f3\u09e6 \u2013 \u09b0\u09be\u09a4 \u09ef\u09e6\u09f3\u09e6 (\u09b6\u09c1\u0995\u09cd\u09b0\u09ac\u09be\u09b0 \u09b8\u0982\u0995\u09cd\u09b7\u09bf\u09aa\u09cd\u09a4 \u09b8\u09ae\u09af\u09bc \u09b9\u09a4\u09c7 \u09aa\u09be\u09b0\u09c7)\u0964",
      ),
      en: "Typically 08:00–21:00 (shorter hours possible on Friday).",
    },
    image:
      "https://images.unsplash.com/photo-1516549655169-83fadc96267a?auto=format&fit=crop&w=900&q=80",
    hotline: "09613-787878",
    dutyPhone: "01722-334455",
    dutyOfficer: {
      bn: u(
        "\u09b9\u09be\u09b8\u09aa\u09be\u09a4\u09be\u09b2 \u09ac\u09cd\u09af\u09ac\u09b8\u09cd\u09a5\u09be\u09aa\u0995 (\u09a1\u09bf\u09af\u09bc\u09c1\u099f\u09bf \u09ae\u09cb\u09ac\u09be\u0987\u09b2)",
      ),
      en: "Hospital manager (duty mobile)",
    },
    lat: 24.6224,
    lng: 90.0392,
  },
  {
    id: "madhupur-police-station",
    category: "police",
    name: {
      bn: u("\u09ae\u09a7\u09c1\u09aa\u09c1\u09b0 \u09a5\u09be\u09a8\u09be, \u099f\u09be\u0982\u0997\u09be\u0987\u09b2"),
      en: "Madhupur Police Station, Tangail",
    },
    address: {
      bn: u(
        "\u09ae\u09a7\u09c1\u09aa\u09c1\u09b0 \u0989\u09aa\u099c\u09c7\u09b2\u09be \u09b8\u09a6\u09b0, \u09a5\u09be\u09a8\u09be \u09b0\u09cb\u09a1",
      ),
      en: "Madhupur Upazila HQ, Thana Road",
    },
    description: {
      bn: u(
        "\u099c\u09bf\u09a1\u09bf, \u09b8\u09be\u09a7\u09be\u09b0\u09a3 \u09a1\u09be\u09af\u09bc\u09c7\u09b0\u09bf, \u09b9\u09be\u09b0\u09be\u09a8\u09cb \u099c\u09bf\u09a8\u09bf\u09b8, \u099f\u09cd\u09b0\u09be\u09ab\u09bf\u0995 \u0993 \u0986\u0987\u09a8\u09b6\u09c3\u0999\u09cd\u0996\u09b2\u09be\u2014\u09a5\u09be\u09a8\u09be\u09af\u09bc \u09af\u09cb\u0997\u09be\u09af\u09cb\u0997 \u0995\u09b0\u09c1\u09a8\u0964 \u099c\u09c0\u09ac\u09a8\u09b9\u09be\u09a8\u09bf\u09b0 \u099c\u09b0\u09c1\u09b0\u09bf \u0995\u09cd\u09b7\u09c7\u09a4\u09cd\u09b0\u09c7 \u09ef\u09ef\u09ef \u09a1\u09be\u09af\u09bc\u09be\u09b2 \u0995\u09b0\u09c1\u09a8\u0964",
      ),
      en: "For GD, general diary, lost & found, traffic, and public order, contact the station. For life-threatening emergencies, dial 999.",
    },
    services: {
      bn: u(
        "\u099c\u09bf\u09a1\u09bf \u00b7 \u09a1\u09be\u09af\u09bc\u09c7\u09b0\u09bf \u00b7 \u0986\u0987\u09a8\u09bf \u0997\u09cd\u09b0\u09b9\u09a3 \u00b7 \u099f\u09cd\u09b0\u09be\u09ab\u09bf\u0995",
      ),
      en: "GD · Diary · Legal intake · Traffic",
    },
    hours: {
      bn: u(
        "\u09a5\u09be\u09a8\u09be \u09a1\u09bf\u09af\u09bc\u09c1\u099f\u09bf \u09a1\u09c7\u09b8\u09cd\u0995: \u09b8\u09be\u09b0\u09be\u0995\u09cd\u09b7\u09a3 (\u099c\u09b0\u09c1\u09b0\u09bf)\u0964",
      ),
      en: "Duty desk: 24 hours for emergencies.",
    },
    image:
      "https://images.unsplash.com/photo-1596265371388-43edbaadab94?auto=format&fit=crop&w=900&q=80",
    hotline: "999",
    dutyPhone: "01320-099800",
    dutyOfficer: {
      bn: u(
        "\u09ad\u09be\u09b0\u09aa\u09cd\u09b0\u09be\u09aa\u09cd\u09a4 \u0995\u09b0\u09cd\u09ae\u0995\u09b0\u09cd\u09a4\u09be (\u0993\u09b8\u09bf) \u09a1\u09c7\u09b8\u09cd\u0995\u2014\u09b8\u09b0\u09be\u09b8\u09b0\u09bf \u09b2\u09be\u0987\u09a8 \u09b8\u09cd\u09a5\u09be\u09a8\u09c0\u09af\u09bc\u09ad\u09be\u09ac\u09c7 \u09a8\u09bf\u09b6\u09cd\u099a\u09bf\u09a4 \u0995\u09b0\u09c1\u09a8\u0964",
      ),
      en: "OC desk—confirm the direct landline/mobile locally.",
    },
    lat: 24.6184,
    lng: 90.0316,
  },
  {
    id: "madhupur-highway-police",
    category: "police",
    name: {
      bn: u(
        "\u09ae\u09a7\u09c1\u09aa\u09c1\u09b0 \u09b9\u09be\u0987\u0993\u09af\u09bc\u09c7 \u09aa\u09c1\u09b2\u09bf\u09b6 \u0986\u0989\u099f\u09aa\u09cb\u09b8\u09cd\u099f",
      ),
      en: "Madhupur Highway Police Outpost",
    },
    address: {
      bn: u(
        "\u09a2\u09be\u0995\u09be\u2013\u09ae\u09af\u09bc\u09ae\u09a8\u09b8\u09bf\u0982\u09b9 \u09ae\u09b9\u09be\u09b8\u09a1\u09bc\u0995, \u09ae\u09a7\u09c1\u09aa\u09c1\u09b0 \u0985\u0982\u09b6",
      ),
      en: "Dhaka–Mymensingh Highway, Madhupur section",
    },
    description: {
      bn: u(
        "\u09ae\u09b9\u09be\u09b8\u09a1\u09bc\u0995\u09c7 \u09a6\u09c1\u09b0\u09cd\u0998\u099f\u09a8\u09be \u09aa\u09cd\u09b0\u09a4\u09bf\u09b0\u09cb\u09a7, \u0997\u09a4\u09bf \u09a8\u09bf\u09af\u09bc\u09a8\u09cd\u09a4\u09cd\u09b0\u09a3 \u0993 \u099c\u09b0\u09c1\u09b0\u09bf \u09b8\u09b9\u09be\u09af\u09bc\u09a4\u09be\u0964 \u0987\u0989\u09a8\u09bf\u099f \u09a8\u09ae\u09cd\u09ac\u09b0 \u09b8\u09cd\u09a5\u09be\u09a8\u09c0\u09af\u09bc\u09ad\u09be\u09ac\u09c7 \u0986\u09aa\u09a1\u09c7\u099f \u09b9\u09a4\u09c7 \u09aa\u09be\u09b0\u09c7\u0964",
      ),
      en: "Highway patrol, crash response, and enforcement. Unit numbers may change—verify with Tangail Police.",
    },
    services: {
      bn: u(
        "\u09b9\u09be\u0987\u0993\u09af\u09bc\u09c7 \u099f\u09b9\u09b2 \u00b7 \u09a6\u09c1\u09b0\u09cd\u0998\u099f\u09a8\u09be \u00b7 \u099f\u09cd\u09b0\u09be\u09ab\u09bf\u0995 \u09a8\u09bf\u09af\u09bc\u09a8\u09cd\u09a4\u09cd\u09b0\u09a3",
      ),
      en: "Highway patrol · Accident response · Traffic control",
    },
    hours: {
      bn: u(
        "\u09a8\u09bf\u09af\u09bc\u09ae\u09bf\u09a4 \u099f\u09b9\u09b2 (\u09aa\u09cd\u09b0\u099a\u09b2\u09bf\u09a4 \u09ac\u09cd\u09af\u09ac\u09b8\u09cd\u09a5\u09be)\u0964",
      ),
      en: "24-hour patrol (typical).",
    },
    image:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=900&q=80",
    hotline: "999",
    dutyPhone: "01769-692380",
    dutyOfficer: {
      bn: u(
        "\u09ae\u09a7\u09c1\u09aa\u09c1\u09b0 \u09b8\u09be\u09b0\u09cd\u0995\u09c7\u09b2 \u002f \u09b9\u09be\u0987\u0993\u09af\u09bc\u09c7 \u0987\u0989\u09a8\u09bf\u099f (\u09aa\u09cd\u09b0\u0995\u09be\u09b6\u09bf\u09a4 \u09ae\u09cb\u09ac\u09be\u0987\u09b2 \u09af\u09cb\u0997\u09be\u09af\u09cb\u0997)\u0964",
      ),
      en: "Madhupur Circle / highway unit (published mobile contact).",
    },
    lat: 24.6128,
    lng: 90.0445,
  },
  {
    id: "madhupur-govt-pilot-high-school",
    category: "school",
    name: {
      bn: u(
        "\u09ae\u09a7\u09c1\u09aa\u09c1\u09b0 \u09b8\u09b0\u0995\u09be\u09b0\u09bf \u09aa\u09be\u0987\u09b2\u099f \u0989\u099a\u09cd\u099a \u09ae\u09be\u09a7\u09cd\u09af\u09ae\u09bf\u0995 \u09ac\u09bf\u09a6\u09cd\u09af\u09be\u09b2\u09af\u09bc",
      ),
      en: "Madhupur Government Pilot High School",
    },
    address: {
      bn: u("\u09ae\u09a7\u09c1\u09aa\u09c1\u09b0, \u099f\u09be\u0982\u0997\u09be\u0987\u09b2"),
      en: "Madhupur, Tangail",
    },
    description: {
      bn: u(
        "\u0989\u09aa\u099c\u09c7\u09b2\u09be\u09b0 \u09aa\u09cd\u09b0\u09a7\u09be\u09a8 \u09b8\u09b0\u0995\u09be\u09b0\u09bf \u09ae\u09be\u09a7\u09cd\u09af\u09ae\u09bf\u0995 \u09ac\u09bf\u09a6\u09cd\u09af\u09be\u09b2\u09af\u09bc\u0997\u09c1\u09b2\u09cb\u09b0 \u098f\u0995\u099f\u09bf\u0964 \u09ad\u09b0\u09cd\u09a4\u09bf, \u09aa\u09b0\u09c0\u0995\u09cd\u09b7\u09be \u0993 \u0995\u09cd\u09b2\u09be\u09b8 \u09b0\u09c1\u099f\u09bf\u09a8 \u09ac\u09bf\u09a6\u09cd\u09af\u09be\u09b2\u09af\u09bc \u0995\u09be\u09b0\u09cd\u09af\u09be\u09b2\u09df \u09a5\u09c7\u0995\u09c7 \u099c\u09be\u09a8\u09be \u09af\u09be\u09ac\u09c7\u0964",
      ),
      en: "A major government secondary school in the upazila. Admission, exams, and routines are announced by the school office.",
    },
    services: {
      bn: u(
        "\u09ef\u09e9\u09e6\u2013\u09e7\u09e6 \u09b6\u09cd\u09b0\u09c7\u09a3\u09bf \u00b7 \u09ac\u09bf\u099c\u09cd\u099e\u09be\u09a8 \u0993 \u09ae\u09be\u09a8\u09ac\u09bf\u0995 \u09b6\u09be\u0996\u09be",
      ),
      en: "Grades 6–10 · Science & humanities",
    },
    hours: {
      bn: u(
        "\u0995\u09cd\u09b2\u09be\u09b8: \u09b8\u09be\u09a7\u09be\u09b0\u09a3\u09a4 \u09b8\u0995\u09be\u09b2 \u09ed\u09f3\u09e9\u09e6 \u2013 \u09ac\u09bf\u0995\u09be\u09b2 \u09e9\u09f3\u09e6\u09e6 (\u09ac\u09bf\u09a6\u09cd\u09af\u09be\u09b2\u09af\u09bc \u0995\u09cd\u09af\u09be\u09b2\u09c7\u09a8\u09cd\u09a1\u09be\u09b0 \u0986\u09a8\u09c1\u09af\u09bc\u09be\u09af\u09bc\u09c0)\u0964",
      ),
      en: "Classes: typically 07:30–15:00 per school calendar.",
    },
    image:
      "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=900&q=80",
    hotline: "09228-56111",
    dutyPhone: "01711-223344",
    dutyOfficer: {
      bn: u(
        "\u09aa\u09cd\u09b0\u09a7\u09be\u09a8 \u09b6\u09bf\u0995\u09cd\u09b7\u0995 \u002f \u09ac\u09bf\u09a6\u09cd\u09af\u09be\u09b2\u09af\u09bc \u0995\u09be\u09b0\u09cd\u09af\u09be\u09b2\u09df",
      ),
      en: "Head teacher / school office",
    },
    lat: 24.6206,
    lng: 90.0298,
  },
  {
    id: "madhupur-govt-girls-high-school",
    category: "school",
    name: {
      bn: u(
        "\u09ae\u09a7\u09c1\u09aa\u09c1\u09b0 \u09b8\u09b0\u0995\u09be\u09b0\u09bf \u09ac\u09be\u09b2\u09bf\u0995\u09be \u0989\u099a\u09cd\u099a \u09ae\u09be\u09a7\u09cd\u09af\u09ae\u09bf\u0995 \u09ac\u09bf\u09a6\u09cd\u09af\u09be\u09b2\u09af\u09bc",
      ),
      en: "Madhupur Government Girls' High School",
    },
    address: {
      bn: u(
        "\u09ae\u09a7\u09c1\u09aa\u09c1\u09b0 \u09aa\u09cc\u09b0 \u098f\u09b2\u09be\u0995\u09be, \u099f\u09be\u0982\u0997\u09be\u0987\u09b2",
      ),
      en: "Madhupur municipal area, Tangail",
    },
    description: {
      bn: u(
        "\u09ac\u09be\u09b2\u09bf\u0995\u09be\u09a6\u09c7\u09b0 \u099c\u09a8\u09cd\u09af \u09b8\u09b0\u0995\u09be\u09b0\u09bf \u09ae\u09be\u09a7\u09cd\u09af\u09ae\u09bf\u0995 \u09b6\u09bf\u0995\u09cd\u09b7\u09be \u09aa\u09cd\u09b0\u09a4\u09bf\u09b7\u09cd\u09a0\u09be\u09a8\u0964 \u09ad\u09b0\u09cd\u09a4\u09bf \u0993 \u09a8\u09cb\u099f\u09bf\u09b8\u09c7 \u09b8\u09ae\u09af\u09bc\u09b8\u09c2\u099a\u09bf \u09a6\u09c7\u0996\u09c1\u09a8\u0964",
      ),
      en: "Government secondary school for girls. Check the office and notice board for admission and schedules.",
    },
    services: {
      bn: u(
        "\u09ef\u09e9\u09e6\u2013\u09e7\u09e6 \u09b6\u09cd\u09b0\u09c7\u09a3\u09bf \u00b7 \u09b8\u09b9\u09aa\u09a0\u09cd\u09af\u0995\u09cd\u09b0\u09ae \u0993 \u09b8\u09be\u0982\u09b8\u09cd\u0995\u09c3\u09a4\u09bf\u0995 \u0995\u09be\u09b0\u09cd\u09af\u0995\u09cd\u09b0\u09ae",
      ),
      en: "Grades 6–10 · Co-curricular activities",
    },
    hours: {
      bn: u(
        "\u0995\u09cd\u09b2\u09be\u09b8: \u09b8\u0995\u09be\u09b2 \u09ed\u09f3\u09ea\u09e9 \u2013 \u09ac\u09bf\u0995\u09be\u09b2 \u09e8\u09f3\u09ea\u09e9 (\u09aa\u09cd\u09b0\u09a4\u09bf\u09b7\u09cd\u09a0\u09be\u09a8 \u0995\u09cd\u09af\u09be\u09b2\u09c7\u09a8\u09cd\u09a1\u09be\u09b0 \u0986\u09a8\u09c1\u09af\u09bc\u09be\u09af\u09bc\u09c0)\u0964",
      ),
      en: "Classes: 07:45–14:45 per institutional calendar.",
    },
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80",
    hotline: "09228-56222",
    dutyOfficer: {
      bn: u(
        "\u09aa\u09cd\u09b0\u09a7\u09be\u09a8 \u09b6\u09bf\u0995\u09cd\u09b7\u09bf\u0995\u09be \u002f \u0995\u09be\u09b0\u09cd\u09af\u09be\u09b2\u09df \u09b8\u09b9\u0995\u09be\u09b0\u09c0",
      ),
      en: "Head teacher / office staff",
    },
    lat: 24.6152,
    lng: 90.0334,
  },
  {
    id: "madhupur-upazila-parishad",
    category: "office",
    name: {
      bn: u(
        "\u09ae\u09a7\u09c1\u09aa\u09c1\u09b0 \u0989\u09aa\u099c\u09c7\u09b2\u09be \u09aa\u09b0\u09bf\u09b7\u09a6 \u0995\u09be\u09b0\u09cd\u09af\u09be\u09b2\u09df",
      ),
      en: "Madhupur Upazila Parishad Office",
    },
    address: {
      bn: u(
        "\u0989\u09aa\u099c\u09c7\u09b2\u09be \u09aa\u09b0\u09bf\u09b7\u09a6 \u099a\u09a4\u09cd\u09ac\u09b0, \u09ae\u09a7\u09c1\u09aa\u09c1\u09b0, \u099f\u09be\u0982\u0997\u09be\u0987\u09b2",
      ),
      en: "Upazila Parishad premises, Madhupur, Tangail",
    },
    description: {
      bn: u(
        "\u0989\u09a8\u09cd\u09a8\u09af\u09bc\u09a8 \u09aa\u09b0\u09bf\u0995\u09b2\u09cd\u09aa\u09a8\u09be, \u09b8\u09ae\u09ac\u09be\u09af\u09bc, \u09aa\u09b0\u09bf\u09b7\u09a6 \u09b8\u09ad\u09be \u0993 \u09a8\u09be\u0997\u09b0\u09bf\u0995 \u09b8\u09c7\u09ac\u09be \u09b8\u0982\u0995\u09cd\u09b0\u09be\u09a8\u09cd\u09a4 \u0995\u09be\u099c\u0964 \u09a8\u09bf\u09b0\u09cd\u09a6\u09bf\u09b7\u09cd\u099f \u09b8\u09c7\u09ac\u09be\u09b0 \u099c\u09a8\u09cd\u09af \u09b8\u0982\u09b6\u09cd\u09b2\u09bf\u09b7\u09cd\u099f \u09b6\u09be\u0996\u09be\u09af\u09bc \u09af\u09cb\u0997\u09be\u09af\u09cb\u0997 \u0995\u09b0\u09c1\u09a8\u0964",
      ),
      en: "Upazila council administration, planning, and citizen services. Visit the relevant section for certificates and project information.",
    },
    services: {
      bn: u(
        "\u09aa\u09b0\u09bf\u09b7\u09a6 \u09aa\u09cd\u09b0\u09b6\u09be\u09b8\u09a8 \u00b7 \u0989\u09a8\u09cd\u09a8\u09af\u09bc\u09a8 \u09b8\u09ae\u09a8\u09cd\u09ac\u09af\u09bc \u00b7 \u09a8\u09be\u0997\u09b0\u09bf\u0995 \u09b8\u09c7\u09ac\u09be",
      ),
      en: "Council admin · Development coordination · Citizen services",
    },
    hours: {
      bn: u(
        "\u09b0\u09ac\u09bf\u2013\u09ac\u09c3\u09b9\u09b8\u09cd\u09aa\u09a4\u09bf: \u09b8\u09be\u09a7\u09be\u09b0\u09a3\u09a4 \u09b8\u0995\u09be\u09b2 \u09ef\u09f3\u09e6\u09e6 \u2013 \u09ac\u09bf\u0995\u09be\u09b2 \u09ec\u09f3\u09e6\u09e6 (\u09b6\u09c1\u0995\u09cd\u09b0\u2013\u09b6\u09a8\u09bf \u099b\u09c1\u099f\u09bf)\u0964",
      ),
      en: "Sun–Thu: typically 09:00–16:00 (Fri–Sat closed unless notified).",
    },
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
    hotline: "09228-56001",
    dutyPhone: "01712-334455",
    dutyOfficer: {
      bn: u(
        "\u0989\u09aa\u099c\u09c7\u09b2\u09be \u09a8\u09bf\u09b0\u09cd\u09ac\u09be\u09b9\u09c0 \u0995\u09b0\u09cd\u09ae\u0995\u09b0\u09cd\u09a4\u09be\u09b0 \u0995\u09be\u09b0\u09cd\u09af\u09be\u09b2\u09df \u002f \u09aa\u09b0\u09bf\u09b7\u09a6 \u09b8\u099a\u09bf\u09ac \u09b6\u09be\u0996\u09be",
      ),
      en: "UNO office / Parishad secretary section",
    },
    lat: 24.6187,
    lng: 90.0339,
  },
  {
    id: "madhupur-pourashava",
    category: "office",
    name: {
      bn: u(
        "\u09ae\u09a7\u09c1\u09aa\u09c1\u09b0 \u09aa\u09cc\u09b0\u09b8\u09ad\u09be \u0995\u09be\u09b0\u09cd\u09af\u09be\u09b2\u09df",
      ),
      en: "Madhupur Paurashava (Municipality) Office",
    },
    address: {
      bn: u(
        "\u09aa\u09cc\u09b0\u09b8\u09ad\u09be \u09b0\u09cb\u09a1, \u09ae\u09a7\u09c1\u09aa\u09c1\u09b0, \u099f\u09be\u0982\u0997\u09be\u0987\u09b2",
      ),
      en: "Paurashava Road, Madhupur, Tangail",
    },
    description: {
      bn: u(
        "\u09aa\u09cc\u09b0 \u09b8\u09c7\u09ac\u09be: \u09b9\u09cb\u09b2\u09cd\u09a1\u09bf\u0982 \u099f\u09cd\u09af\u09be\u0995\u09cd\u09b8, \u09a8\u09be\u0997\u09b0\u09bf\u0995 \u09b8\u09a8\u09a6, \u09a8\u09bf\u09b0\u09cd\u09ae\u09be\u09a3 \u0986\u09a8\u09c1\u09ae\u09cb\u09a6\u09a8, \u09ac\u09be\u099c\u09be\u09b0 \u0993 \u09aa\u09b0\u09bf\u09b8\u09cd\u0995\u09be\u09b0 \u09aa\u09b0\u09bf\u099a\u09cd\u099b\u09a8\u09cd\u09a8\u09a4\u09be\u0964 \u09ab\u09b0\u09cd\u09ae \u0993 \u09ab\u09bf \u0995\u09be\u09b0\u09cd\u09af\u09be\u09b2\u09df \u09a5\u09c7\u0995\u09c7 \u099c\u09be\u09a8\u09be \u09af\u09be\u09ac\u09c7\u0964",
      ),
      en: "Municipal services: holding tax, certificates, building permissions, markets, and sanitation. Forms and fees at the office.",
    },
    services: {
      bn: u(
        "\u09b9\u09cb\u09b2\u09cd\u09a1\u09bf\u0982 \u099f\u09cd\u09af\u09be\u0995\u09cd\u09b8 \u00b7 \u09b8\u09a8\u09a6 \u00b7 \u09a8\u09bf\u09b0\u09cd\u09ae\u09be\u09a3 \u0986\u09a8\u09c1\u09ae\u09cb\u09a6\u09a8 \u00b7 \u09aa\u09b0\u09bf\u099a\u09cd\u099b\u09a8\u09cd\u09a8\u09a4\u09be",
      ),
      en: "Holding tax · Certificates · Building permit · Sanitation",
    },
    hours: {
      bn: u(
        "\u09b0\u09ac\u09bf\u2013\u09ac\u09c3\u09b9\u09b8\u09cd\u09aa\u09a4\u09bf: \u09b8\u09be\u09a7\u09be\u09b0\u09a3\u09a4 \u09b8\u0995\u09be\u09b2 \u09e7\u09e6\u09f3\u09e6\u09e6 \u2013 \u09ac\u09bf\u0995\u09be\u09b2 \u09ec\u09f3\u09e6\u09e6\u0964",
      ),
      en: "Sun–Thu: typically 10:00–16:00.",
    },
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80",
    hotline: "09228-56333",
    dutyPhone: "01713-445566",
    dutyOfficer: {
      bn: u(
        "\u09ae\u09c7\u09af\u09bc\u09b0\u09c7\u09b0 \u0995\u09be\u09b0\u09cd\u09af\u09be\u09b2\u09df \u002f \u09aa\u09cc\u09b0 \u09b8\u099a\u09bf\u09ac \u09b6\u09be\u0996\u09be",
      ),
      en: "Mayor’s office / municipal secretary section",
    },
    lat: 24.6198,
    lng: 90.0365,
  },
  {
    id: "jalchatra-bazar",
    category: "bazar",
    name: {
      bn: u("\u099c\u09b2\u099b\u09a4\u09cd\u09b0 \u09ac\u09be\u099c\u09be\u09b0"),
      en: "Jalchatra Bazaar",
    },
    address: {
      bn: u("\u0986\u09b0\u09a8\u0996\u09cb\u09b2\u09be \u0987\u0989\u09a8\u09bf\u09af\u09bc\u09a8, \u09ae\u09a7\u09c1\u09aa\u09c1\u09b0, \u099f\u09be\u0982\u0997\u09be\u0987\u09b2"),
      en: "Arankhola Union, Madhupur, Tangail",
    },
    description: {
      bn: u("\u09ae\u09a7\u09c1\u09aa\u09c1\u09b0 \u099f\u09cd\u09b0\u09cd\u09af\u09be\u0995\u09cd\u099f\u09c7\u09b0 \u09ac\u09dc \u09b9\u09be\u099f\u2014\u0986\u09a8\u09be\u09b0\u09b8 \u0993 \u0995\u09b2\u09be \u09ac\u09bf\u0995\u09cd\u09b0\u09bf\u09b0 \u09aa\u09cd\u09b0\u09a7\u09be\u09a8 \u0995\u09c7\u09a8\u09cd\u09a6\u09cd\u09b0; \u09a6\u09c2\u09b0\u09a6\u09c2\u09b0\u09be\u09a8\u09cd\u09a4 \u099c\u09be\u09af\u09bc\u0997\u09be \u09a5\u09c7\u0995\u09c7 \u0986\u09a1\u09bc\u09a4\u09a6\u09be\u09b0 \u0993 \u09aa\u09be\u0987\u0995\u09be\u09b0 \u0986\u09b8\u09c7\u09a8\u09c7\u0964 \u09b8\u09cd\u09a5\u09be\u09a8\u09c0\u09af\u09bc\u09ad\u09be\u09ac\u09c7 \u2018\u099c\u09b2\u099b\u09a4\u09cd\u09b0\u2019 \u09a8\u09be\u09ae\u09c7 \u09aa\u09b0\u09bf\u099a\u09bf\u09a4\u0964"),
      en: "A major market on the Madhupur tract for pineapples and bananas; wholesalers and traders come from across Bangladesh. Locally known as Jalchatra.",
    },
    services: {
      bn: u("\u0996\u09c1\u099a\u09b0\u09be \u0993 \u09aa\u09be\u0987\u0995\u09be\u09b0\u09bf \u09ab\u09b2 \u00b7 \u09b9\u09be\u099f\u09c7\u09b0 \u09a6\u09bf\u09a8\u09c7 \u09ac\u09c8\u09a4\u09bf\u0995 \u09b8\u09cd\u099f\u09b2 \u00b7 \u09aa\u09b0\u09bf\u09ac\u09b9\u09a8 \u09b8\u0982\u09af\u09cb\u0997"),
      en: "Retail & wholesale fruit \u00b7 extra stalls on hat days \u00b7 transport links",
    },
    hours: {
      bn: u("\u09ad\u09cb\u09b0 \u09a5\u09c7\u0995\u09c7 \u09b8\u09a8\u09cd\u09a7\u09cd\u09af\u09be \u09aa\u09b0\u09cd\u09af\u09a8\u09cd\u09a4 (\u09b9\u09be\u099f\u09c7\u09b0 \u09a6\u09bf\u09a8 \u0993 \u09ae\u09cc\u09b8\u09c1\u09ae\u09c7 \u09b8\u09ae\u09af\u09bc \u09aa\u09b0\u09bf\u09ac\u09b0\u09cd\u09a4\u09a8 \u09b9\u09a4\u09c7 \u09aa\u09be\u09b0\u09c7)\u0964"),
      en: "Dawn to evening (hat days and seasons may shift hours).",
    },
    image:
      "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=900&q=80",
    dutyPhone: "01711-000000",
    dutyOfficer: {
      bn: u("\u09ac\u09be\u099c\u09be\u09b0 \u0995\u09ae\u09bf\u099f\u09bf / \u09ac\u09cd\u09af\u09ac\u09b8\u09cd\u09a5\u09be\u09aa\u09a8\u09be \u09b6\u09be\u0996\u09be"),
      en: "Bazaar committee / management",
    },
    lat: 24.617,
    lng: 90.025,
  },
  {
    id: "madhupur-bus-stand-bazar",
    category: "bazar",
    name: {
      bn: u("\u09ae\u09a7\u09c1\u09aa\u09c1\u09b0 \u09ac\u09be\u09b8 \u09b8\u09cd\u099f\u09cd\u09af\u09be\u09a8\u09cd\u09a1 \u098f\u09b2\u09be\u0995\u09be\u09b0 \u09ae\u09c2\u09b2 \u09ac\u09be\u099c\u09be\u09b0"),
      en: "Main bazar (Madhupur bus stand area)",
    },
    address: {
      bn: u("\u099f\u09cd\u09b0\u09be\u0987-\u099c\u0982\u09b6\u09a8 \u09b8\u0982\u09b2\u0997\u09cd\u09a8, \u09ae\u09a7\u09c1\u09aa\u09c1\u09b0 \u09aa\u09cc\u09b0 \u098f\u09b2\u09be\u0995\u09be, \u099f\u09be\u0982\u0997\u09be\u0987\u09b2"),
      en: "Near the tri-junction, Madhupur pourashava, Tangail",
    },
    description: {
      bn: u("\u099f\u09be\u0982\u0997\u09be\u0987\u09b2, \u09ae\u09df\u09ae\u09a8\u09b8\u09bf\u0982\u09b9 \u0993 \u099c\u09be\u09ae\u09be\u09b2\u09aa\u09c1\u09b0\u0997\u09be\u09ae\u09c0 \u09b8\u09dc\u0995\u09c7\u09b0 \u09ae\u09cb\u09a1\u09bc\u09c7 \u0997\u09a1\u09bc\u09c7 \u0989\u09a0\u09be \u09a6\u09c8\u09a8\u09a8\u09cd\u09a6\u09bf\u09a8 \u09ac\u09be\u099c\u09be\u09b0\u2014\u0995\u09be\u099a\u09be\u09ae\u09be\u09b2, \u09ae\u09c1\u09a6\u09bf, \u0995\u09be\u09aa\u09a1\u09bc \u0993 \u09af\u09be\u09a4\u09cd\u09b0\u09c0\u09b8\u09c7\u09ac\u09be\u09b0 \u09a6\u09cb\u0995\u09be\u09a8\u09aa\u09be\u099f\u0964"),
      en: "Daily market by the tri-junction of the Tangail, Mymensingh, and Jamalpur roads\u2014groceries, dry goods, cloth, and traveller services.",
    },
    services: {
      bn: u("\u09ae\u09c1\u09a6\u09bf \u0993 \u0995\u09be\u099a\u09be\u09ae\u09be\u09b2 \u00b7 \u0995\u09be\u09aa\u09a1\u09bc \u00b7 \u099b\u09cb\u099f \u0996\u09be\u09ac\u09be\u09b0 \u00b7 \u09af\u09be\u09a4\u09cd\u09b0\u09c0 \u09b8\u09c1\u09ac\u09bf\u09a7\u09be"),
      en: "Groceries \u00b7 dry goods \u00b7 cloth \u00b7 light meals \u00b7 traveller amenities",
    },
    hours: {
      bn: u("\u09b8\u0995\u09be\u09b2 \u09a5\u09c7\u0995\u09c7 \u09b0\u09be\u09a4 \u09aa\u09b0\u09cd\u09af\u09a8\u09cd\u09a4 (\u09a6\u09cb\u0995\u09be\u09a8\u09ad\u09c7\u09a1\u09bc\u09c7 \u09ad\u09bf\u09a8\u09cd\u09a8)\u0964"),
      en: "Morning through night (varies by shop).",
    },
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80",
    dutyPhone: "01712-000000",
    dutyOfficer: {
      bn: u("\u09ac\u09be\u099c\u09be\u09b0 \u0995\u09ae\u09bf\u099f\u09bf / \u09aa\u09cc\u09b0\u09b8\u09ad\u09be \u09ac\u09be\u099c\u09be\u09b0 \u09b6\u09be\u0996\u09be"),
      en: "Bazaar committee / municipal market desk",
    },
    lat: 24.6194,
    lng: 90.0358,
  },
  {
    id: "madhupur-sadar-jame-mosque",
    category: "mosque",
    name: {
      bn: u("\u09ae\u09a7\u09c1\u09aa\u09c1\u09b0 \u09b8\u09a6\u09b0 \u0995\u09c7\u09a8\u09cd\u09a6\u09cd\u09b0\u09c0\u09af\u09bc \u099c\u09be\u09ae\u09c7 \u09ae\u09b8\u099c\u09bf\u09a6"),
      en: "Madhupur Sadar Central Jame Masjid",
    },
    address: {
      bn: u("\u09aa\u09cc\u09b0\u09b8\u09ad\u09be \u098f\u09b2\u09be\u0995\u09be, \u09ae\u09a7\u09c1\u09aa\u09c1\u09b0, \u099f\u09be\u0982\u0997\u09be\u0987\u09b2"),
      en: "Pourashava area, Madhupur, Tangail",
    },
    description: {
      bn: u("\u09b8\u09b9\u09b0 \u098f\u09b2\u09be\u0995\u09be\u09b0 \u09aa\u09cd\u09b0\u09a7\u09be\u09a8 \u099c\u09c1\u09ae\u09b0 \u09a6\u09bf\u09a8\u2014\u09a8\u09be\u09ae\u09be\u099c, \u09ae\u09be\u09a6\u09cd\u09b0\u09be\u09b8\u09be \u0995\u09be\u09b0\u09cd\u09af\u09bf\u0995\u09cd\u09b0\u09ae \u0993 \u09a7\u09b0\u09cd\u09ae\u09c0\u09af\u09bc \u0986\u09af\u09cb\u099c\u09a8\u0964 \u09b8\u09cd\u09a5\u09be\u09a8\u09c0\u09af\u09bc \u09a8\u09cb\u099f\u09bf\u09b8 \u09a5\u09c7\u0995\u09c7 \u09b8\u09ae\u09af\u09bc\u09b8\u09c2\u099a\u09bf \u09a8\u09bf\u09b6\u09cd\u099a\u09bf\u09a4 \u0995\u09b0\u09c1\u09a8\u0964"),
      en: "Main Friday mosque for the town\u2014prayer, madrasa activity, and religious events. Confirm timings on local notices.",
    },
    services: {
      bn: u("\u09aa\u09be\u0981\u099a \u0993\u09af\u09bc\u09be\u0995\u09cd\u09a4 \u09a8\u09be\u09ae\u09be\u099c \u00b7 \u099c\u09c1\u09ae\u09be \u00b7 \u099c\u09be\u09a8\u09be\u099c\u09be \u0993 \u09ae\u09be\u09a6\u09cd\u09b0\u09be\u09b8\u09be \u09b8\u09b9\u09be\u09af\u09bc\u09a4\u09be"),
      en: "Five daily prayers \u00b7 Jumuah \u00b7 funeral & madrasa support",
    },
    hours: {
      bn: u("\u09ab\u099c\u09b0 \u09a5\u09c7\u0995\u09c7 \u0987\u09b6\u09be \u09aa\u09b0\u09cd\u09af\u09a8\u09cd\u09a4 \u0996\u09cb\u09b2\u09be; \u099c\u09c1\u09ae\u09be\u09af\u09bc \u09ad\u09bf\u09a1\u09bc \u09ac\u09c7\u09b6\u09bf\u0964"),
      en: "Open Fajr\u2013Isha; Jumuah is busiest.",
    },
    image:
      "https://images.unsplash.com/photo-1583484963886-cfe2bff2945f?auto=format&fit=crop&w=900&q=80",
    dutyPhone: "01713-000000",
    dutyOfficer: {
      bn: u("\u0987\u09ae\u09be\u09ae / \u09ae\u09b8\u099c\u09bf\u09a6 \u09ac\u09cd\u09af\u09ac\u09b8\u09cd\u09a5\u09be\u09aa\u09a8\u09be \u0995\u09ae\u09bf\u099f\u09bf"),
      en: "Imam / mosque management committee",
    },
    lat: 24.6191,
    lng: 90.0345,
  },
  {
    id: "jalchatra-bazar-jame-mosque",
    category: "mosque",
    name: {
      bn: u("\u099c\u09b2\u099b\u09a4\u09cd\u09b0 \u09ac\u09be\u099c\u09be\u09b0 \u099c\u09be\u09ae\u09c7 \u09ae\u09b8\u099c\u09bf\u09a6"),
      en: "Jalchatra Bazar Jame Masjid",
    },
    address: {
      bn: u("\u099c\u09b2\u099b\u09a4\u09cd\u09b0 \u09ac\u09be\u099c\u09be\u09b0 \u09b8\u0982\u09b2\u0997\u09cd\u09a8, \u0986\u09b0\u09a8\u0996\u09cb\u09b2\u09be, \u09ae\u09a7\u09c1\u09aa\u09c1\u09b0"),
      en: "Adjoining Jalchatra Bazar, Arankhola, Madhupur",
    },
    description: {
      bn: u("\u09b9\u09be\u099f \u098f\u09b2\u09be\u0995\u09be\u09b0 \u099c\u09be\u09ae\u09c7 \u09ae\u09b8\u099c\u09bf\u09a6\u2014\u09ac\u09a3\u09bf\u0995, \u0995\u09c3\u09b7\u0995 \u0993 \u09aa\u09b0\u09bf\u09ac\u09b9\u09a8 \u0995\u09b0\u09cd\u09ae\u09c0\u09a6\u09c7\u09b0 \u099c\u09c1\u09ae\u09be \u0993 \u09a6\u09c8\u09a8\u09a8\u09cd\u09a6\u09bf\u09a8 \u09a8\u09be\u09ae\u09be\u099c\u09c7\u09b0 \u09b8\u09c1\u09ac\u09bf\u09a7\u09be\u0964"),
      en: "Jame mosque serving the hat area\u2014Friday and daily prayers for traders, farmers, and transport workers.",
    },
    services: {
      bn: u("\u099c\u09c1\u09ae\u09be \u00b7 \u09aa\u09be\u0981\u099a \u0993\u09af\u09bc\u09be\u0995\u09cd\u09a4 \u00b7 \u0987\u09a6 \u0993 \u09a4\u09be\u09ac\u09be\u09b0\u0995 \u099c\u09be\u09ae\u09be\u09a4"),
      en: "Jumuah \u00b7 five daily \u00b7 Eid congregations",
    },
    hours: {
      bn: u("\u09a8\u09be\u09ae\u09be\u099c\u09c7\u09b0 \u0993\u09af\u09bc\u09be\u0995\u09cd\u09a4 \u0985\u09a8\u09c1\u09af\u09be\u09af\u09bc\u09c0\u0964"),
      en: "According to prayer times.",
    },
    image:
      "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=900&q=80",
    dutyPhone: "01714-000000",
    dutyOfficer: {
      bn: u("\u0996\u09a4\u09bf\u09ac-\u0987\u09ae\u09be\u09ae / \u09ae\u09b8\u099c\u09bf\u09a6 \u0995\u09ae\u09bf\u099f\u09bf"),
      en: "Khatib-imam / mosque committee",
    },
    lat: 24.6165,
    lng: 90.0248,
  },
  {
    id: "madhupur-hindu-mandir",
    category: "temple",
    name: {
      bn: u("\u09ae\u09a7\u09c1\u09aa\u09c1\u09b0 \u09b9\u09bf\u09a8\u09cd\u09a6\u09c1 \u09b8\u09ae\u09cd\u09aa\u09cd\u09b0\u09a6\u09be\u09af\u09bc\u09c7\u09b0 \u09aa\u09c2\u099c\u09be \u09ae\u09a8\u09cd\u09a6\u09bf\u09b0"),
      en: "Hindu community Puja Mandir, Madhupur",
    },
    address: {
      bn: u("\u09aa\u09cc\u09b0 \u098f\u09b2\u09be\u0995\u09be, \u09ae\u09a7\u09c1\u09aa\u09c1\u09b0, \u099f\u09be\u0982\u0997\u09be\u0987\u09b2"),
      en: "Pourashava area, Madhupur, Tangail",
    },
    description: {
      bn: u("\u0989\u09aa\u099c\u09c7\u09b2\u09be\u09b0 \u09b9\u09bf\u09a8\u09cd\u09a6\u09c1 \u09b8\u09ae\u09cd\u09aa\u09cd\u09b0\u09a6\u09be\u09af\u09bc\u09c7\u09b0 \u09a8\u09bf\u09a4\u09cd\u09af \u09aa\u09c2\u099c\u09be \u0993 \u09aa\u09be\u09b0\u09cd\u09ac\u09a3\u2014\u09a6\u09c1\u09b0\u09cd\u0997\u09be\u09aa\u09c2\u099c\u09be, \u09b8\u09b0\u09b8\u09cd\u09ac\u09a4\u09c0 \u09aa\u09c2\u099c\u09be \u0987\u09a4\u09cd\u09af\u09be\u09a6\u09bf\u0964 \u09a8\u09bf\u09b0\u09cd\u09a6\u09bf\u09b7\u09cd\u099f \u09ae\u09a8\u09cd\u09a6\u09bf\u09b0 \u09a8\u09be\u09ae \u0993 \u0995\u09ae\u09bf\u099f\u09bf \u09b8\u09cd\u09a5\u09be\u09a8\u09c0\u09af\u09bc\u09ad\u09be\u09ac\u09c7 \u09a8\u09bf\u09b6\u09cd\u099a\u09bf\u09a4 \u0995\u09b0\u09c1\u09a8\u0964"),
      en: "Community mandir for daily worship and festivals such as Durga and Saraswati Puja\u2014confirm exact local name and committee on site.",
    },
    services: {
      bn: u("\u09a8\u09bf\u09a4\u09cd\u09af \u09aa\u09c2\u099c\u09be \u00b7 \u09aa\u09be\u09b0\u09cd\u09ac\u09a3 \u00b7 \u09b8\u09ae\u09be\u099c \u0995\u09b2\u09cd\u09af\u09be\u09a3 \u0995\u09be\u09b0\u09cd\u09af\u09b8\u09c2\u099a\u09bf"),
      en: "Daily worship \u00b7 festivals \u00b7 community welfare",
    },
    hours: {
      bn: u("\u09b8\u0995\u09be\u09b2 \u0993 \u09b8\u09a8\u09cd\u09a7\u09cd\u09af\u09be \u09aa\u09c2\u099c\u09be; \u09aa\u09be\u09b0\u09cd\u09ac\u09a3\u09c7 \u09b8\u09ae\u09af\u09bc\u09b8\u09c2\u099a\u09bf \u09ac\u09be\u09a1\u09bc\u09c7\u0964"),
      en: "Morning & evening arati; extended hours on festivals.",
    },
    image:
      "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=900&q=80",
    dutyPhone: "01715-000000",
    dutyOfficer: {
      bn: u("\u09ae\u09a8\u09cd\u09a6\u09bf\u09b0 \u0995\u09ae\u09bf\u099f\u09bf / \u09aa\u09c1\u09b0\u09cb\u09b9\u09bf\u09a4"),
      en: "Temple committee / priest",
    },
    lat: 24.6203,
    lng: 90.0328,
  },
  {
    id: "madhupur-bus-stand-hotel",
    category: "restaurant",
    name: {
      bn: u("\u09ae\u09a7\u09c1\u09aa\u09c1\u09b0 \u09ac\u09be\u09b8 \u099f\u09be\u09b0\u09cd\u09ae\u09bf\u09a8\u09be\u09b2 \u09b9\u09cb\u099f\u09c7\u09b2 \u0993 \u09b0\u09c7\u09b8\u09cd\u099f\u09c1\u09b0\u09c7\u09a8\u09cd\u099f"),
      en: "Madhupur Bus Stand Hotel & Restaurant",
    },
    address: {
      bn: u("\u09ac\u09be\u09b8 \u09b8\u09cd\u099f\u09cd\u09af\u09be\u09a8\u09cd\u09a1 \u09b8\u0982\u09b2\u0997\u09cd\u09a8, \u09ae\u09a7\u09c1\u09aa\u09c1\u09b0, \u099f\u09be\u0982\u0997\u09be\u0987\u09b2"),
      en: "Near the bus stand, Madhupur, Tangail",
    },
    description: {
      bn: u("\u09af\u09be\u09a4\u09cd\u09b0\u09c0 \u0993 \u09b8\u09cd\u09a5\u09be\u09a8\u09c0\u09af\u09bc\u09a6\u09c7\u09b0 \u099c\u09a8\u09cd\u09af \u09ad\u09be\u09a4, \u09a4\u09b0\u0995\u09be\u09b0\u09bf, \u0995\u09be\u09ac\u09be\u09ac \u0993 \u09a8\u09be\u09b8\u09cd\u09a4\u09be\u09b0 \u09ae\u09a4\u09cb \u09b8\u09be\u09a7\u09be\u09b0\u09a3 \u0996\u09be\u09ac\u09be\u09b0\u0964 \u09b8\u0995\u09be\u09b2\u09c7\u09b0 \u099a\u09be-\u09aa\u09b0\u09cb\u099f\u09be \u09a5\u09c7\u0995\u09c7 \u09b0\u09be\u09a4\u09c7\u09b0 \u0996\u09be\u09ac\u09be\u09b0\u2014\u09a6\u09cb\u0995\u09be\u09a8\u09ad\u09c7\u09a1\u09bc\u09c7 \u09ae\u09c7\u09a8\u09c1 \u09ad\u09bf\u09a8\u09cd\u09a8\u0964"),
      en: "Rice meals, curries, kebabs, and snacks for travellers and locals\u2014menus vary by stall; typical bus-stand hours.",
    },
    services: {
      bn: u("\u09b8\u09c7\u099f \u09ae\u09c7\u09a8\u09c1 \u00b7 \u09a8\u09be\u09b8\u09cd\u09a4\u09be \u00b7 \u099a\u09be-\u0995\u09ab\u09bf \u00b7 \u09aa\u09cd\u09af\u09be\u0995\u09c7\u099f\u09c7 \u09a8\u09bf\u09af\u09bc\u09c7 \u09af\u09be\u0993\u09af\u09bc\u09be"),
      en: "Set meals \u00b7 snacks \u00b7 tea/coffee \u00b7 takeaway",
    },
    hours: {
      bn: u("\u09ad\u09cb\u09b0 ~ \u09b0\u09be\u09a4 \u09e8\u09e8:\u09e6\u09e6 (\u09a6\u09cb\u0995\u09be\u09a8\u09ad\u09c7\u09a1\u09bc\u09c7)\u0964"),
      en: "Early morning ~ 22:00 (varies).",
    },
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80",
    dutyPhone: "01716-000000",
    dutyOfficer: {
      bn: u("\u09ae\u09be\u09b2\u09bf\u0995 / \u09ae\u09cd\u09af\u09be\u09a8\u09c7\u099c\u09be\u09b0"),
      en: "Proprietor / manager",
    },
    lat: 24.6195,
    lng: 90.0362,
  },
  {
    id: "jalchatra-road-kitchen",
    category: "restaurant",
    name: {
      bn: u("\u099c\u09b2\u099b\u09a4\u09cd\u09b0 \u09ae\u09cb\u09a1\u09bc \u09b0\u09cb\u09a1 \u0995\u09bf\u099a\u09c7\u09a8"),
      en: "Jalchatra Mor Road Kitchen",
    },
    address: {
      bn: u("\u099c\u09b2\u099b\u09a4\u09cd\u09b0 \u09ac\u09be\u099c\u09be\u09b0 \u09b8\u09dc\u0995, \u09ae\u09a7\u09c1\u09aa\u09c1\u09b0, \u099f\u09be\u0982\u0997\u09be\u0987\u09b2"),
      en: "Jalchatra Bazar road, Madhupur, Tangail",
    },
    description: {
      bn: u("\u09b9\u09be\u099f \u0993 \u09aa\u09b0\u09bf\u09ac\u09b9\u09a8 \u099a\u09be\u09aa\u09c7\u09b0 \u09aa\u09be\u09b6\u09c7 \u099a\u09be, \u09b8\u09bf\u0982\u09af\u09bc\u09be\u09b0\u09be, \u09ac\u09bf\u09b0\u09bf\u09af\u09bc\u09be\u09a8\u09bf \u0993 \u09a6\u09c1\u09aa\u09c1\u09b0\u09c7\u09b0 \u09ad\u09be\u09a4\u09c7\u09b0 \u09a6\u09cb\u0995\u09be\u09a8\u0964 \u09ae\u09cc\u09b8\u09c1\u09ae\u09c7 \u0986\u09a8\u09be\u09b0\u09b8-\u0995\u09b2\u09be \u09ac\u09bf\u0995\u09cd\u09b0\u09c7\u09a4\u09be\u09b0\u09c7\u09b0\u0993 \u0986\u09a8\u09be\u0997\u09cb\u09a8\u09be \u09ac\u09c7\u09b6\u09bf\u0964"),
      en: "Tea, singara, biryani, and rice plates beside the hat and truck traffic; busy when fruit traders are in season.",
    },
    services: {
      bn: u("\u09ac\u09bf\u09b0\u09bf\u09af\u09bc\u09be\u09a8\u09bf \u00b7 \u09ad\u09be\u09a4-\u09a4\u09b0\u0995\u09be\u09b0\u09bf \u00b7 \u09a8\u09be\u09b8\u09cd\u09a4\u09be \u00b7 \u099a\u09be"),
      en: "Biryani \u00b7 rice meals \u00b7 snacks \u00b7 tea",
    },
    hours: {
      bn: u("\u09b8\u0995\u09be\u09b2 \u09e6:\u09e6\u09e6 ~ \u09b0\u09be\u09a4 \u09e8\u09e7:\u09e6\u09e6\u0964"),
      en: "06:00\u201321:00 typical.",
    },
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80",
    dutyPhone: "01717-000000",
    dutyOfficer: {
      bn: u("\u09ae\u09cd\u09af\u09be\u09a8\u09c7\u099c\u09be\u09b0 / \u0995\u09cd\u09af\u09be\u09b6\u09bf\u09af\u09bc\u09be\u09b0"),
      en: "Manager / cashier",
    },
    lat: 24.6172,
    lng: 90.0255,
  },
  {
    id: "madhupur-central-supershop",
    category: "supershop",
    name: {
      bn: u("\u09ae\u09a7\u09c1\u09aa\u09c1\u09b0 \u09b8\u09c7\u09a8\u09cd\u099f\u09cd\u09b0\u09be\u09b2 \u09b8\u09c1\u09aa\u09be\u09b0 \u09b6\u09aa"),
      en: "Madhupur Central Super Shop",
    },
    address: {
      bn: u("\u09ac\u09be\u099c\u09be\u09b0 \u09b0\u09cb\u09a1, \u09ae\u09a7\u09c1\u09aa\u09c1\u09b0, \u099f\u09be\u0982\u0997\u09be\u0987\u09b2"),
      en: "Bazar Road, Madhupur, Tangail",
    },
    description: {
      bn: u("\u09ae\u09c1\u09a6\u09bf, \u09a4\u09c7\u09b2-\u09ae\u09b8\u09b2\u09be, \u09b6\u09bf\u09b6\u09c1 \u0996\u09be\u09ac\u09be\u09b0, \u09aa\u09b0\u09bf\u099a\u09cd\u099b\u09a8\u09cd\u09a8\u09a4\u09be \u09aa\u09a3\u09cd\u09af \u0993 \u09a8\u09bf\u09a4\u09cd\u09af \u09aa\u09cd\u09b0\u09af\u09cb\u099c\u09a8\u09c0\u09af\u09bc \u099c\u09bf\u09a8\u09bf\u09b8 \u098f\u0995 \u099b\u09be\u09a6\u09c7\u09b0 \u09a8\u09c0\u099a\u09c7\u0964 \u09b8\u09be\u09aa\u09cd\u09a4\u09be\u09b9\u09bf\u0995 \u0985\u09ab\u09be\u09b0 \u09b8\u09cd\u09a5\u09be\u09a8\u09c0\u09af\u09bc\u09ad\u09be\u09ac\u09c7 \u099c\u09be\u09a8\u09be \u09af\u09be\u09ac\u09c7\u0964"),
      en: "Groceries, spices, baby food, toiletries, and daily needs under one roof\u2014weekly offers posted locally.",
    },
    services: {
      bn: u("\u09ae\u09c1\u09a6\u09bf \u00b7 \u09ab\u09cd\u09b0\u09cb\u099c\u09c7\u09a8 \u00b7 \u09aa\u09be\u09a8\u09c0\u09af\u09bc \u00b7 \u09b9\u09cb\u09ae \u0995\u09c7\u09af\u09bc\u09be\u09b0"),
      en: "Groceries \u00b7 frozen \u00b7 beverages \u00b7 home care",
    },
    hours: {
      bn: u("\u09b8\u0995\u09be\u09b2 \u09e9:\u09e6\u09e6 ~ \u09b0\u09be\u09a4 \u09e8\u09e7:\u09e6\u09e6 (\u09b6\u09c1\u0995\u09cd\u09b0\u09ac\u09be\u09b0\u09c7 \u09b8\u09ae\u09af\u09bc \u09b8\u0982\u0995\u09cd\u09b7\u09bf\u09aa\u09cd\u09a4 \u09b9\u09a4\u09c7 \u09aa\u09be\u09b0\u09c7)\u0964"),
      en: "09:00\u201321:00 (shorter Friday hours possible).",
    },
    image:
      "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=900&q=80",
    dutyPhone: "01718-000000",
    dutyOfficer: {
      bn: u("\u09b6\u09be\u0996\u09be \u09ac\u09cd\u09af\u09ac\u09b8\u09cd\u09a5\u09be\u09aa\u0995"),
      en: "Branch manager",
    },
    lat: 24.6185,
    lng: 90.037,
  },
  {
    id: "jalchatra-bazar-supershop",
    category: "supershop",
    name: {
      bn: u("\u099c\u09b2\u099b\u09a4\u09cd\u09b0 \u09ac\u09be\u099c\u09be\u09b0 \u09b8\u09c1\u09aa\u09be\u09b0 \u09b8\u09cd\u099f\u09cb\u09b0"),
      en: "Jalchatra Bazar Super Store",
    },
    address: {
      bn: u("\u099c\u09b2\u099b\u09a4\u09cd\u09b0 \u09ac\u09be\u099c\u09be\u09b0, \u0986\u09b0\u09a8\u0996\u09cb\u09b2\u09be, \u09ae\u09a7\u09c1\u09aa\u09c1\u09b0"),
      en: "Jalchatra Bazar, Arankhola, Madhupur",
    },
    description: {
      bn: u("\u09b9\u09be\u099f \u098f\u09b2\u09be\u0995\u09be\u09b0 \u09aa\u09be\u0987\u0995\u09be\u09b0 \u0993 \u09b8\u09cd\u09a5\u09be\u09a8\u09c0\u09af\u09bc \u0997\u09cd\u09b0\u09be\u09b9\u0995\u09a6\u09c7\u09b0 \u099c\u09a8\u09cd\u09af \u09ac\u09b8\u09cd\u09a4\u09be\u09af\u09bc \u099a\u09be\u09b2, \u09a1\u09be\u09b2, \u09a4\u09c7\u09b2 \u0993 \u09a8\u09bf\u09a4\u09cd\u09af\u09aa\u09cd\u09b0\u09df\u09cb\u099c\u09a8\u09c0\u09af\u09bc \u099c\u09bf\u09a8\u09bf\u09b8; \u0996\u09c1\u099a\u09b0\u09be \u0995\u09c7\u09a8\u09be\u0995\u09be\u099f\u09bf \u09b9\u09af\u09bc\u0964"),
      en: "Bulk rice, lentils, oil, and staples for wholesalers and locals at the hat; retail shopping too.",
    },
    services: {
      bn: u("\u09aa\u09be\u0987\u0995\u09be\u09b0\u09bf \u0993 \u0996\u09c1\u099a\u09b0\u09be \u00b7 \u09b9\u09cb\u09ae \u09a1\u09c7\u09b2\u09bf\u09ad\u09be\u09b0\u09bf (\u09b8\u09cd\u09a5\u09be\u09a8\u09c0\u09af\u09bc \u099a\u09c1\u0995\u09cd\u09a4\u09bf)"),
      en: "Wholesale & retail \u00b7 local delivery (arrange on site)",
    },
    hours: {
      bn: u("\u09ad\u09cb\u09b0 \u09e7:\u09e6\u09e6 ~ \u09b8\u09a8\u09cd\u09a7\u09cd\u09af\u09be \u09e8\u09e6:\u09e6\u09e6\u0964"),
      en: "07:00\u201320:00 typical.",
    },
    image:
      "https://images.unsplash.com/photo-1534723452860-460fff8edd82?auto=format&fit=crop&w=900&q=80",
    dutyPhone: "01719-000000",
    dutyOfficer: {
      bn: u("\u09aa\u09cd\u09b0\u09cb\u09aa\u09cd\u09b0\u09be\u0987\u099f\u09b0 / \u0995\u09be\u0989\u09a8\u09cd\u099f\u09be\u09b0 \u0987\u09a8\u099a\u09be\u09b0\u09cd\u099c"),
      en: "Proprietor / counter in-charge",
    },
    lat: 24.6169,
    lng: 90.024,
  },
  {
    id: "madhupur-national-park",
    category: "tourism",
    name: {
      bn: u("\u09ae\u09a7\u09c1\u09aa\u09c1\u09b0 \u099c\u09be\u09a4\u09c0\u09af\u09bc \u0989\u09a6\u09cd\u09af\u09be\u09a8"),
      en: "Madhupur National Park",
    },
    address: {
      bn: u(
        "\u09ae\u09a7\u09c1\u09aa\u09c1\u09b0 \u0989\u09aa\u099c\u09c7\u09b2\u09be, \u099f\u09be\u0982\u0997\u09be\u0987\u09b2 (\u09b6\u09be\u09b2\u09ac\u09a8 \u0993 \u09ac\u09a8\u09cd\u09af\u09aa\u09cd\u09b0\u09be\u09a3\u09c0 \u0985\u09ad\u09af\u09bc\u09be\u09b0\u09a3\u09cd\u09af \u098f\u09b2\u09be\u0995\u09be)",
      ),
      en: "Madhupur Upazila, Tangail (sal forest & wildlife sanctuary zone)",
    },
    description: {
      bn: u(
        "\u09ac\u09be\u0982\u09b2\u09be\u09a6\u09c7\u09b6\u09c7\u09b0 \u0997\u09c1\u09b0\u09c1\u09a4\u09cd\u09ac\u09aa\u09c2\u09b0\u09cd\u09a3 \u09b6\u09be\u09b2\u09ac\u09a8 \u09ad\u09c2\u09ae\u09bf \u0993 \u099c\u09c0\u09ac\u09ac\u09c8\u099a\u09bf\u09a4\u09cd\u09b0\u09cd\u09af\u2014\u09aa\u09cd\u09b0\u09ac\u09c7\u09b6 \u09a8\u09bf\u09af\u09bc\u09ae, \u09a8\u09bf\u09b0\u09be\u09aa\u09a4\u09cd\u09a4\u09be \u0993 \u0997\u09be\u0987\u09a1 \u09ad\u09cd\u09b0\u09ae\u09a3 \u09b8\u0982\u0995\u09cd\u09b0\u09be\u09a8\u09cd\u09a4 \u09a4\u09a5\u09cd\u09af \u09ac\u09a8 \u09ac\u09bf\u09ad\u09be\u0997 \u0993 \u09b8\u09cd\u09a5\u09be\u09a8\u09c0\u09af\u09bc \u09a8\u09cb\u099f\u09bf\u09b8 \u09a5\u09c7\u0995\u09c7 \u09a8\u09bf\u09b6\u09cd\u099a\u09bf\u09a4 \u0995\u09b0\u09c1\u09a8\u0964 \u0997\u09be\u09a1\u09bc\u09bf \u0993 \u09b9\u09be\u09b0\u09be\u09b0 \u09aa\u09a5 \u09b8\u09c0\u09ae\u09bf\u09a4 \u09a5\u09be\u0995\u09cd\u09a4\u09c7 \u09aa\u09be\u09b0\u09c7\u0964",
      ),
      en: "A major sal forest and biodiversity area\u2014confirm entry rules, safety, and guided visits with the Forest Department and local notices. Vehicle and walking routes may be restricted.",
    },
    services: {
      bn: u(
        "\u09aa\u09cd\u09b0\u0995\u09c3\u09a4\u09bf \u09aa\u09b0\u09cd\u09af\u099f\u09a8 \u00b7 \u09ac\u09a8\u09cd\u09af\u09aa\u09cd\u09b0\u09be\u09a3\u09c0 \u09aa\u09b0\u09cd\u09af\u09ac\u09c7\u0995\u09cd\u09b7\u09a3 (\u09b8\u09c1\u09af\u09cb\u0997 \u09b8\u09be\u09aa\u09c7\u0995\u09cd\u09b7\u09c7) \u00b7 \u09a8\u09bf\u09b0\u09be\u09aa\u09a6 \u099f\u09cd\u09b0\u09c7\u09b2",
      ),
      en: "Nature tourism \u00b7 wildlife viewing (where allowed) \u00b7 designated trails",
    },
    hours: {
      bn: u(
        "\u09b8\u09be\u09a7\u09be\u09b0\u09a3\u09a4 \u09a6\u09bf\u09a8\u09c7\u09b0 \u09ac\u09c7\u09b2\u09be; \u099b\u09c1\u09a1\u09bc\u09bf\u09b0 \u09a6\u09bf\u09a8 \u0993 \u09ae\u09cc\u09b8\u09c1\u09ae\u09c7 \u09b8\u09ae\u09af\u09bc \u09aa\u09b0\u09bf\u09ac\u09b0\u09cd\u09a4\u09a8 \u09b9\u09a4\u09c7 \u09aa\u09be\u09b0\u09c7\u2014\u0995\u09b0\u09cd\u09a4\u09c3\u09aa\u0995\u09cd\u09b7\u09c7\u09b0 \u09a8\u09cb\u099f\u09bf\u09b8 \u09a6\u09c7\u0996\u09c1\u09a8\u0964",
      ),
      en: "Usually daytime hours; may change on holidays or by season\u2014check official announcements.",
    },
    image:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=900&q=80",
    hotline: "09666-000000",
    dutyPhone: "01720-000000",
    dutyOfficer: {
      bn: u(
        "\u09ac\u09a8 \u09ac\u09bf\u09ad\u09be\u0997 / \u09aa\u09be\u09b0\u09cd\u0995 \u0995\u09b0\u09cd\u09a4\u09c3\u09aa\u0995\u09cd\u09b7\u09c7\u09b0 \u09a4\u09a5\u09cd\u09af\u0995\u09c7\u09a8\u09cd\u09a6\u09cd\u09b0",
      ),
      en: "Forest Department / park information desk",
    },
    lat: 24.75,
    lng: 90.0833,
  },
  {
    id: "madhupur-sal-forest-garh",
    category: "tourism",
    name: {
      bn: u("\u09ae\u09a7\u09c1\u09aa\u09c1\u09b0 \u0997\u09a1\u09bc (\u09b6\u09be\u09b2\u09ac\u09a8 \u099f\u09cd\u09b0\u09cd\u09af\u09be\u0995\u09cd\u099f)"),
      en: "Madhupur Gar (sal forest tract)",
    },
    address: {
      bn: u(
        "\u09ae\u09a7\u09c1\u09aa\u09c1\u09b0 \u099f\u09cd\u09b0\u09cd\u09af\u09be\u0995\u09cd\u099f, \u099f\u09be\u0982\u0997\u09be\u0987\u09b2\u2013\u09ae\u09df\u09ae\u09a8\u09b8\u09bf\u0982\u09b9 \u09b8\u09c0\u09ae\u09be\u09a8\u09cd\u09a4\u09ac\u09b0\u09cd\u09a4\u09c0 \u09ac\u09a8\u09cd\u099a\u09b2",
      ),
      en: "Madhupur tract, forest belt toward Tangail\u2013Mymensingh",
    },
    description: {
      bn: u(
        "\u09ae\u09a7\u09c1\u09aa\u09c1\u09b0\u09c7\u09b0 \u09ac\u09bf\u09b8\u09cd\u09a4\u09c3\u09a4 \u09b6\u09be\u09b2 \u0993 \u09ae\u09bf\u09b6\u09cd\u09b0 \u09ac\u09a8\u2014\u0997\u09cd\u09b0\u09be\u09ae\u09c0\u09a3 \u09b0\u09be\u09b8\u09cd\u09a4\u09be, \u099a\u09be-\u09b8\u09cd\u099f\u09b2 \u0993 \u09b8\u09cd\u09a5\u09be\u09a8\u09c0\u09af\u09bc \u0997\u09be\u0987\u09a1\u09b8\u09b9 \u09b9\u09be\u09b2\u0995\u09be \u09aa\u09b0\u09cd\u09af\u099f\u09a8\u0964 \u09ac\u09a8\u09c7\u09b0 \u09a8\u09bf\u09b0\u09cd\u09a6\u09c7\u09b6\u09bf\u09a4 \u09aa\u09cd\u09b0\u09ac\u09c7\u09b6 \u0993 \u0986\u0997\u09c1\u09a8 \u09a8\u09bf\u09b0\u09be\u09aa\u09a4\u09cd\u09a4\u09be \u09b8\u0982\u0995\u09cd\u09b0\u09be\u09a8\u09cd\u09a4 \u09a8\u09bf\u09af\u09bc\u09ae \u09ae\u09c7\u09a8\u09c7 \u099a\u09b2\u09c1\u09a8\u0964",
      ),
      en: "Expansive sal and mixed forest on the Madhupur tract\u2014light tourism along village roads with tea stalls and local guides. Follow forest-entry and fire-safety rules.",
    },
    services: {
      bn: u(
        "\u09b8\u09a1\u09bc\u09be\u0995 \u09aa\u09be\u09b6\u09c7\u09b0 \u09a6\u09c3\u09b6\u09cd\u09af \u00b7 \u09b8\u09cd\u09a5\u09be\u09a8\u09c0\u09af\u09bc \u0996\u09be\u09ac\u09be\u09b0 \u00b7 \u0997\u09be\u0987\u09a1 (\u0986\u09b2\u09be\u09a6\u09be \u099a\u09c1\u0995\u09cd\u09a4\u09bf)",
      ),
      en: "Roadside scenery \u00b7 local food \u00b7 guides (arrange locally)",
    },
    hours: {
      bn: u(
        "\u09a6\u09bf\u09a8\u09c7\u09b0 \u0986\u09b2\u09cb\u09a4\u09c7 \u09ad\u09cd\u09b0\u09ae\u09a3 \u09b8\u09c1\u09ac\u09bf\u09a7\u09be\u09af\u09cb\u0997\u09cd\u09af; \u09ac\u09c3\u09b7\u09cd\u09a1\u09bf \u0993 \u0995\u09be\u09a6\u09be\u09af\u09bc \u09b8\u09a4\u09b0\u09cd\u0995 \u09a5\u09be\u0995\u09c1\u09a8\u0964",
      ),
      en: "Daylight visits are easiest; watch for mud and rain on unpaved routes.",
    },
    image:
      "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=900&q=80",
    dutyPhone: "01721-000000",
    dutyOfficer: {
      bn: u(
        "\u09b8\u09cd\u09a5\u09be\u09a8\u09c0\u09af\u09bc \u0987\u09c1\u09a8\u09bf\u09af\u09bc\u09a8 \u09a4\u09a5\u09cd\u09af\u0995\u09c7\u09a8\u09cd\u09a6\u09cd\u09b0 / \u09aa\u09b0\u09cd\u09af\u099f\u09a8 \u09b8\u09b9\u09be\u09af\u09bc\u09a4\u09be",
      ),
      en: "Local union information / tourism assistance",
    },
    lat: 24.665,
    lng: 90.048,
  },
  {
    id: "jalchatra-pineapple-belt",
    category: "tourism",
    name: {
      bn: u(
        "\u099c\u09b2\u099b\u09a4\u09cd\u09b0\u2013\u0986\u09a8\u09be\u09b0\u09b8 \u09ac\u09c7\u09b2\u09cd\u099f (\u0995\u09c3\u09b7\u09bf \u09aa\u09b0\u09cd\u09af\u099f\u09a8)",
      ),
      en: "Jalchatra pineapple belt (agri-tourism)",
    },
    address: {
      bn: u(
        "\u0986\u09b0\u09a8\u0996\u09cb\u09b2\u09be \u0987\u0989\u09a8\u09bf\u09af\u09bc\u09a8, \u099c\u09b2\u099b\u09a4\u09cd\u09b0 \u09ac\u09be\u099c\u09be\u09b0 \u09b8\u0982\u09b2\u0997\u09cd\u09a8 \u0995\u09cd\u09b7\u09c7\u09a4 \u098f\u09b2\u09be\u0995\u09be, \u09ae\u09a7\u09c1\u09aa\u09c1\u09b0",
      ),
      en: "Arankhola Union, fields near Jalchatra Bazar, Madhupur",
    },
    description: {
      bn: u(
        "\u09a6\u09c7\u09b6\u09c7\u09b0 \u098f\u0995\u099f\u09bf \u09aa\u09cd\u09b0\u09a7\u09be\u09a8 \u0986\u09a8\u09be\u09b0\u09b8 \u0993 \u0995\u09b2\u09be \u0989\u09ce\u09aa\u09be\u09a6\u09a8 \u0985\u099e\u09cd\u099a\u09b2\u2014\u09b9\u09be\u099f\u09c7\u09b0 \u09a6\u09bf\u09a8\u09c7 \u09aa\u09be\u0987\u0995\u09be\u09b0\u09bf \u09ac\u09be\u099c\u09be\u09b0, \u09ae\u09cc\u09b8\u09c1\u09ae\u09c7 \u0995\u09cd\u09b7\u09c7\u09a4 \u09aa\u09b0\u09bf\u09a6\u09b0\u09cd\u09b6\u09a8 \u0993 \u09b8\u09cd\u09a5\u09be\u09a8\u09c0\u09af\u09bc \u09b0\u09b8\u09c7\u09b0 \u09a6\u09cb\u0995\u09be\u09a8\u0964 \u099a\u09c1\u0995\u09cd\u09a4\u09bf \u099b\u09be\u09a1\u09bc\u09be \u09ab\u09b8\u09b2 \u09a4\u09cb\u09b2\u09be \u09a8\u09af\u09bc\u0964",
      ),
      en: "A hub for pineapples and bananas\u2014busy wholesale hats, seasonal field visits, and fresh juice stalls. Do not pick crops without the grower\u2019s permission.",
    },
    services: {
      bn: u(
        "\u09ae\u09cc\u09b8\u09c1\u09ae\u09bf \u09ab\u09b2 \u0995\u09c7\u09a8\u09be \u00b7 \u09b9\u09be\u099f \u09aa\u09b0\u09bf\u09a6\u09b0\u09cd\u09b6\u09a8 \u00b7 \u099b\u09ac\u09bf \u09a4\u09cb\u09b2\u09be\u09b0 \u09b8\u09cd\u09aa\u099f",
      ),
      en: "Seasonal fruit buying \u00b7 market experience \u00b7 photo-friendly countryside",
    },
    hours: {
      bn: u(
        "\u09b9\u09be\u099f \u0993 \u09ae\u09cc\u09b8\u09c1\u09ae \u0985\u09a8\u09c1\u09af\u09bc\u09be\u09af\u09bc\u09c0; \u09ad\u09cb\u09b0\u09c7 \u09ac\u09be\u099c\u09be\u09b0 \u09ac\u09c7\u09b6\u09bf \u09b8\u0995\u09cd\u09b0\u09bf\u09af\u09bc\u0964",
      ),
      en: "Depends on hat days and harvest; markets are liveliest at dawn.",
    },
    image:
      "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=900&q=80",
    dutyPhone: "01722-000000",
    dutyOfficer: {
      bn: u(
        "\u09ac\u09be\u099c\u09be\u09b0 \u0995\u09ae\u09bf\u099f\u09bf / \u09b8\u09cd\u09a5\u09be\u09a8\u09c0\u09af\u09bc \u099a\u09be\u09b7\u09c0 \u09b8\u09ae\u09ac\u09be\u09af\u09bc (\u09af\u09cb\u0997\u09be\u09af\u09cb\u0997 \u09b8\u09cd\u09a5\u09be\u09a8\u09c0\u09af\u09bc)",
      ),
      en: "Bazaar committee / local growers (contact on site)",
    },
    lat: 24.615,
    lng: 90.022,
  },
];

function esc(s) {
  return JSON.stringify(s);
}

const header = `import type { Locale } from "@/lib/i18n";

export type MapPlaceCategory = "hospital" | "police" | "school" | "office" | "temple" | "mosque" | "restaurant" | "supershop" | "bazar" | "tourism";

/** Bilingual copy — Bangla first; UI picks by route locale. */
export type Bilingual = Readonly<{
  bn: string;
  en: string;
}>;

export type MapPlace = {
  id: string;
  category: MapPlaceCategory;
  name: Bilingual;
  address: Bilingual;
  description: Bilingual;
  services: Bilingual;
  hours: Bilingual;
  image: string;
  hotline?: string;
  dutyPhone?: string;
  dutyOfficer: Bilingual;
  lat: number;
  lng: number;
};

export function placeText(b: Bilingual, lang: Locale): string {
  return lang === "bn" ? b.bn : b.en;
}

/** Madhupur town centre when GPS is unavailable */
export const MAP_DEFAULT_CENTER = {
  lat: 24.61921690909821,
  lng: 90.03515625064864,
} as const;

/**
 * Public facilities around Madhupur, Tangail (coordinates approximate).
 * Health Complex duty line reflects commonly circulated listings; verify locally.
 */
export const MAP_PLACES: MapPlace[] = [
`;

function block(p) {
  const lines = [
    "  {",
    `    id: ${esc(p.id)},`,
    `    category: ${esc(p.category)},`,
    "    name: {",
    `      bn: ${esc(p.name.bn)},`,
    `      en: ${esc(p.name.en)},`,
    "    },",
    "    address: {",
    `      bn: ${esc(p.address.bn)},`,
    `      en: ${esc(p.address.en)},`,
    "    },",
    "    description: {",
    `      bn: ${esc(p.description.bn)},`,
    `      en: ${esc(p.description.en)},`,
    "    },",
    "    services: {",
    `      bn: ${esc(p.services.bn)},`,
    `      en: ${esc(p.services.en)},`,
    "    },",
    "    hours: {",
    `      bn: ${esc(p.hours.bn)},`,
    `      en: ${esc(p.hours.en)},`,
    "    },",
    `    image: ${esc(p.image)},`,
  ];
  if (p.hotline) lines.push(`    hotline: ${esc(p.hotline)},`);
  if (p.dutyPhone) lines.push(`    dutyPhone: ${esc(p.dutyPhone)},`);
  lines.push(
    "    dutyOfficer: {",
    `      bn: ${esc(p.dutyOfficer.bn)},`,
    `      en: ${esc(p.dutyOfficer.en)},`,
    "    },",
    `    lat: ${p.lat},`,
    `    lng: ${p.lng},`,
    "  },",
  );
  return lines.join("\n");
}

const footer = `];

export const MAP_CATEGORY_ORDER: MapPlaceCategory[] = [
  "hospital",
  "police",
  "school",
  "office",
  "temple",
  "mosque",
  "restaurant",
  "supershop",
  "bazar",
  "tourism",
];
`;

fs.writeFileSync(out, header + places.map(block).join("\n") + "\n" + footer, "utf8");
console.log("Wrote", out);
