/// <reference path="../pb_data/types.d.ts" />

// Customers must never be able to grant themselves staff — that would let them
// read every customer's stamps and create stamp rows. The users collection is
// publicly creatable (signup), so we clamp `role` server-side:
//   - create: non-superuser signups are forced to role "customer"
//   - update: non-superusers cannot change their own role (kept as-is)
// Only the owner (superuser, via the admin UI) can set role = "staff".
//
// Each hook callback runs in an isolated runtime and cannot share helpers, so
// the logic is inlined in both. hasSuperuserAuth() is wrapped defensively so a
// missing binding fails closed (treated as non-superuser) rather than throwing.

onRecordCreateRequest((e) => {
  let superuser = false;
  try { superuser = e.hasSuperuserAuth(); } catch (_) {}
  if (!superuser) {
    e.record.set('role', 'customer');
  }
  e.next();
}, 'users');

onRecordUpdateRequest((e) => {
  let superuser = false;
  try { superuser = e.hasSuperuserAuth(); } catch (_) {}
  if (!superuser) {
    const original = $app.findRecordById('users', e.record.id);
    e.record.set('role', (original && original.getString('role')) || 'customer');
  }
  e.next();
}, 'users');
