import { handleContact } from "../server/contact.js";
import { createContactDeps } from "../server/contactRuntime.js";

// Vercel Function: /api/contact. La lógica vive en server/contact.ts.
// Los límites en memoria se comparten entre las peticiones de esta instancia.
const deps = createContactDeps(process.env);
const handle = (request: Request) => handleContact(request, deps);

export {
  handle as GET,
  handle as POST,
  handle as PUT,
  handle as PATCH,
  handle as DELETE,
};
