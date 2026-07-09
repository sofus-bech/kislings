/// <reference path="../pb_data/types.d.ts" />

// Content collections: settings, news, events, menus, coffees, recipes.
// All are publicly readable (List/View = "") and admin-only for writes
// (Create/Update/Delete = null). Field-object shapes mirror the v0.39.6
// collections snapshot exactly.
migrate((app) => {
  // --- shared system fields (safe to reuse ids: field ids are per-collection) ---
  const sysId = () => ({
    autogeneratePattern: "[a-z0-9]{15}", hidden: false, id: "text3208210256",
    max: 15, min: 15, name: "id", pattern: "^[a-z0-9]+$", presentable: false,
    primaryKey: true, required: true, system: true, type: "text",
  })
  const sysCreated = () => ({
    hidden: false, id: "autodate2990389176", name: "created",
    onCreate: true, onUpdate: false, presentable: false, system: false, type: "autodate",
  })
  const sysUpdated = () => ({
    hidden: false, id: "autodate3332085495", name: "updated",
    onCreate: true, onUpdate: true, presentable: false, system: false, type: "autodate",
  })

  // --- field builders ---
  const text = (id, name, required) => ({
    autogeneratePattern: "", hidden: false, id, max: 0, min: 0, name,
    pattern: "", presentable: false, primaryKey: false,
    required: !!required, system: false, type: "text",
  })
  const editor = (id, name) => ({
    convertURLs: false, hidden: false, id, maxSize: 0, name,
    presentable: false, required: false, system: false, type: "editor",
  })
  const imageFile = (id, name) => ({
    hidden: false, id, maxSelect: 1, maxSize: 0,
    mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    name, presentable: false, protected: false, required: false,
    system: false, thumbs: null, type: "file",
  })
  const pdfFile = (id, name) => ({
    hidden: false, id, maxSelect: 1, maxSize: 0,
    mimeTypes: ["application/pdf"],
    name, presentable: false, protected: false, required: false,
    system: false, thumbs: null, type: "file",
  })
  const dateField = (id, name) => ({
    hidden: false, id, max: "", min: "", name,
    presentable: false, required: false, system: false, type: "date",
  })
  const numberField = (id, name) => ({
    hidden: false, id, max: null, min: null, name, onlyInt: false,
    presentable: false, required: false, system: false, type: "number",
  })
  const boolField = (id, name) => ({
    hidden: false, id, name, presentable: false, required: false,
    system: false, type: "bool",
  })
  const jsonField = (id, name) => ({
    hidden: false, id, maxSize: 0, name, presentable: false,
    required: false, system: false, type: "json",
  })
  const selectOne = (id, name, values) => ({
    hidden: false, id, maxSelect: 1, name, presentable: false,
    required: false, system: false, type: "select", values,
  })

  const publicRead = {
    listRule: "", viewRule: "",
    createRule: null, updateRule: null, deleteRule: null,
  }

  const collections = [
    {
      type: "base", name: "settings", ...publicRead,
      fields: [
        sysId(),
        text("text101", "address"),
        numberField("number102", "lat"),
        numberField("number103", "lng"),
        jsonField("json104", "opening_hours"),
        text("text105", "wifi_ssid"),
        text("text106", "wifi_password"),
        text("text107", "instagram"),
        text("text108", "facebook"),
        text("text109", "phone"),
        text("text110", "email"),
        sysCreated(), sysUpdated(),
      ],
    },
    {
      type: "base", name: "news", ...publicRead,
      fields: [
        sysId(),
        text("text201", "title", true),
        editor("editor202", "body"),
        imageFile("file203", "image"),
        dateField("date204", "published_at"),
        sysCreated(), sysUpdated(),
      ],
    },
    {
      type: "base", name: "events", ...publicRead,
      fields: [
        sysId(),
        text("text301", "title", true),
        editor("editor302", "body"),
        imageFile("file303", "image"),
        dateField("date304", "starts_at"),
        sysCreated(), sysUpdated(),
      ],
    },
    {
      type: "base", name: "menus", ...publicRead,
      fields: [
        sysId(),
        text("text401", "title", true),
        pdfFile("file402", "file"),
        numberField("number403", "sort_order"),
        sysCreated(), sysUpdated(),
      ],
    },
    {
      type: "base", name: "coffees", ...publicRead,
      fields: [
        sysId(),
        text("text501", "name", true),
        text("text502", "origin"),
        text("text503", "process"),
        text("text504", "tasting_notes"),
        imageFile("file505", "image"),
        boolField("bool506", "on_grinder"),
        boolField("bool507", "active"),
        sysCreated(), sysUpdated(),
      ],
    },
    {
      type: "base", name: "recipes", ...publicRead,
      fields: [
        sysId(),
        selectOne("select601", "method", ["V60", "AeroPress", "Stempelkande", "Moka"]),
        text("text602", "dose"),
        text("text603", "water"),
        text("text604", "ratio"),
        text("text605", "grind"),
        text("text606", "temp"),
        editor("editor607", "steps"),
        sysCreated(), sysUpdated(),
      ],
    },
  ]

  for (const data of collections) {
    app.save(new Collection(data))
  }
}, (app) => {
  for (const name of ["recipes", "coffees", "menus", "events", "news", "settings"]) {
    try {
      app.delete(app.findCollectionByNameOrId(name))
    } catch (err) {
      // already absent — nothing to roll back
    }
  }
})
