// Genera src/lib/api/schema.d.ts desde el OpenAPI del backend.
// Uso: npm run api:types  (OPENAPI_SOURCE puede ser una ruta o una URL a /docs-json)
import { readFile, writeFile } from "node:fs/promises"
import openapiTS, { astToString } from "openapi-typescript"

const source = process.env.OPENAPI_SOURCE ?? "../View-Internet-Backend/openapi.json"
const spec = JSON.parse(
  /^https?:/.test(source) ? await (await fetch(source)).text() : await readFile(source, "utf8"),
)

// Los parámetros de paginación del backend salen como `allOf: [Object]`;
// se publican como enteros para que el cliente quede bien tipado.
for (const path of Object.values(spec.paths ?? {})) {
  for (const op of Object.values(path)) {
    for (const param of op?.parameters ?? []) {
      const ref = param.schema?.allOf?.[0]?.$ref
      if (ref === "#/components/schemas/Object") {
        delete param.schema.allOf
        param.schema.type = "integer"
      }
    }
  }
}

const ast = await openapiTS(spec)
await writeFile("src/lib/api/schema.d.ts", astToString(ast))
console.log(`Tipos generados desde ${source}`)
