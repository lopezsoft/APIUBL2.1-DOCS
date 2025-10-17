---
sidebar_position: 1
---

# Campos de la nómina

La nómina electrónica es un documento que contiene información detallada de los pagos y deducciones que se le realizan
a un trabajador. En este documento se incluyen datos como el nombre del trabajador, el periodo de pago, el salario, las deducciones, entre otros.

A continuación se describen los campos que componen la nómina electrónica.

## JSON de ejemplo
```json title="payroll.json"
{
    "resolution_number": "18760000001",
    "document_number": "27",
    "generation_city_id" : "836",
    "worker_code": "1063279307",
	"novelty": false,
    "pay_day": "2023-09-30",
	"period": {
		"date_entry": "2017-01-01",
		"departure_date": null,
		"settlement_start_date": "2023-09-01",
		"settlement_end_date": "2023-09-30",
		"time_worked": "30",
		"generation_date": "2023-09-24"
	},
	"general_information": {
		"generation_date": "2023-09-24",
		"generation_time": "10:00:00",
		"period_id": "5",
		"currency_id": "272",
		"trm": "0"
	},
	"notes": "",
	"employee": {
		"worker_type_id": 1,
		"worker_subtype_id": 1,
		"high_risk_pension": "false",
		"identity_document_id": "1",
		"document_number": "1063279307",
		"first_surname": "LOPEZ",
		"second_surname": "GOMES",
		"first_name": "LEWIS",
		"other_names": "OSWALDO",
		"working_country_id": 45,
		"work_city_id": 149,
		"work_address": "Calle 64 #1631 La  Capilla Dosquebradas",
		"integral_salary": "false",
		"contract_type_id": 1,
		"salary": "1200000",
		"worker_code": "1063279307"
	},
	"payment": {
		"payment_method_id": "1",
		"means_payment_id": "31",
		"bank": "BANCOLOMBIA",
		"account_type": "AHORROS",
		"account_number": "96645544844"
	},
	"earn": {
		"basic": {
			"worked_days": "30",
			"salary_worked": "1200000"
		},
		"transport": {
			"transportation_assistance": "106454",
			"viatic_maintenance": "0.0",
			"viatic_non_salary_maintenance": "0.0"
		},
        "HEDs": [
            {
                "start_time": null,
                "final_hour": null,
                "amount": "20",
                "percentage": "25.00",
                "payment": "125000"
            }
        ],
        "HENs": [
            {
                "start_time": "2021-12-31T00:00:00",
                "final_hour": "2021-12-31T00:00:00",
                "amount": "0",
                "percentage": "0.00",
                "payment": "0.00"
            }
        ],
        "HRNs": [
            {
                "start_time": "2021-12-31T00:00:00",
                "final_hour": "2021-12-31T00:00:00",
                "amount": "0",
                "percentage": "0.00",
                "payment": "0.00"
            }
        ],
        "HEDDFs": [
            {
                "start_time": "2021-12-31T00:00:00",
                "final_hour": "2021-12-31T00:00:00",
                "amount": "0",
                "percentage": "0.00",
                "payment": "0.00"
            }
        ],
        "HRDDFs": [
            {
                "start_time": "2021-12-31T00:00:00",
                "final_hour": "2021-12-31T00:00:00",
                "amount": "0",
                "percentage": "0.00",
                "payment": "0.00"
            }
        ],
        "HENDFs": [
            {
                "start_time": "2021-12-31T00:00:00",
                "final_hour": "2021-12-31T00:00:00",
                "amount": "0",
                "percentage": "0.00",
                "payment": "0.00"
            }
        ],
        "HRNDFs": [
            {
                "start_time": "2021-12-31T00:00:00",
                "final_hour": "2021-12-31T00:00:00",
                "amount": "0",
                "percentage": "0.00",
                "payment": "0.00"
            }
        ],
		"vacations": {
			"common": {
				"start_date": "2021-12-31",
				"final_date": "2021-12-31",
				"amount": "0",
				"payment": "0.00"
			},
			"paid": {
				"amount": "0",
				"payment": "0.00"
			}
		},
		"bonus": {
			"amount": "0",
			"payment": "0.00",
			"non_salary_payment": "0.00"
		},
		"cesantias": {
			"payment": "0",
			"percentage": "0.00",
			"interest_payment": "0.00"
		},
		"incapacity": [
			{
				"start_date": "2021-12-31",
				"final_date": "2021-12-31",
				"amount": "0",
				"type_id": 1,
				"payment": "0.00"
			}
		],
		"licenses":
        {
            "licenseMP": {
                "start_date": "2021-12-31",
                "final_date": "2021-12-31",
                "amount": "0",
                "payment": "0.00"
            },
            "licenseR": {
                "start_date": "2021-12-31",
                "final_date": "2021-12-31",
                "amount": "0",
                "payment": "0.00"
            },
            "licenseNR": {
                "start_date": "2021-12-31",
                "final_date": "2021-12-31",
                "amount": "0"
            }
        },
		"bonuses": [
			{
				"bonusS": "0.00",
				"bonusNS": "0.00"
			}
		],
		"assistances": [
			{
				"assistanceS": "0.00",
				"assistanceNS": "0.00"
			}
		],
		"legal_strikes": [
			{
				"start_date": "2021-12-31",
				"final_date": "2021-12-31",
				"amount": "0"
			}
		],
		"other_concepts": [
			{
				"description": "Otros conceptos",
				"conceptS": "0.00",
				"conceptNS": "4000.00"
			}
		],
		"compensations": [
			{
				"compensationO": "0.00",
				"compensationE": "0.00"
			}
		],
		"bondEPCTVs": [
			{
				"paymentS": "0.00",
				"paymentNS": "0.00",
				"payment_foodS": "0.00",
				"payment_foodNS": "0.00"
			}
		],
		"commissions": [
			{
				"commission": "0.00"
			}
		],
		"payments_third_party": [
			{
				"payment_third_party": "0.00"
			}
		],
		"advances": [
			{
				"advance": "0.00"
			}
		],
		"endowment": "0.00",
		"sustaining_support": "0.00",
		"teleworking": "0.00",
		"withdrawal_bonus": "0.00",
		"indemnification": "0.00",
		"refund": "0.00"
	},
	"deductions": {
		"health": {
			"percentage": "4",
			"deduction": "43700"
		},
		"pension_fund": {
			"percentage": "4",
			"deduction": "43700"
		},
		"fundSP": {
			"percentage": "0.00",
			"deduction": "0.00",
			"percentageSub": "0.00",
			"deductionSub": "0.00"
		},
		"trade_union": [
			{
				"percentage": "0.00",
				"deduction": "0.00"
			}
		],
		"sanctions": [
			{
				"sanctionPublic": "0.00",
				"sanctionPriv": "0.00"
			}
		],
		"libranzas": [
			{
				"description": "",
				"deduction": "0.00"
			}
		],
		"third_party_payment": [
			{
				"third_party_pay": "90000.00"
			}
		],
		"advances": [
			{
				"advance": "0.00"
			}
		],
		"other_deductions": [
			{
				"other_deduction": "0.00"
			}
		],
		"voluntary_pension": "0.00",
		"retefuente": "0.00",
		"afc": "0.00",
		"cooperative": "0.00",
		"tax_embargo": "0.00",
		"complementary_plan": "0.00",
		"education": "0.00",
		"refund": "0.00",
		"debt": "0.00"
	},
	"rounding": "46",
	"total_earned": "1325000",
	"deductions_total": "97400",
	"total_voucher": "1334054"
}
```
# Diccionario de Datos

## Campos Principales

- `resolution_number`: STRING. Número de la resolución.
- `document_number`: STRING. Número de documento asociado.
- `generation_city_id`: STRING. ID de la ciudad donde se genera el documento.
- `worker_code`: STRING. Código único del trabajador.
- `novelty`: BOOLEAN. Indica si hay novedades.
- `pay_day`: DATE. Fecha de pago.
- `notes`: STRING. Notas adicionales.
- `rounding`: STRING. Redondeo aplicado.
- `total_earned`: STRING. Total ganado.
- `deductions_total`: STRING. Total deducción.
- `total_voucher`: STRING. Total del comprobante.

## Periodo

- `date_entry`: DATE. Fecha de entrada.
- `departure_date`: DATE. Fecha de salida, puede ser nula.
- `settlement_start_date`: DATE. Inicio del período de liquidación.
- `settlement_end_date`: DATE. Fin del período de liquidación.
- `time_worked`: STRING. Tiempo trabajado (días).
- `generation_date`: DATE. Fecha de generación del documento.

## Información General

- `generation_date`: DATE. Fecha de generación del documento.
- `generation_time`: TIME. Hora de generación del documento.
- `period_id`: STRING. ID del período.
- `currency_id`: STRING. ID de la moneda.
- `trm`: STRING. Tasa representativa del mercado.

## Empleado

- `worker_type_id`: INTEGER. Tipo de trabajador.
- `worker_subtype_id`: INTEGER. Subtipo de trabajador.
- `high_risk_pension`: BOOLEAN. Indica si es pensión de alto riesgo.
- `identity_document_id`: STRING. ID del documento de identidad.
- `document_number`: STRING. Número de documento del trabajador.
- `first_surname`: STRING. Primer apellido.
- `second_surname`: STRING. Segundo apellido.
- `first_name`: STRING. Primer nombre.
- `other_names`: STRING. Otros nombres.
- `working_country_id`: INTEGER. ID del país de trabajo.
- `work_city_id`: INTEGER. ID de la ciudad de trabajo.
- `work_address`: STRING. Dirección de trabajo.
- `integral_salary`: BOOLEAN. Indica si el salario es integral.
- `contract_type_id`: INTEGER. Tipo de contrato.
- `salary`: STRING. Salario.

## Pago

- `payment_method_id`: STRING. ID del método de pago.
- `means_payment_id`: STRING. ID del medio de pago.
- `bank`: STRING. Banco.
- `account_type`: STRING. Tipo de cuenta.
- `account_number`: STRING. Número de cuenta.

## Devengado (`earn`)

### Básico (`basic`)

- `worked_days`: STRING. Días trabajados en el período.
- `salary_worked`: STRING. Salario correspondiente a los días trabajados.

### Transporte (`transport`)

- `transportation_assistance`: STRING. Asistencia de transporte.
- `viatic_maintenance`: STRING. Viáticos de mantenimiento.
- `viatic_non_salary_maintenance`: STRING. Viáticos de mantenimiento no salariales.

### Horas Extras Diurnas (`HEDs`)

- `start_time`: TIME (nullable). Hora de inicio de las horas extras diurnas, puede ser nulo.
- `final_hour`: TIME (nullable). Hora final de las horas extras diurnas, puede ser nulo.
- `amount`: STRING. Cantidad de horas extras diurnas trabajadas.
- `percentage`: STRING. Porcentaje aplicado a las horas extras diurnas.
- `payment`: STRING. Pago correspondiente a las horas extras diurnas.

### Horas Extras Nocturnas (`HENs`), Horas de Recargo Nocturno (`HRNs`), Horas Extras Diurnas en Día Festivo (`HEDDFs`), etc.

- Cada tipo de hora extra o recargo tiene campos para `start_time`, `final_hour`, `amount`, `percentage`, y `payment`, adaptándose según el tipo específico.

### Vacaciones (`vacations`)

  - `common`: OBJETO. Vacaciones comunes con `start_date`, `final_date`, `amount`, y `payment`.
    - Descripción los campos
      - `start_date`: Fecha de inicio de las vacaciones.
      - `final_date`: Fecha final de las vacaciones.
      - `amount`: Cantidad de días de vacaciones.
      - `payment`: Pago correspondiente a las vacaciones.
    - `paid`: OBJETO. Vacaciones pagadas con `amount` y `payment`.
      - Descripción los campos
        - `amount`: Cantidad de días de vacaciones pagadas.
        - `payment`: Pago correspondiente a las vacaciones pagadas.
  - `paid`: OBJETO. Vacaciones pagadas con `amount` y `payment`.
- ### Ejemplo de vacaciones:
  ```json
  "vacations": {
    "common": {
      "start_date": "2023-01-01",
      "final_date": "2023-01-10",
      "amount": "10",
      "payment": "1000"
    },
    "paid": {
      "amount": "2000",
      "payment": "2000"
    }
  }
  ```



### Primas (`bonus`)

- `amount`: STRING. Cantidad de la prima.
- `payment`: STRING. Pago de la prima.
- `non_salary_payment`: STRING. Pago de la prima no salarial. 

### Cesantías (`cesantias`)

- `payment`: STRING. Pago de las cesantías.
- `percentage`: STRING. Porcentaje aplicado a las cesantías.
- `interest_payment`: STRING. Pago de intereses sobre las cesantías.

### Incapacidades (`incapacity`)

- Lista de incapacidades, cada una con `start_date`, `final_date`, `amount`, `type_id`, y `payment`.

### Licencias (`licenses`)

- Incluye licencias por maternidad (`licenseMP`), recreativas (`licenseR`), y no remuneradas (`licenseNR`), cada una con `start_date`, `final_date`, `amount`, y `payment` (cuando aplique).

### Otros Conceptos de Ganancias

- Detalles de bonificaciones especiales (`bonuses`), asistencias (`assistances`),
huelgas legales (`legal_strikes`), otros conceptos (`other_concepts`), compensaciones (`compensations`),
bonificaciones por EPCTV (`bondEPCTVs`), comisiones (`commissions`), pagos a terceros (`payments_third_party`),
anticipos (`advances`), dotación (`endowment`), apoyo sostenimiento (`sustaining_support`),
teletrabajo (`teleworking`), bonificación por retiro (`withdrawal_bonus`), indemnizaciones
(`indemnification`), reembolsos (`refund`), especificando los campos relevantes para cada uno.

## Deducciones (`deductions`)

### Salud (`health`)

- `percentage`: STRING. Porcentaje de deducción por concepto de salud.
- `deduction`: STRING. Monto deducido por salud.

### Fondo de Pensiones (`pension_fund`)

- `percentage`: STRING. Porcentaje de deducción por fondo de pensiones.
- `deduction`: STRING. Monto deducido por fondo de pensiones.

### Fondo de Solidaridad Pensional (`fundSP`)

- `percentage`: STRING. Porcentaje de contribución al fondo de solidaridad pensional.
- `deduction`: STRING. Monto deducido por fondo de solidaridad pensional.
- `percentageSub`: STRING. Porcentaje de contribución subsidiada al fondo de solidaridad pensional.
- `deductionSub`: STRING. Monto deducido por contribución subsidiada.

### Sindicato (`trade_union`)

- `percentage`: STRING. Porcentaje de deducción por sindicato.
- `deduction`: STRING. Monto deducido por sindicato.

### Sanciones (`sanctions`)

- `sanctionPublic`: STRING. Sanciones públicas.
- `sanctionPriv`: STRING. Sanciones privadas.

### Libranzas (`libranzas`)

- `description`: STRING. Descripción de la libranza.
- `deduction`: STRING. Monto deducido por libranza.

### Pago a Terceros (`third_party_payment`)

- `third_party_pay`: STRING. Pago realizado a terceros.

### Anticipos (`advances`)

- `advance`: STRING. Monto de los anticipos proporcionados.

### Otras Deducciones (`other_deductions`)

- `other_deduction`: STRING. Monto de otras deducciones no especificadas anteriormente.

### Pension Voluntaria (`voluntary_pension`)

- `voluntary_pension`: STRING. Monto deducido por concepto de pensión voluntaria.

### Retención en la Fuente (`retefuente`)

- `retefuente`: STRING. Monto deducido por retención en la fuente.

### AFC (`afc`)

- `afc`: STRING. Monto deducido por cuentas de ahorro para el fomento de la construcción (AFC).

### Cooperativa (`cooperative`)

- `cooperative`: STRING. Monto deducido por aportes a cooperativas.

### Embargo Fiscal (`tax_embargo`)

- `tax_embargo`: STRING. Monto deducido por embargos fiscales.

### Plan Complementario (`complementary_plan`)

- `complementary_plan`: STRING. Monto deducido por plan complementario de salud.

### Educación (`education`)

- `education`: STRING. Monto deducido por concepto de educación.

### Reembolso (`refund`)

- `refund`: STRING. Monto de reembolsos realizados al empleado.

### Deuda (`debt`)

- `debt`: STRING. Monto deducido por deudas con la empresa.

## Totales del Documento

- `total_earned`: STRING. Total de ingresos ganados por el empleado durante el período.
- `deductions_total`: STRING. Total de deducciones aplicadas al pago del empleado.
- `total_voucher`: STRING. Monto final después de aplicar ingresos y deducciones.
