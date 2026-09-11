# Especificación de listas de favoritos para frontend

**Estado:** Aprobado para implementación frontend  
**Versión:** 1.1  
**Fecha:** 2026-09-10  
**Base URL:** `/api/v1`

## 1. Objetivo

Permitir que una persona autenticada organice datasets consultables en varias
listas personales de favoritos durante la exploración. Un favorito es una
preferencia privada: nunca concede acceso a un dataset ni sustituye un
entitlement.

## 2. Reglas de producto

- Cada lista pertenece exclusivamente al usuario de la sesión actual.
- No existe una lista predeterminada: antes de guardar un dataset se debe crear
  o seleccionar una lista.
- Los nombres se recortan, deben tener entre 1 y 100 caracteres y son únicos
  por usuario sin distinguir mayúsculas de minúsculas.
- Un dataset puede pertenecer a varias listas del mismo usuario, pero una sola
  vez dentro de cada lista.
- Un dataset nuevo solo se puede guardar si el usuario puede consultar sus
  metadatos en ese momento. Esto incluye datasets `public`, `unlisted` y los
  `private` para los que conserve autorización.
- Un favorito existente se puede quitar aunque el dataset ya no sea
  consultable. Si perdió acceso, no aparece en las respuestas que devuelven
  tarjetas de datasets.
- Todas las fechas de favoritos son RFC 3339 en UTC y terminan en `Z`.

## 3. Autenticación y aislamiento

Todas las rutas requieren:

```http
Authorization: Bearer <access_token>
```

El backend deriva el usuario del token. Frontend nunca debe enviar `user_id`.
Una lista inexistente y una lista de otra cuenta reciben el mismo `404`; no se
debe inferir propiedad a partir del identificador.

Ante `401`, limpiar la sesión local y llevar al usuario al inicio de sesión.

## 4. Tipos de cliente

```ts
export interface FavoriteList {
  id: string;
  name: string;
  created_at: string; // RFC 3339 UTC, por ejemplo 2026-09-10T14:30:00Z
  updated_at: string;
}

export interface OffsetPage<T> {
  data: T[];
  limit: number;
  offset: number;
  next_offset: number | null;
}

export interface FavoriteListMembership {
  dataset_id: string;
  list_ids: string[];
}
```

Las rutas de datasets devuelven `DatasetPublicResponse`, la proyección base
del catálogo. Sus aliases JSON relevantes son `_id`, `ownerId` y
`publicPreviewEnabled`. No usar `id` ni `owner_id` para una tarjeta de dataset.
Tampoco asumir `samples` o `isLimited`: esos campos solo pertenecen a la
respuesta de detalle cuando estén disponibles.

## 5. Contrato HTTP

### 5.1 Crear una lista

```http
POST /api/v1/users/me/favorite-lists
Content-Type: application/json
```

```json
{
  "name": "Movilidad para revisar"
}
```

Respuesta `201 Created`:

```json
{
  "id": "66d0f4bb9e5f78bc8e4a2d31",
  "name": "Movilidad para revisar",
  "created_at": "2026-09-10T14:30:00Z",
  "updated_at": "2026-09-10T14:30:00Z"
}
```

Los espacios exteriores se eliminan. Campos adicionales, un nombre vacío o de
más de 100 caracteres producen `422`.

### 5.2 Consultar listas

La ruta sin página se conserva por compatibilidad:

```http
GET /api/v1/users/me/favorite-lists
```

Devuelve `200 OK` con `FavoriteList[]`, ordenado por modificación más reciente.
Una cuenta sin listas recibe `[]`.

Las implementaciones nuevas **deben preferir** la ruta paginada:

```http
GET /api/v1/users/me/favorite-lists/page?limit=20&offset=0
```

- `limit`: opcional, entre `1` y `50`; por defecto `20`.
- `offset`: opcional, mínimo `0`; por defecto `0`.

Respuesta `200 OK`:

```json
{
  "data": [
    {
      "id": "66d0f4bb9e5f78bc8e4a2d31",
      "name": "Movilidad para revisar",
      "created_at": "2026-09-10T14:30:00Z",
      "updated_at": "2026-09-10T14:35:00Z"
    }
  ],
  "limit": 20,
  "offset": 0,
  "next_offset": 20
}
```

`next_offset: null` indica que no hay más resultados. Para cargar la página
siguiente, usar exactamente el valor de `next_offset` recibido.

### 5.3 Renombrar y eliminar una lista

```http
PATCH /api/v1/users/me/favorite-lists/{listId}
Content-Type: application/json
```

```json
{ "name": "Comprar después" }
```

Respuesta `200 OK`: `FavoriteList` actualizado.

```http
DELETE /api/v1/users/me/favorite-lists/{listId}
```

Respuesta exitosa: `204 No Content` sin body. La operación elimina también las
relaciones de datasets de esa lista. Requiere confirmación de interfaz.

### 5.4 Guardar o quitar un dataset

```http
PUT /api/v1/users/me/favorite-lists/{listId}/datasets/{datasetId}
DELETE /api/v1/users/me/favorite-lists/{listId}/datasets/{datasetId}
```

Ambas respuestas exitosas son `204 No Content` y no tienen body.

- `PUT` es idempotente: una relación ya existente devuelve `204`, incluso si
  el usuario perdió acceso al dataset después de haberla creado. Si no existe,
  el backend vuelve a validar acceso antes de crearla.
- `DELETE` es idempotente para un ítem ausente; la lista debe existir y ser del
  usuario.
- Para `PUT`, un `datasetId` con formato inválido devuelve `400`; un dataset
  no consultable devuelve `404`. `DELETE` no valida el formato de `datasetId`:
  usa el valor como identificador de la relación a eliminar.

### 5.5 Ver datasets de una lista

La ruta completa se conserva por compatibilidad:

```http
GET /api/v1/users/me/favorite-lists/{listId}/datasets
```

Devuelve `200 OK` con `DatasetPublicResponse[]`. Omite datasets que ya no son
consultables y nunca expone sus metadatos.

Para una interfaz nueva usar la página acotada:

```http
GET /api/v1/users/me/favorite-lists/{listId}/datasets/page?limit=20&offset=0
```

Respuesta `200 OK`:

```json
{
  "data": [
    {
      "_id": "66cfa7ae0a1962f9fb796b30",
      "ownerId": "66bf2d9a10c5cc81d43e1370",
      "title": "Indicadores de movilidad urbana",
      "category": "transport",
      "tags": ["movilidad", "ciudades"],
      "visibility": "public",
      "status": "active",
      "publicPreviewEnabled": false
    }
  ],
  "limit": 20,
  "offset": 0,
  "next_offset": null
}
```

La página avanza sobre relaciones guardadas, no sobre datasets visibles. Por
eso `data` puede tener menos elementos que `limit` —incluso estar vacía— y aun
así incluir `next_offset`. Mientras exista ese valor, el cliente debe poder
pedir la siguiente página antes de decidir que la lista está vacía.

### 5.6 Resolver en qué listas está un conjunto de datasets

Usar este endpoint para marcar tarjetas de catálogo o detalle sin descargar el
contenido de todas las listas:

```http
POST /api/v1/users/me/favorite-list-memberships/lookup
Content-Type: application/json
```

```json
{
  "dataset_ids": [
    "66cfa7ae0a1962f9fb796b30",
    "66d0a7ae0a1962f9fb796b31"
  ]
}
```

- Recibe entre 1 y 100 IDs MongoDB válidos de 24 caracteres hexadecimales, sin
  duplicados ni campos extra.
- Devuelve una entrada por cada ID solicitado, en el mismo orden.
- Solo devuelve `list_ids` de la cuenta autenticada; no entrega metadatos de
  datasets ni de listas.

Respuesta `200 OK`:

```json
[
  {
    "dataset_id": "66cfa7ae0a1962f9fb796b30",
    "list_ids": ["66d0f4bb9e5f78bc8e4a2d31"]
  },
  {
    "dataset_id": "66d0a7ae0a1962f9fb796b31",
    "list_ids": []
  }
]
```

La consulta puede informar una relación histórica aunque el dataset ya no sea
consultable. No usarla para decidir si se puede ver o consumir un dataset; solo
para mostrar el estado de favorito de una tarjeta que ya es visible.

## 6. Errores y tratamiento de interfaz

El error de validación tiene una forma estable y segura:

```json
{
  "detail": [
    {
      "loc": ["body", "name"],
      "msg": "String should have at least 1 character",
      "type": "string_too_short"
    }
  ]
}
```

El backend no incluye el body enviado, valores de entrada ni contexto interno
en `422`. Mapear un error de campo usando el último segmento de `loc`; no
comparar literalmente `msg`.

| Código | Cuándo ocurre | Comportamiento esperado de UI |
|---:|---|---|
| `400` | `PUT` recibe un `datasetId` con formato inválido. | Revertir cambio optimista y mostrar error recuperable. |
| `401` | Sesión ausente, expirada o inválida. | Redirigir a login. |
| `404` | Lista inexistente/ajena o dataset no consultable al crear un favorito. | Refrescar estado local; no revelar ni asumir propiedad de recursos ajenos. |
| `409` | Crear o renombrar con un nombre ya usado por esa cuenta. | Mantener el formulario y pedir otro nombre. |
| `422` | Payload, IDs de lookup o parámetros de página inválidos. | Mostrar errores de campo y no reenviar el mismo payload. |

Para `PUT` y `DELETE`, una respuesta `204` es final exitosa: no intentar
parsear JSON. Revertir cambios optimistas ante `400`, `404` o error de red.

## 7. Flujos de interfaz

### 7.1 Catálogo y detalle

1. Cargar las listas con `GET /users/me/favorite-lists/page` y conservar un
   mapa de `listId -> FavoriteList`.
2. Para el conjunto de tarjetas visible, llamar una vez a
   `POST /favorite-list-memberships/lookup` con sus IDs.
3. Mostrar el selector de listas y ejecutar un `PUT` o `DELETE` por cada
   elección que cambie.
4. Usar `Promise.allSettled` o equivalente: no existe una operación atómica
   para múltiples listas. Mostrar cuáles acciones tuvieron éxito y permitir
   reintentar solo las fallidas.
5. Tras cada `204`, actualizar el mapa de memberships local. No permitir que
   ese estado habilite preview, descarga ni consumo por API.

Si no hay listas, abrir el formulario de creación y usar la respuesta `201`
como lista seleccionada.

### 7.2 Pantalla “Mis favoritos”

- Cargar `GET /users/me/favorite-lists/page` y paginar mientras exista
  `next_offset`.
- Al abrir una lista, cargar la ruta paginada de datasets. Continuar si llega
  una página vacía con `next_offset`, porque puede contener solo favoritos cuyo
  acceso ya no está vigente.
- Estado vacío de listas: “Crea una lista para organizar datasets que quieras
  revisar”.
- Estado vacío final de una lista: “Aún no hay datasets disponibles en esta
  lista”. Puede ser una lista nueva o contener solo datasets no disponibles;
  no intentar distinguir ambos casos en la UI.
- Renombrar o agregar/quitar datasets modifica `updated_at`; refrescar la
  primera página de listas tras una operación exitosa si se muestra por fecha.

## 8. Criterios de aceptación frontend

- Un usuario puede crear dos o más listas y ver timestamps UTC con `Z`.
- El mismo dataset se puede guardar en varias listas, sin duplicarse dentro de
  una sola.
- Reintentar un `PUT` o `DELETE` no genera duplicados ni falla por ausencia del
  ítem.
- La interfaz resuelve el estado de favorito de hasta 100 tarjetas en una sola
  consulta de memberships.
- Las páginas respetan `next_offset`; una página de datasets puede estar vacía
  sin significar que terminó el recorrido.
- Un usuario no ve ni modifica una lista ajena, ni recibe metadatos de datasets
  que perdió autorización para consultar.
- Ninguna acción de favoritos envía `user_id` ni concede acceso a contenido.

## 9. Fuera de alcance

- Compartir listas entre usuarios.
- Orden manual de datasets dentro de una lista.
- Notificaciones cuando cambia la disponibilidad de un favorito.
- Sincronización offline o resolución automática de conflictos entre
  dispositivos.
