/**
 * JSON persistence for the HR VISTA 3.0 API routes.
 *
 * Registrations + contact messages are appended to
 * data/hrvista.json (created on first write with the shape
 * { registrations: [], contacts: [] }). Brochure page count is
 * read from the rendered public/brochure/*.png set.
 *
 * Node runtime only (fs/path).
 */

import { mkdir, readFile, readdir, writeFile } from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_PATH = path.join(DATA_DIR, "hrvista.json");
const BROCHURE_DIR = path.join(process.cwd(), "public", "brochure");

export type RegistrationRole = "student" | "professional" | "corporate";

export interface Registration {
  id: string;
  name: string;
  email: string;
  organisation?: string;
  role: RegistrationRole;
  dietary?: string;
  createdAt: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

interface Store {
  registrations: Registration[];
  contacts: Contact[];
}

/** Read the store, creating/normalising it on demand. */
async function readStore(): Promise<Store> {
  await mkdir(DATA_DIR, { recursive: true });
  try {
    const raw = await readFile(STORE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as Partial<Store>;
    return {
      registrations: Array.isArray(parsed.registrations) ? parsed.registrations : [],
      contacts: Array.isArray(parsed.contacts) ? parsed.contacts : [],
    };
  } catch {
    // Missing or corrupt file → start fresh.
    return { registrations: [], contacts: [] };
  }
}

async function writeStore(store: Store): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf-8");
}

function makeId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export async function addRegistration(
  input: Omit<Registration, "id" | "createdAt">,
): Promise<Registration> {
  const store = await readStore();
  const registration: Registration = {
    ...input,
    id: makeId(),
    createdAt: new Date().toISOString(),
  };
  store.registrations.push(registration);
  await writeStore(store);
  return registration;
}

export async function addContact(
  input: Omit<Contact, "id" | "createdAt">,
): Promise<Contact> {
  const store = await readStore();
  const contact: Contact = {
    ...input,
    id: makeId(),
    createdAt: new Date().toISOString(),
  };
  store.contacts.push(contact);
  await writeStore(store);
  return contact;
}

/** Count the rendered brochure pages (public/brochure/*.png). */
export async function countBrochurePages(): Promise<number> {
  try {
    const files = await readdir(BROCHURE_DIR);
    return files.filter((f) => f.toLowerCase().endsWith(".png")).length;
  } catch {
    return 0;
  }
}
