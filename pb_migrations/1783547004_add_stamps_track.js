/// <reference path="../pb_data/types.d.ts" />

// Adds `track` (coffee/beans) to stamps so the two loyalty cards are counted
// independently (coffee free at 10, beans free at 6). See CLAUDE.md loyalty
// logic. Additive: stamps is empty at this point on every deploy, so a
// required field is safe.
migrate((app) => {
  const stamps = app.findCollectionByNameOrId("stamps")

  stamps.fields.add(new SelectField({
    id: "select2841998723",
    name: "track",
    required: true,
    presentable: false,
    system: false,
    maxSelect: 1,
    values: ["coffee", "beans"],
  }))

  return app.save(stamps)
}, (app) => {
  const stamps = app.findCollectionByNameOrId("stamps")
  stamps.fields.removeByName("track")
  return app.save(stamps)
})
