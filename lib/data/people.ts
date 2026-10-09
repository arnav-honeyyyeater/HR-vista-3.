/** Names and edition roles: https://www.hrvista.live/ and /contact, retrieved 2026-10-08.
 * Profiles for Lijo and Justin are directly linked by that site.
 * Shankar, Akhil, Rushda and Shyam were matched to public LinkedIn profiles.
 * The first six entries retain the previous edition's credits. Arnav is the
 * current website credit requested by its owner, not a confirmed 3.0 committee.
 * Portraits were retrieved from the matching live LinkedIn profiles on
 * 2026-10-09 and stored locally; see public/media/people/sources.json.
 */
export type Person = { name: string; role: string; group: "Faculty & leadership" | "Team & community"; initials: string; linkedin: string; source: string; portrait?: string; portraitPosition?: string };
export const people: Person[] = [
  { name: "Fr. Lijo Thomas", role: "Dean & Director · CHRIST Lavasa", group: "Faculty & leadership", initials: "LT", linkedin: "https://www.linkedin.com/in/lijo-thomas-1b4459218/", source: "https://www.hrvista.live/", portrait: "/media/people/lijo-thomas.webp" },
  { name: "Fr. Justin P Varghese", role: "Academic Coordinator · CHRIST Lavasa", group: "Faculty & leadership", initials: "JV", linkedin: "https://www.linkedin.com/in/justin-p-varghese-2661351a3/", source: "https://www.hrvista.live/", portrait: "/media/people/justin-varghese.webp", portraitPosition: "64% 35%" },
  { name: "Prof. Shankar Iyer", role: "Head · CPCG", group: "Faculty & leadership", initials: "SI", linkedin: "https://www.linkedin.com/in/shankarhiyer/", source: "https://www.hrvista.live/contact", portrait: "/media/people/shankar-iyer.webp" },
  { name: "Prof. Akhil Paul", role: "Placement Officer · CPCG", group: "Faculty & leadership", initials: "AP", linkedin: "https://www.linkedin.com/in/akhilpaulk/", source: "https://www.hrvista.live/contact", portrait: "/media/people/akhil-paul.webp" },
  { name: "Rushda Siddiqui", role: "President · Student Wing CPCG", group: "Team & community", initials: "RS", linkedin: "https://www.linkedin.com/in/rushda-siddiqui-41b85b226/", source: "https://www.hrvista.live/contact", portrait: "/media/people/rushda-siddiqui.webp" },
  { name: "Shyambahadur Prajapati", role: "Being HR · Community", group: "Team & community", initials: "SP", linkedin: "https://www.linkedin.com/in/shyamprajapati/", source: "https://www.hrvista.live/contact", portrait: "/media/people/shyambahadur-prajapati.webp" },
  { name: "Arnav Sharma", role: "Website development & maintenance · 3.0", group: "Team & community", initials: "AS", linkedin: "https://www.linkedin.com/in/arnav-sharmaaa/", source: "https://www.linkedin.com/in/arnav-sharmaaa/", portrait: "/media/people/arnav-sharma.webp" },
];

// Deliberately empty until the 3.0 guest lineup is supplied.
export const guests: Person[] = [];
