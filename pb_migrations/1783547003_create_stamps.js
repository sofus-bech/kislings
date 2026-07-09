/// <reference path="../pb_data/types.d.ts" />

// Loyalty audit trail. Each row is a single stamp or a redeem, created by
// staff at the till. Current count is DERIVED (stamps since the user's last
// redeem) — there is no mutable counter field.
//
// Rules: staff-only read/create; Update/Delete admin-only. Customers can
// never write here. Depends on the `role` field added to `users` in
// 1783547001, which this migration's ordering guarantees exists.
migrate((app) => {
  const staff = '@request.auth.role = "staff"'

  const stamps = new Collection({
    type: "base",
    name: "stamps",
    listRule: staff,
    viewRule: staff,
    createRule: staff,
    updateRule: null,
    deleteRule: null,
    fields: [
      {
        autogeneratePattern: "[a-z0-9]{15}", hidden: false, id: "text3208210256",
        max: 15, min: 15, name: "id", pattern: "^[a-z0-9]+$", presentable: false,
        primaryKey: true, required: true, system: true, type: "text",
      },
      {
        cascadeDelete: false, collectionId: "_pb_users_auth_", hidden: false,
        id: "relation701", maxSelect: 1, minSelect: 0, name: "user",
        presentable: false, required: true, system: false, type: "relation",
      },
      {
        cascadeDelete: false, collectionId: "_pb_users_auth_", hidden: false,
        id: "relation702", maxSelect: 1, minSelect: 0, name: "staff",
        presentable: false, required: true, system: false, type: "relation",
      },
      {
        hidden: false, id: "select703", maxSelect: 1, name: "action",
        presentable: false, required: true, system: false, type: "select",
        values: ["stamp", "redeem"],
      },
      {
        hidden: false, id: "autodate2990389176", name: "created",
        onCreate: true, onUpdate: false, presentable: false, system: false, type: "autodate",
      },
    ],
    indexes: [
      "CREATE INDEX `idx_stamps_user` ON `stamps` (`user`)",
    ],
  })

  return app.save(stamps)
}, (app) => {
  return app.delete(app.findCollectionByNameOrId("stamps"))
})
