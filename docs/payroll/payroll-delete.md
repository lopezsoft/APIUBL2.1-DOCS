---
sidebar_position: 3
---
# Nómina de eliminación

## JSON de ejemplo

```json title="payroll-delete.json"
{
  "resolution_number": "18760000002",
  "document_number": "11",
  "generation_city_id" : "836",
  "deleting_predecessor": {
    "number": "SETPNE0017",
    "cune": "fa6e59a1d6f69b1d4e37d15f7485744ce5f74627496e91fba0058aacb52d580f6482d89faa34c8861a6e29df856f4dfa",
    "generation_date": "2022-08-28"
  },
  "general_information": {
    "generation_date": "2022-08-28",
    "generation_time": "10:00:00"
  },
  "notes": "Documento eliminado por error contable"
}
```
## Diccionario de datos
- `resolution_number` (string): Número de resolución.
- `document_number` (string): Número de documento.
- `generation_city_id` (string): Identificador de la ciudad de generación.
- `deleting_predecessor` (object): Predecesor de eliminación.
  - `number` (string): Número de predecesor.
  - `cune` (string): CUNE.
  - `generation_date` (string): Fecha de generación.
- `general_information` (object): Información general.
  - `generation_date` (string): Fecha de generación.
  - `generation_time` (string): Hora de generación.
- `notes` (string): Notas.


