/// <reference path="../pb_data/types.d.ts" />

// Only one coffee can be "på kværnen" at a time. Whenever a coffee is saved
// with on_grinder = true, clear the flag on every other coffee. Enforced
// server-side so it holds regardless of who sets it (app, admin UI, till).
//
// The other coffees get on_grinder = false, so their own save hooks skip the
// block below — no recursion.
//
// NOTE: PocketBase runs each hook callback in an isolated runtime; it cannot
// reference anything defined outside the callback, so the logic is inlined in
// both handlers rather than shared via a helper.

onRecordAfterUpdateSuccess((e) => {
  if (e.record.getBool('on_grinder')) {
    const others = $app.findRecordsByFilter(
      'coffees',
      'on_grinder = true && id != {:id}',
      '',
      200,
      0,
      { id: e.record.id },
    );
    for (const other of others) {
      other.set('on_grinder', false);
      $app.save(other);
    }
  }
  e.next();
}, 'coffees');

onRecordAfterCreateSuccess((e) => {
  if (e.record.getBool('on_grinder')) {
    const others = $app.findRecordsByFilter(
      'coffees',
      'on_grinder = true && id != {:id}',
      '',
      200,
      0,
      { id: e.record.id },
    );
    for (const other of others) {
      other.set('on_grinder', false);
      $app.save(other);
    }
  }
  e.next();
}, 'coffees');
