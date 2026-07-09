/// <reference path="../pb_data/types.d.ts" />

// Adds a `role` select field (customer/staff) to the built-in `users` auth
// collection. Staff-only write rules on `stamps` key off @request.auth.role,
// so this must run before the stamps migration.
migrate((app) => {
  const users = app.findCollectionByNameOrId("users")

  users.fields.add(new SelectField({
    id: "select2324736937",
    name: "role",
    required: false,
    presentable: false,
    system: false,
    maxSelect: 1,
    values: ["customer", "staff"],
  }))

  return app.save(users)
}, (app) => {
  const users = app.findCollectionByNameOrId("users")
  users.fields.removeByName("role")
  return app.save(users)
})
