/** Names and edition roles: https://www.hrvista.live/ and /contact, retrieved 2026-10-08.
 * Profiles for Lijo, Justin and Tanishq are directly linked by that site.
 * Shankar, Akhil, Rushda and Shyam were matched to public LinkedIn profiles.
 * These are the previous edition's credits, not a confirmed 3.0 committee.
 */
export type Person = { name: string; role: string; group: "Faculty & leadership" | "Team & community"; initials: string; linkedin: string; source: string };
export const people: Person[] = [
  { name: "Fr. Lijo Thomas", role: "Dean & Director · CHRIST Lavasa", group: "Faculty & leadership", initials: "LT", linkedin: "https://www.linkedin.com/in/lijo-thomas-1b4459218/", source: "https://www.hrvista.live/" },
  { name: "Fr. Justin P Varghese", role: "Academic Coordinator · CHRIST Lavasa", group: "Faculty & leadership", initials: "JV", linkedin: "https://www.linkedin.com/in/justin-p-varghese-2661351a3/", source: "https://www.hrvista.live/" },
  { name: "Prof. Shankar Iyer", role: "Head · CPCG", group: "Faculty & leadership", initials: "SI", linkedin: "https://www.linkedin.com/in/shankarhiyer/", source: "https://www.hrvista.live/contact" },
  { name: "Prof. Akhil Paul", role: "Placement Officer · CPCG", group: "Faculty & leadership", initials: "AP", linkedin: "https://www.linkedin.com/in/akhilpaulk/", source: "https://www.hrvista.live/contact" },
  { name: "Rushda Siddiqui", role: "President · Student Wing CPCG", group: "Team & community", initials: "RS", linkedin: "https://www.linkedin.com/in/rushda-siddiqui-41b85b226/", source: "https://www.hrvista.live/contact" },
  { name: "Shyambahadur Prajapati", role: "Being HR · Community", group: "Team & community", initials: "SP", linkedin: "https://www.linkedin.com/in/shyamprajapati/", source: "https://www.hrvista.live/contact" },
  { name: "Tanishq Saini", role: "Website development & maintenance · 2.0", group: "Team & community", initials: "TS", linkedin: "https://www.linkedin.com/in/tanishq-saini7/", source: "https://www.hrvista.live/" },
];

// Deliberately empty until the 3.0 guest lineup is supplied.
export const guests: Person[] = [];
