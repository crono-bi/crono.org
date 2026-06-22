// AUTO-GENERADO por scripts/sync-function-docs.mjs — NO EDITAR A MANO.
// Fuente de verdad: crono.org/src/content/docs/sql/functions/**
// Regenerar con: npm run sync
export interface GeneratedDoc {
  description: string;
  example?: string;
  slug: string;
  category?: string;
}

export const GENERATED_FUNCTION_DOCS: Record<string, GeneratedDoc> = {
    "avg": {
        "description": "La función `avg` devuelve la media aritmética de los valores de un grupo, ignorando los valores `NULL`.",
        "slug": "functions/agregacion/avg",
        "example": "select avg(orders.freight) media_porte\nfrom staging.orders;",
        "category": "aggregation"
    },
    "avgif": {
        "description": "La función `avgif` devuelve la media aritmética de una expresión solo para las filas que cumplen una condición. Las filas que no cumplen la condición se ignoran en el cálculo.",
        "slug": "functions/agregacion/avgif",
        "example": "SELECT\n  products.product_name,\n  avg(od.unit_price)                              avg_price,\n  avgif(orders.customer_id = 'SUPRD', od.unit_price) avg_price_suprd\nFROM staging.order_details od\nINNER JOIN staging.orders USING order_id\nINNER JOIN staging.products USING product_id",
        "category": "aggregation"
    },
    "count": {
        "description": "La función `count` devuelve el número de filas de un grupo. `count(*)` cuenta todas las filas; `count(columna)` ignora los valores `NULL`.",
        "slug": "functions/agregacion/count",
        "example": "select customers.country, count(*) total_clientes\nfrom staging.customers\ngroup by customers.country;",
        "category": "aggregation"
    },
    "count_distinct": {
        "description": "La función `count_distinct` devuelve el número de valores distintos y no nulos de una expresión en un grupo.",
        "slug": "functions/agregacion/count_distinct",
        "example": "select count_distinct(orders.customer_id) clientes_con_pedidos\nfrom staging.orders;",
        "category": "aggregation"
    },
    "countif": {
        "description": "La función `countif` cuenta las filas que cumplen una condición, ignorando las que no la cumplen.",
        "slug": "functions/agregacion/countif",
        "example": "SELECT\n  products.product_name,\n  count(od.order_id)                              total_orders,\n  countif(orders.customer_id = 'SUPRD', od.order_id) orders_suprd\nFROM staging.order_details od\nINNER JOIN staging.orders USING order_id\nINNER JOIN staging.products USING product_id",
        "category": "aggregation"
    },
    "decile": {
        "description": "La función `decile` es una función de ventana que clasifica cada fila en uno de los 10 grupos de igual tamaño según el valor de la expresión de ordenación. El grupo 1 contiene los valores más bajos y el 10 los más altos.",
        "slug": "functions/agregacion/decile",
        "example": "select\n  products.product_name,\n  sum(order_details.unit_price * order_details.quantity) ventas,\n  decile(order by ventas) decil\nfrom staging.order_details\ninner join staging.products using product_id\ngroup by all;",
        "category": "aggregation"
    },
    "dense_rank": {
        "description": "La función `dense_rank` es una función de ventana que asigna un rango a cada fila según el orden especificado. Cuando dos o más filas tienen el mismo valor, reciben el mismo rango, pero el siguiente rango asignado es consecutivo: no hay huecos en la numeración.",
        "slug": "functions/agregacion/dense_rank",
        "example": "select\n  employees.first_name,\n  employees.last_name,\n  count(orders.order_id) num_pedidos,\n  dense_rank(order by num_pedidos desc) posicion\nfrom staging.orders\ninner join staging.employees using employee_id\ngroup by all;",
        "category": "aggregation"
    },
    "end_date": {
        "description": "La función `end_date` es una función de ventana que calcula la fecha de fin de un periodo a partir de la fecha de inicio. Es útil cuando la tabla solo almacena la fecha de inicio de cada periodo y la fecha de fin se infiere como el día anterior al siguiente inicio.",
        "slug": "functions/agregacion/end_date",
        "example": "select\n  product_prices.product_id,\n  product_prices.unit_price,\n  product_prices.valid_from,\n  end_date(product_prices.valid_from partition by product_prices.product_id) valid_to\nfrom staging.product_prices;",
        "category": "aggregation"
    },
    "end_datetime": {
        "description": "La función `end_datetime` es una función de ventana que calcula la fecha y hora de fin de un periodo a partir de la fecha y hora de inicio. Es útil cuando la tabla solo almacena el inicio de cada periodo y el fin se infiere a partir del siguiente registro.",
        "slug": "functions/agregacion/end_datetime",
        "example": "select\n  product_prices.product_id,\n  product_prices.unit_price,\n  product_prices.valid_from,\n  end_datetime(product_prices.valid_from partition by product_prices.product_id) valid_to\nfrom staging.product_prices;",
        "category": "aggregation"
    },
    "first_value": {
        "description": "La función `first_value` es una función de ventana que devuelve el valor de una expresión correspondiente a la primera fila del rango.",
        "slug": "functions/agregacion/first_value",
        "example": "select\n  customers.company_name,\n  orders.order_id,\n  orders.order_date,\n  first_value(orders.order_date partition by orders.customer_id order by orders.order_date) fecha_primer_pedido\nfrom staging.orders\ninner join staging.customers using customer_id;",
        "category": "aggregation"
    },
    "is_first": {
        "description": "La función `is_first` es una función de ventana que devuelve `1` para la primera fila del rango y `0` para el resto.",
        "slug": "functions/agregacion/is_first",
        "example": "select\n  customers.company_name,\n  orders.order_date,\n  is_first(partition by orders.customer_id order by orders.order_date) primer_pedido,\n  is_last(partition by orders.customer_id order by orders.order_date) ultimo_pedido\nfrom staging.orders\ninner join staging.customers using customer_id;",
        "category": "aggregation"
    },
    "is_last": {
        "description": "La función `is_last` es una función de ventana que devuelve `1` para la última fila del rango y `0` para el resto.",
        "slug": "functions/agregacion/is_last",
        "example": "select\n  customers.company_name,\n  orders.order_date,\n  is_first(partition by orders.customer_id order by orders.order_date) primer_pedido,\n  is_last(partition by orders.customer_id order by orders.order_date) ultimo_pedido\nfrom staging.orders\ninner join staging.customers using customer_id;",
        "category": "aggregation"
    },
    "lag": {
        "description": "La función `lag` es una función de ventana estándar que devuelve el valor de una expresión en una fila anterior dentro de la partición. Requiere la cláusula `ORDER BY`.",
        "slug": "functions/agregacion/lag",
        "example": "SELECT\n  year(orders.order_date)                                    order_year,\n  month(orders.order_date)                                   order_month,\n  sum(order_details.unit_price * order_details.quantity)     amount,\n  lag(amount, 2) OVER (ORDER BY order_year, order_month)     amount_2_months_ago\nFROM staging.order_details\nINNER JOIN staging.orders USING order_id",
        "category": "aggregation"
    },
    "last_value": {
        "description": "La función `last_value` es una función de ventana que devuelve el valor de una expresión correspondiente a la última fila del rango.",
        "slug": "functions/agregacion/last_value",
        "example": "select\n  customers.company_name,\n  orders.order_id,\n  orders.order_date,\n  last_value(orders.order_date partition by orders.customer_id order by orders.order_date) fecha_ultimo_pedido\nfrom staging.orders\ninner join staging.customers using customer_id;",
        "category": "aggregation"
    },
    "lead": {
        "description": "La función `lead` es una función de ventana estándar que devuelve el valor de una expresión en una fila posterior dentro de la partición. Requiere la cláusula `ORDER BY`.",
        "slug": "functions/agregacion/lead",
        "example": "SELECT\n  year(orders.order_date)                                    order_year,\n  month(orders.order_date)                                   order_month,\n  sum(order_details.unit_price * order_details.quantity)     amount,\n  lead(amount, 2) OVER (ORDER BY order_year, order_month)    amount_2_months_ahead\nFROM staging.order_details\nINNER JOIN staging.orders USING order_id",
        "category": "aggregation"
    },
    "max": {
        "description": "La función `max` devuelve el valor máximo de los valores de un grupo, ignorando los valores `NULL`.",
        "slug": "functions/agregacion/max",
        "example": "select max(orders.freight) porte_maximo\nfrom staging.orders;",
        "category": "aggregation"
    },
    "maxif": {
        "description": "La función `maxif` devuelve el valor máximo de una expresión solo para las filas que cumplen una condición. Las filas que no cumplen la condición se ignoran.",
        "slug": "functions/agregacion/maxif",
        "example": "SELECT\n  products.product_name,\n  max(od.unit_price)                              max_price,\n  maxif(orders.customer_id = 'SUPRD', od.unit_price) max_price_suprd\nFROM staging.order_details od\nINNER JOIN staging.orders USING order_id\nINNER JOIN staging.products USING product_id",
        "category": "aggregation"
    },
    "min": {
        "description": "La función `min` devuelve el valor mínimo de los valores de un grupo, ignorando los valores `NULL`.",
        "slug": "functions/agregacion/min",
        "example": "select min(orders.freight) porte_minimo\nfrom staging.orders;",
        "category": "aggregation"
    },
    "minif": {
        "description": "La función `minif` devuelve el valor mínimo de una expresión solo para las filas que cumplen una condición. Las filas que no cumplen la condición se ignoran.",
        "slug": "functions/agregacion/minif",
        "example": "SELECT\n  products.product_name,\n  min(od.unit_price)                              min_price,\n  minif(orders.customer_id = 'SUPRD', od.unit_price) min_price_suprd\nFROM staging.order_details od\nINNER JOIN staging.orders USING order_id\nINNER JOIN staging.products USING product_id",
        "category": "aggregation"
    },
    "next_value": {
        "description": "La función `next_value` es una función de ventana que devuelve el valor de la siguiente fila del rango.",
        "slug": "functions/agregacion/next_value",
        "example": "select\n  year(orders.order_date) anyo,\n  month(orders.order_date) mes,\n  sum(order_details.unit_price * order_details.quantity) ventas,\n  next_value(ventas order by anyo, mes) ventas_mes_siguiente\nfrom staging.order_details\ninner join staging.orders using order_id\ngroup by all;",
        "category": "aggregation"
    },
    "pct": {
        "description": "La función `pct` es una función de ventana que devuelve el porcentaje de cada valor respecto a la suma total del rango.",
        "slug": "functions/agregacion/pct",
        "example": "select\n  categories.category_name,\n  sum(order_details.unit_price * order_details.quantity) ventas,\n  pct(ventas) pct_sobre_total\nfrom staging.order_details\ninner join staging.products using product_id\ninner join staging.categories using category_id\ngroup by all;",
        "category": "aggregation"
    },
    "pct_rank": {
        "description": "La función `pct_rank` es una función de ventana que devuelve la posición relativa de cada fila normalizada entre 0 y 1.",
        "slug": "functions/agregacion/pct_rank",
        "example": "select\n  products.product_name,\n  sum(order_details.unit_price * order_details.quantity) ventas,\n  pct_rank(order by ventas desc) ranking\nfrom staging.order_details\ninner join staging.products using product_id\ngroup by all\nqualify ranking < 0.2;",
        "category": "aggregation"
    },
    "percentile": {
        "description": "La función `percentile` es una función de ventana que devuelve la posición relativa de cada fila como un valor entero entre 1 y 100.",
        "slug": "functions/agregacion/percentile",
        "example": "select\n  products.product_name,\n  sum(order_details.unit_price * order_details.quantity) ventas,\n  percentile(order by ventas) percentil\nfrom staging.order_details\ninner join staging.products using product_id\ngroup by all;",
        "category": "aggregation"
    },
    "previous_value": {
        "description": "La función `previous_value` es una función de ventana que devuelve el valor de la fila anterior del rango.",
        "slug": "functions/agregacion/previous_value",
        "example": "select\n  year(orders.order_date) anyo,\n  month(orders.order_date) mes,\n  sum(order_details.unit_price * order_details.quantity) ventas,\n  previous_value(ventas order by anyo, mes) ventas_mes_anterior\nfrom staging.order_details\ninner join staging.orders using order_id\ngroup by all;",
        "category": "aggregation"
    },
    "quantile": {
        "description": "La función `quantile` es una función de ventana que clasifica cada fila en uno de los *n* grupos de igual tamaño según el valor de la expresión de ordenación.",
        "slug": "functions/agregacion/quantile",
        "example": "select\n  products.product_name,\n  sum(order_details.unit_price * order_details.quantity) ventas,\n  quantile(5, order by ventas) grupo\nfrom staging.order_details\ninner join staging.products using product_id\ngroup by all;",
        "category": "aggregation"
    },
    "quartile": {
        "description": "La función `quartile` es una función de ventana que clasifica cada fila en uno de los 4 grupos de igual tamaño según el valor de la expresión de ordenación. El grupo 1 contiene los valores más bajos y el 4 los más altos.",
        "slug": "functions/agregacion/quartile",
        "example": "select\n  products.product_name,\n  sum(order_details.unit_price * order_details.quantity) ventas,\n  quartile(order by ventas) cuartil\nfrom staging.order_details\ninner join staging.products using product_id\ngroup by all;",
        "category": "aggregation"
    },
    "rank": {
        "description": "La función `rank` es una función de ventana que asigna un rango a cada fila según el orden especificado. Cuando dos o más filas tienen el mismo valor, reciben el mismo rango y el siguiente rango asignado salta los puestos correspondientes: si dos filas empatan en el puesto 2, la siguiente recibe el puesto 4.",
        "slug": "functions/agregacion/rank",
        "example": "select\n  categories.category_name,\n  products.product_name,\n  sum(order_details.unit_price * order_details.quantity) ventas,\n  rank(partition by categories.category_name order by ventas desc) posicion\nfrom staging.order_details\ninner join staging.products using product_id\ninner join staging.categories using category_id\ngroup by all;",
        "category": "aggregation"
    },
    "row_number": {
        "description": "La función `row_number` es una función de ventana que asigna un número secuencial único a cada fila del rango, comenzando por 1. A diferencia de `rank` y `dense_rank`, no produce empates: si dos filas tienen el mismo valor de ordenación, el número asignado es arbitrario pero siempre distinto.",
        "slug": "functions/agregacion/row_number",
        "example": "select\n  customers.company_name,\n  orders.order_id,\n  orders.order_date,\n  row_number(partition by orders.customer_id order by orders.order_date) num_pedido\nfrom staging.orders\ninner join staging.customers using customer_id;",
        "category": "aggregation"
    },
    "running_pct": {
        "description": "La función `running_pct` es una función de ventana que devuelve el porcentaje acumulado de un indicador desde el inicio del rango hasta cada fila, respecto al total.",
        "slug": "functions/agregacion/running_pct",
        "example": "select\n  year(orders.order_date) anyo,\n  month(orders.order_date) mes,\n  sum(order_details.unit_price * order_details.quantity) ventas,\n  running_pct(ventas partition by anyo order by mes) pct_acumulado\nfrom staging.order_details\ninner join staging.orders using order_id\ngroup by all;",
        "category": "aggregation"
    },
    "running_sum": {
        "description": "La función `running_sum` es una función de ventana que devuelve la suma acumulada de un indicador desde el inicio del rango hasta cada fila.",
        "slug": "functions/agregacion/running_sum",
        "example": "select\n  year(orders.order_date) anyo,\n  month(orders.order_date) mes,\n  sum(order_details.unit_price * order_details.quantity) ventas,\n  running_sum(ventas order by anyo, mes) ventas_acumuladas\nfrom staging.order_details\ninner join staging.orders using order_id\ngroup by all;",
        "category": "aggregation"
    },
    "sum": {
        "description": "La función `sum` devuelve la suma de los valores de un grupo, ignorando los valores `NULL`.",
        "slug": "functions/agregacion/sum",
        "example": "select\n  products.product_name,\n  sum(order_details.unit_price * order_details.quantity) total_ventas\nfrom staging.order_details\ninner join staging.products using product_id\ngroup by all;",
        "category": "aggregation"
    },
    "sumif": {
        "description": "La función `sumif` devuelve la suma de una expresión solo para las filas que cumplen una condición. Las filas que no cumplen la condición se tratan como `NULL` y no contribuyen a la suma.",
        "slug": "functions/agregacion/sumif",
        "example": "SELECT\n  products.product_name,\n  sum(od.quantity * od.unit_price)                          amount,\n  sumif(orders.customer_id = 'SUPRD', od.quantity * od.unit_price) amount_suprd\nFROM staging.order_details od\nINNER JOIN staging.orders USING order_id\nINNER JOIN staging.products USING product_id",
        "category": "aggregation"
    },
    "bigint": {
        "description": "La función `bigint` convierte una expresión al tipo entero de 8 bytes. Admite valores entre -9.223.372.036.854.775.808 y 9.223.372.036.854.775.807.",
        "slug": "functions/conversion/bigint",
        "example": "select bigint('9000000000') resultado;",
        "category": "conversion"
    },
    "boolean": {
        "description": "La función `boolean` convierte una expresión al tipo booleano. Devuelve `1` si la expresión es verdadera o distinta de cero, y `0` en caso contrario.",
        "slug": "functions/conversion/boolean",
        "example": "select boolean(1) resultado;",
        "category": "conversion"
    },
    "date": {
        "description": "La función `date` convierte una expresión al tipo `date`, que almacena únicamente la fecha sin la parte horaria.",
        "slug": "functions/conversion/date",
        "example": "select date('2025-06-15 14:30:00') resultado;",
        "category": "conversion"
    },
    "datetime": {
        "description": "La función `datetime` convierte una expresión al tipo `datetime`, que almacena fecha y hora.",
        "slug": "functions/conversion/datetime",
        "example": "select datetime('2025-06-15') resultado;",
        "category": "conversion"
    },
    "float": {
        "description": "La función `float` convierte una expresión a número de punto flotante de doble precisión.",
        "slug": "functions/conversion/float",
        "example": "select float('3.14') resultado;",
        "category": "conversion"
    },
    "int": {
        "description": "La función `int` convierte una expresión al tipo entero de 4 bytes. Admite valores entre -2.147.483.648 y 2.147.483.647.",
        "slug": "functions/conversion/int",
        "example": "select int('42') resultado;",
        "category": "conversion"
    },
    "real": {
        "description": "La función `real` convierte una expresión a número de punto flotante de precisión simple.",
        "slug": "functions/conversion/real",
        "example": "select real('3.14') resultado;",
        "category": "conversion"
    },
    "smallint": {
        "description": "La función `smallint` convierte una expresión al tipo entero de 2 bytes. Admite valores entre -32.768 y 32.767.",
        "slug": "functions/conversion/smallint",
        "example": "select smallint('100') resultado;",
        "category": "conversion"
    },
    "time": {
        "description": "La función `time` convierte una expresión al tipo `time`, que almacena únicamente la parte horaria sin fecha.",
        "slug": "functions/conversion/time",
        "example": "select time('2025-06-15 14:30:00') resultado;",
        "category": "conversion"
    },
    "timestamp": {
        "description": "La función `timestamp` convierte una expresión al tipo `timestamp`, que almacena fecha y hora junto con el desplazamiento de zona horaria.",
        "slug": "functions/conversion/timestamp",
        "example": "select timestamp('2025-06-15 14:30:00') resultado;",
        "category": "conversion"
    },
    "tinyint": {
        "description": "La función `tinyint` convierte una expresión al tipo entero de 1 byte sin signo. Admite valores entre 0 y 255.",
        "slug": "functions/conversion/tinyint",
        "example": "select tinyint('200') resultado;",
        "category": "conversion"
    },
    "varchar": {
        "description": "La función `varchar` convierte una expresión a cadena de texto de longitud variable.",
        "slug": "functions/conversion/varchar",
        "example": "select varchar(42) resultado;",
        "category": "conversion"
    },
    "add_days": {
        "description": "La función `add_days` devuelve una nueva fecha que resulta de sumar un número determinado de días a una fecha dada. Si el número es negativo, se restan días.",
        "slug": "functions/fecha/add_days",
        "example": "select add_days('2025-01-01', 10) resultado;",
        "category": "dates"
    },
    "add_months": {
        "description": "La función `add_months` devuelve una nueva fecha que resulta de sumar un número determinado de meses a una fecha dada. Si el número es negativo, se restan meses.",
        "slug": "functions/fecha/add_months",
        "example": "select add_months('2025-01-31', 1) resultado;",
        "category": "dates"
    },
    "current_date": {
        "description": "La función `current_date` devuelve la fecha actual del sistema como un valor de tipo `date`.",
        "slug": "functions/fecha/current_date",
        "example": "select current_date resultado;",
        "category": "dates"
    },
    "current_datetime": {
        "description": "La función `current_datetime` devuelve la fecha y hora actuales del sistema como un valor de tipo `datetime`.",
        "slug": "functions/fecha/current_datetime",
        "example": "select current_datetime resultado;",
        "category": "dates"
    },
    "current_timestamp": {
        "description": "La función `current_timestamp` devuelve la fecha y hora actuales del sistema, incluyendo milisegundos, como un valor de tipo `datetime`.",
        "slug": "functions/fecha/current_timestamp",
        "example": "select current_timestamp resultado;",
        "category": "dates"
    },
    "current_year": {
        "description": "La función `current_year` devuelve el año actual del sistema como un valor numérico de cuatro dígitos.",
        "slug": "functions/fecha/current_year",
        "example": "select current_year resultado;",
        "category": "dates"
    },
    "day": {
        "description": "La función `day` devuelve un número entero entre 1 y 31 que representa el día del mes de una fecha.",
        "slug": "functions/fecha/day",
        "example": "select day('2025-06-15') resultado;",
        "category": "dates"
    },
    "day_name": {
        "description": "La función `day_name` devuelve el nombre del día de la semana correspondiente a una fecha como una cadena de texto.",
        "slug": "functions/fecha/day_name",
        "example": "select day_name('2025-01-01') resultado;",
        "category": "dates"
    },
    "day_of_week": {
        "description": "La función `day_of_week` devuelve el número del día de la semana correspondiente a una fecha como un valor entero.",
        "slug": "functions/fecha/day_of_week",
        "example": "select day_of_week('2025-01-01') resultado;",
        "category": "dates"
    },
    "days_ago": {
        "description": "La función `days_ago` devuelve el número de días transcurridos desde una fecha dada hasta hoy.",
        "slug": "functions/fecha/days_ago",
        "example": "select days_ago('2025-01-01') resultado;",
        "category": "dates"
    },
    "days_between": {
        "description": "La función `days_between` calcula el número de días entre dos fechas. El resultado puede ser positivo, negativo o cero.",
        "slug": "functions/fecha/days_between",
        "example": "select days_between('2025-01-01', '2025-12-31') resultado;",
        "category": "dates"
    },
    "from_julian_date": {
        "description": "La función `from_julian_date` convierte un número de fecha juliana a una fecha del calendario gregoriano.",
        "slug": "functions/fecha/from_julian_date",
        "example": "select from_julian_date(2460677) resultado;",
        "category": "dates"
    },
    "from_unixtime": {
        "description": "La función `from_unixtime` convierte un valor de marca de tiempo Unix (Unix timestamp) a una fecha y hora en formato `datetime`.",
        "slug": "functions/fecha/from_unixtime",
        "example": "select from_unixtime(1704067200) resultado;",
        "category": "dates"
    },
    "hour": {
        "description": "La función `hour` devuelve un número entero entre 0 y 23 que corresponde a la hora de un valor de tipo `datetime`.",
        "slug": "functions/fecha/hour",
        "example": "select hour('2025-06-15 14:30:00') resultado;",
        "category": "dates"
    },
    "iso_date": {
        "description": "La función `iso_date` convierte una fecha en una cadena de texto con formato ISO 8601: `YYYY-MM-DD`.",
        "slug": "functions/fecha/iso_date",
        "example": "select iso_date('20250101') resultado;",
        "category": "dates"
    },
    "iso_month": {
        "description": "La función `iso_month` convierte una fecha en una cadena de texto con formato `YYYY-MM`.",
        "slug": "functions/fecha/iso_month",
        "example": "select iso_month('2025-06-15') resultado;",
        "category": "dates"
    },
    "iso_week": {
        "description": "La función `iso_week` devuelve el número de semana ISO de una fecha determinada.",
        "slug": "functions/fecha/iso_week",
        "example": "select iso_week('2025-06-15') resultado;",
        "category": "dates"
    },
    "iso_week_year": {
        "description": "La función `iso_week_year` devuelve el año ISO de la semana a la que pertenece una fecha determinada.",
        "slug": "functions/fecha/iso_week_year",
        "example": "select iso_week_year('2022-01-01') anyo_iso, iso_week('2022-01-01') semana;",
        "category": "dates"
    },
    "julian_date": {
        "description": "La función `julian_date` convierte una fecha del calendario gregoriano a su equivalente en número de fecha juliana.",
        "slug": "functions/fecha/julian_date",
        "example": "select julian_date('2025-01-01') resultado;",
        "category": "dates"
    },
    "mmmyyyy": {
        "description": "La función `mmmyyyy` devuelve el nombre abreviado del mes seguido del año de una fecha como una cadena de texto.",
        "slug": "functions/fecha/mmmyyyy",
        "example": "select mmmyyyy('2025-06-15') resultado;",
        "category": "dates"
    },
    "month": {
        "description": "La función `month` devuelve un número entero entre 1 y 12 que representa el mes de una fecha.",
        "slug": "functions/fecha/month",
        "example": "select month('2025-06-15') resultado;",
        "category": "dates"
    },
    "month_name": {
        "description": "La función `month_name` devuelve el nombre completo del mes de una fecha como una cadena de texto.",
        "slug": "functions/fecha/month_name",
        "example": "select month_name('2025-06-15') resultado;",
        "category": "dates"
    },
    "month_year_name": {
        "description": "La función `month_year_name` devuelve el nombre completo del mes seguido del año de una fecha como una cadena de texto.",
        "slug": "functions/fecha/month_year_name",
        "example": "select month_year_name('2025-06-15') resultado;",
        "category": "dates"
    },
    "previous_day": {
        "description": "La función `previous_day` devuelve la fecha del día anterior a la fecha proporcionada.",
        "slug": "functions/fecha/previous_day",
        "example": "select previous_day('2025-03-01') resultado;",
        "category": "dates"
    },
    "quarter": {
        "description": "La función `quarter` devuelve un número entero entre 1 y 4 que representa el trimestre de una fecha.",
        "slug": "functions/fecha/quarter",
        "example": "select quarter('2025-06-15') resultado;",
        "category": "dates"
    },
    "today": {
        "description": "La función `today` devuelve la fecha actual del sistema como un valor de tipo `date`.",
        "slug": "functions/fecha/today",
        "example": "select today() resultado;",
        "category": "dates"
    },
    "tomorrow": {
        "description": "La función `tomorrow` devuelve la fecha de mañana como un valor de tipo `date`.",
        "slug": "functions/fecha/tomorrow",
        "example": "select tomorrow() resultado;",
        "category": "dates"
    },
    "year": {
        "description": "La función `year` devuelve un número entero que representa el año de una fecha.",
        "slug": "functions/fecha/year",
        "example": "select year('2025-06-15') resultado;",
        "category": "dates"
    },
    "yesterday": {
        "description": "La función `yesterday` devuelve la fecha de ayer como un valor de tipo `date`.",
        "slug": "functions/fecha/yesterday",
        "example": "select yesterday() resultado;",
        "category": "dates"
    },
    "yyyy": {
        "description": "La función `yyyy` devuelve el año de una fecha como una cadena de texto de 4 caracteres.",
        "slug": "functions/fecha/yyyy",
        "example": "select yyyy('2025-06-15') resultado;",
        "category": "dates"
    },
    "yyyymm": {
        "description": "La función `yyyymm` devuelve el año y el mes de una fecha como una cadena de texto de 6 caracteres en formato `YYYYMM`.",
        "slug": "functions/fecha/yyyymm",
        "example": "select yyyymm('2025-06-15') resultado;",
        "category": "dates"
    },
    "yyyymmdd": {
        "description": "La función `yyyymmdd` devuelve una fecha como una cadena de texto de 8 caracteres en formato `YYYYMMDD`.",
        "slug": "functions/fecha/yyyymmdd",
        "example": "select yyyymmdd('2025-06-15') resultado;",
        "category": "dates"
    },
    "current_catalog": {
        "description": "La función `current_catalog` devuelve el nombre de la base de datos actualmente en uso.",
        "slug": "functions/metadata/current_catalog",
        "example": "select current_catalog resultado;",
        "category": "metadata"
    },
    "current_user": {
        "description": "La función `current_user` devuelve el nombre del usuario de base de datos con el que se está ejecutando la sesión actual.",
        "slug": "functions/metadata/current_user",
        "example": "select current_user resultado;",
        "category": "metadata"
    },
    "session_user": {
        "description": "La función `session_user` devuelve el nombre del usuario de la sesión actual, tal como fue autenticado al conectarse.",
        "slug": "functions/metadata/session_user",
        "example": "select session_user resultado;",
        "category": "metadata"
    },
    "system_user": {
        "description": "La función `system_user` devuelve el nombre del inicio de sesión del sistema operativo con el que se está ejecutando la sesión actual.",
        "slug": "functions/metadata/system_user",
        "example": "select system_user resultado;",
        "category": "metadata"
    },
    "case": {
        "description": "La expresión `case` evalúa una serie de condiciones y devuelve el resultado asociado a la primera que se cumpla. Es la forma estándar de escribir lógica condicional en SQL y funciona en todos los motores.",
        "slug": "functions/nulos/case",
        "example": "select\n  orders.order_id,\n  customers.company_name,\n  sum(order_details.unit_price * order_details.quantity) importe,\n  case\n    when importe >= 5000 then 'Alto'\n    when importe >= 1000 then 'Medio'\n    else 'Bajo'\n  end tramo\nfrom staging.order_details\ninner join staging.orders using order_id\ninner join staging.customers using customer_id\ngroup by all;",
        "category": "nullsAndConditions"
    },
    "coalesce": {
        "description": "La función `coalesce` evalúa sus argumentos en orden y devuelve el primer valor que no sea `NULL`.",
        "slug": "functions/nulos/coalesce",
        "example": "select coalesce(null, null, 'tercero', 'cuarto') resultado;",
        "category": "nullsAndConditions"
    },
    "element_at": {
        "description": "La función `element_at` convierte un entero en una expresión seleccionándola de una lista según su posición. El índice comienza en 1.",
        "slug": "functions/nulos/element_at",
        "example": "select element_at(2, 'Alto', 'Medio', 'Bajo') resultado;",
        "category": "nullsAndConditions"
    },
    "empty_if_null": {
        "description": "La función `empty_if_null` devuelve una cadena vacía si la expresión de entrada es `NULL`. En cualquier otro caso devuelve la propia expresión de entrada.",
        "slug": "functions/nulos/empty_if_null",
        "example": "select customers.customer_id,\n  empty_if_null(customers.region) region\nfrom staging.customers;",
        "category": "nullsAndConditions"
    },
    "if": {
        "description": "La función `if` evalúa una condición y devuelve un valor si es verdadera u otro si es falsa. Funciona como el `IF` de Excel o como una expresión `CASE` simplificada.",
        "slug": "functions/nulos/if",
        "example": "select orders.order_id,\n  if(orders.freight > 100, 'Envío caro', 'Envío normal') tipo_envio\nfrom staging.orders;",
        "category": "nullsAndConditions"
    },
    "index_of": {
        "description": "La función `index_of` devuelve la posición de una expresión dentro de una lista de valores. El índice comienza en 1. Si la expresión no se encuentra en la lista, devuelve `NULL`.",
        "slug": "functions/nulos/index_of",
        "example": "select index_of('Medio', 'Alto', 'Medio', 'Bajo') resultado;",
        "category": "nullsAndConditions"
    },
    "null_if_empty": {
        "description": "La función `null_if_empty` devuelve `NULL` si la expresión de entrada es una cadena vacía. En cualquier otro caso devuelve la propia expresión de entrada.",
        "slug": "functions/nulos/null_if_empty",
        "example": "select null_if_empty('') resultado;",
        "category": "nullsAndConditions"
    },
    "null_if_zero": {
        "description": "La función `null_if_zero` devuelve `NULL` si la expresión de entrada es `0`. En cualquier otro caso devuelve la propia expresión de entrada.",
        "slug": "functions/nulos/null_if_zero",
        "example": "select null_if_zero(0) resultado;",
        "category": "nullsAndConditions"
    },
    "switch": {
        "description": "La función `switch` evalúa una expresión y devuelve el resultado asociado al primer valor que coincida. Es una forma compacta de escribir una expresión `CASE`.",
        "slug": "functions/nulos/switch",
        "example": "select switch(2, 1, 'Alto', 2, 'Medio', 3, 'Bajo', 'Desconocido') resultado;",
        "category": "nullsAndConditions"
    },
    "zero_if_null": {
        "description": "La función `zero_if_null` devuelve `0` si la expresión de entrada es `NULL`. En cualquier otro caso devuelve la propia expresión de entrada.",
        "slug": "functions/nulos/zero_if_null",
        "example": "select zero_if_null(null) resultado;",
        "category": "nullsAndConditions"
    },
    "addition": {
        "description": "La función `addition` devuelve la suma de varios valores, ignorando los nulos. Si todos los parámetros son nulos devuelve `NULL`.",
        "slug": "functions/numericas/addition",
        "example": "select addition(1, 2, null, 4) suma;",
        "category": "numeric"
    },
    "average": {
        "description": "La función `average` calcula el promedio de una lista de valores. Los valores nulos se ignoran en el cálculo.",
        "slug": "functions/numericas/average",
        "example": "select average(1, 2, 3, 4, 6.5) resultado;",
        "category": "numeric"
    },
    "ceil": {
        "description": "La función `ceil` redondea un número hacia arriba al entero más cercano.",
        "slug": "functions/numericas/ceil",
        "example": "select ceil(10.2) resultado;",
        "category": "numeric"
    },
    "count_values": {
        "description": "La función `count_values` devuelve el número de valores no nulos de una lista de expresiones.",
        "slug": "functions/numericas/count_values",
        "example": "select count_values(1, 2, 3, 4, 6.5) resultado;",
        "category": "numeric"
    },
    "divide": {
        "description": "La función `divide` devuelve el cociente de dos números. Si el divisor es `0` devuelve `NULL`.",
        "slug": "functions/numericas/divide",
        "example": "select divide(3, 2) resultado1;\nselect divide(3, 0) resultado2;",
        "category": "numeric"
    },
    "floor": {
        "description": "La función `floor` redondea un número hacia abajo al entero más cercano.",
        "slug": "functions/numericas/floor",
        "example": "select floor(10.9) resultado;",
        "category": "numeric"
    },
    "greatest": {
        "description": "La función `greatest` devuelve el valor máximo entre una lista de expresiones de un mismo registro. Si todos los parámetros son nulos devuelve `NULL`.",
        "slug": "functions/numericas/greatest",
        "example": "select greatest(1, 5, 3, 2) resultado;",
        "category": "numeric"
    },
    "least": {
        "description": "La función `least` devuelve el valor mínimo entre una lista de expresiones de un mismo registro. Si todos los parámetros son nulos devuelve `NULL`.",
        "slug": "functions/numericas/least",
        "example": "select least(1, 5, 3, 2) resultado;",
        "category": "numeric"
    },
    "margin": {
        "description": "La función `margin` calcula el margen de venta a partir del importe de venta y el coste. El resultado es un valor porcentual: el margen absoluto dividido entre las ventas.",
        "slug": "functions/numericas/margin",
        "example": "select margin(100, 70) margen;",
        "category": "numeric"
    },
    "markup": {
        "description": "La función `markup` calcula el markup de venta a partir del importe de venta y el coste. El resultado es un valor porcentual: el margen absoluto dividido entre el coste.",
        "slug": "functions/numericas/markup",
        "example": "select markup(100, 70) markup;",
        "category": "numeric"
    },
    "mod": {
        "description": "La función `mod` devuelve el resto de la división entera de dos números.",
        "slug": "functions/numericas/mod",
        "example": "select mod(10, 4) resultado;",
        "category": "numeric"
    },
    "pct_variance": {
        "description": "La función `pct_variance` calcula la variación porcentual entre un valor base y un valor de comparación. El resultado es `(comparacion - base) / base`. Si el valor base es `0` devuelve `NULL`.",
        "slug": "functions/numericas/pct_variance",
        "example": "select pct_variance(10, 7) resultado;",
        "category": "numeric"
    },
    "round": {
        "description": "La función `round` redondea un número al número de decimales especificado. Si no se especifica el segundo parámetro, redondea al entero más cercano.",
        "slug": "functions/numericas/round",
        "example": "select round(10.222222, 2) resultado;",
        "category": "numeric"
    },
    "substraction": {
        "description": "La función `substraction` resta del primer argumento el resto de argumentos. Los valores nulos se tratan como cero. Si todos los parámetros son nulos devuelve `NULL`.",
        "slug": "functions/numericas/substraction",
        "example": "select substraction(10, 3, null, 2) resultado;",
        "category": "numeric"
    },
    "abc": {
        "description": "La función `abc` traduce los números del 1 al 26 en las letras del abecedario, de la A a la Z. Es decir, convierte el 1 en una A, el 2 en una B, etc.",
        "slug": "functions/texto/abc",
        "example": "select abc(11) letra;",
        "category": "text"
    },
    "char": {
        "description": "La función `char` devuelve el carácter correspondiente al código ASCII especificado.",
        "slug": "functions/texto/char",
        "example": "select char(65) letra;",
        "category": "text"
    },
    "concat": {
        "description": "La función `concat` concatena dos o más cadenas de texto en una sola.",
        "slug": "functions/texto/concat",
        "example": "select concat('Hello', ' ', 'World!') resultado;",
        "category": "text"
    },
    "hash": {
        "description": "La función `hash` genera una huella digital a partir de uno o más valores de cualquier tipo. Devuelve una cadena hexadecimal. Es útil para detectar si un conjunto de campos ha cambiado entre dos registros, por ejemplo para comparar claves compuestas en un join.",
        "slug": "functions/texto/hash",
        "example": "select hash('hola', 5, current_date) resultado;",
        "category": "text"
    },
    "hex": {
        "description": "La función `hex` convierte una cadena de texto en su representación hexadecimal.",
        "slug": "functions/texto/hex",
        "example": "select hex('hola') resultado;",
        "category": "text"
    },
    "left": {
        "description": "La función `left` devuelve el número especificado de caracteres iniciales de una cadena de texto.",
        "slug": "functions/texto/left",
        "example": "select left('Hello World!', 5) resultado;",
        "category": "text"
    },
    "length": {
        "description": "La función `length` devuelve el número de caracteres de una cadena de texto.",
        "slug": "functions/texto/length",
        "example": "select length('Hello World!') resultado;",
        "category": "text"
    },
    "lpad": {
        "description": "La función `lpad` rellena una cadena de texto por la izquierda con un carácter dado hasta alcanzar la longitud indicada. Si la cadena original ya tiene esa longitud o la supera, se devuelve truncada por la derecha. El tercer parámetro es opcional; si se omite, se usa el espacio en blanco como carácter de relleno.",
        "slug": "functions/texto/lpad",
        "example": "select lpad('42', 6, '0') resultado;",
        "category": "text"
    },
    "right": {
        "description": "La función `right` devuelve el número especificado de caracteres finales de una cadena de texto.",
        "slug": "functions/texto/right",
        "example": "select right('Hello World!', 6) resultado;",
        "category": "text"
    },
    "rpad": {
        "description": "La función `rpad` rellena una cadena de texto por la derecha con un carácter dado hasta alcanzar la longitud indicada. Si la cadena original ya tiene esa longitud o la supera, se devuelve truncada por la derecha. El tercer parámetro es opcional; si se omite, se usa el espacio en blanco como carácter de relleno.",
        "slug": "functions/texto/rpad",
        "example": "select rpad('42', 6, '0') resultado;",
        "category": "text"
    },
    "slice": {
        "description": "La función `slice` devuelve una subcadena a partir de una posición de inicio y, opcionalmente, una posición de fin. Se comporta como el método `slice` de JavaScript: los índices son base 0 y los valores negativos cuentan desde el final de la cadena.",
        "slug": "functions/texto/slice",
        "example": "select slice('Hello World!', 6) resultado;",
        "category": "text"
    },
    "slugify": {
        "description": "La función `slugify` convierte una cadena de texto en un slug: elimina acentos, convierte a minúsculas y sustituye los espacios y caracteres especiales por guiones.",
        "slug": "functions/texto/slugify",
        "example": "select slugify('Ángel García López') resultado;",
        "category": "text"
    },
    "split_part": {
        "description": "La función `split_part` divide una cadena de texto usando un separador y devuelve el elemento en la posición indicada. El índice comienza en 1.",
        "slug": "functions/texto/split_part",
        "example": "select split_part('hola mundo crono', ' ', 2) resultado;",
        "category": "text"
    },
    "substring": {
        "description": "La función `substring` devuelve una subcadena a partir de una posición de inicio y una longitud opcional. Los índices son base 1: el primer carácter de la cadena tiene posición 1.",
        "slug": "functions/texto/substring",
        "example": "select substring('Hello World!', 7) resultado;",
        "category": "text"
    },
    "trim": {
        "description": "La función `trim` elimina los espacios al inicio y al final de una cadena de texto.",
        "slug": "functions/texto/trim",
        "example": "select trim('   Hello World!   ') resultado;",
        "category": "text"
    }
};
// Lista canónica y completa de nombres de función (superset docs + legacy).
export const CRONO_FUNCTION_NAMES: string[] = [
    "abc",
    "add_days",
    "add_months",
    "addition",
    "average",
    "avg",
    "avgif",
    "bigint",
    "boolean",
    "case",
    "ceil",
    "char",
    "coalesce",
    "concat",
    "count",
    "count_distinct",
    "count_values",
    "countif",
    "current_catalog",
    "current_date",
    "current_datetime",
    "current_timestamp",
    "current_user",
    "current_year",
    "date",
    "datetime",
    "day",
    "day_name",
    "day_of_week",
    "days_ago",
    "days_between",
    "decile",
    "dense_rank",
    "divide",
    "element_at",
    "empty_if_null",
    "end_date",
    "end_datetime",
    "first_value",
    "float",
    "floor",
    "from_julian_date",
    "from_unixtime",
    "greatest",
    "hash",
    "hex",
    "hour",
    "if",
    "index_of",
    "int",
    "is_first",
    "is_last",
    "iso_date",
    "iso_month",
    "iso_week",
    "iso_week_year",
    "julian_date",
    "lag",
    "last_value",
    "lead",
    "least",
    "left",
    "length",
    "lpad",
    "margin",
    "markup",
    "max",
    "maxif",
    "min",
    "minif",
    "mmmyyyy",
    "mod",
    "month",
    "month_name",
    "month_year_name",
    "next_value",
    "null_if_empty",
    "null_if_zero",
    "pct",
    "pct_rank",
    "pct_variance",
    "percentile",
    "previous_day",
    "previous_value",
    "quantile",
    "quarter",
    "quartile",
    "rank",
    "real",
    "right",
    "round",
    "row_number",
    "rpad",
    "running_pct",
    "running_sum",
    "session_user",
    "slice",
    "slugify",
    "smallint",
    "split_part",
    "substraction",
    "substring",
    "sum",
    "sumif",
    "switch",
    "system_user",
    "time",
    "timestamp",
    "tinyint",
    "today",
    "tomorrow",
    "trim",
    "varchar",
    "year",
    "yesterday",
    "yyyy",
    "yyyymm",
    "yyyymmdd",
    "zero_if_null"
];
export const CRONO_FUNCTION_CATEGORIES: Record<string, string> = {
    "avg": "aggregation",
    "avgif": "aggregation",
    "count": "aggregation",
    "count_distinct": "aggregation",
    "countif": "aggregation",
    "decile": "aggregation",
    "dense_rank": "aggregation",
    "end_date": "aggregation",
    "end_datetime": "aggregation",
    "first_value": "aggregation",
    "is_first": "aggregation",
    "is_last": "aggregation",
    "lag": "aggregation",
    "last_value": "aggregation",
    "lead": "aggregation",
    "max": "aggregation",
    "maxif": "aggregation",
    "min": "aggregation",
    "minif": "aggregation",
    "next_value": "aggregation",
    "pct": "aggregation",
    "pct_rank": "aggregation",
    "percentile": "aggregation",
    "previous_value": "aggregation",
    "quantile": "aggregation",
    "quartile": "aggregation",
    "rank": "aggregation",
    "row_number": "aggregation",
    "running_pct": "aggregation",
    "running_sum": "aggregation",
    "sum": "aggregation",
    "sumif": "aggregation",
    "bigint": "conversion",
    "boolean": "conversion",
    "date": "conversion",
    "datetime": "conversion",
    "float": "conversion",
    "int": "conversion",
    "real": "conversion",
    "smallint": "conversion",
    "time": "conversion",
    "timestamp": "conversion",
    "tinyint": "conversion",
    "varchar": "conversion",
    "add_days": "dates",
    "add_months": "dates",
    "current_date": "dates",
    "current_datetime": "dates",
    "current_timestamp": "dates",
    "current_year": "dates",
    "day": "dates",
    "day_name": "dates",
    "day_of_week": "dates",
    "days_ago": "dates",
    "days_between": "dates",
    "from_julian_date": "dates",
    "from_unixtime": "dates",
    "hour": "dates",
    "iso_date": "dates",
    "iso_month": "dates",
    "iso_week": "dates",
    "iso_week_year": "dates",
    "julian_date": "dates",
    "mmmyyyy": "dates",
    "month": "dates",
    "month_name": "dates",
    "month_year_name": "dates",
    "previous_day": "dates",
    "quarter": "dates",
    "today": "dates",
    "tomorrow": "dates",
    "year": "dates",
    "yesterday": "dates",
    "yyyy": "dates",
    "yyyymm": "dates",
    "yyyymmdd": "dates",
    "current_catalog": "metadata",
    "current_user": "metadata",
    "session_user": "metadata",
    "system_user": "metadata",
    "case": "nullsAndConditions",
    "coalesce": "nullsAndConditions",
    "element_at": "nullsAndConditions",
    "empty_if_null": "nullsAndConditions",
    "if": "nullsAndConditions",
    "index_of": "nullsAndConditions",
    "null_if_empty": "nullsAndConditions",
    "null_if_zero": "nullsAndConditions",
    "switch": "nullsAndConditions",
    "zero_if_null": "nullsAndConditions",
    "addition": "numeric",
    "average": "numeric",
    "ceil": "numeric",
    "count_values": "numeric",
    "divide": "numeric",
    "floor": "numeric",
    "greatest": "numeric",
    "least": "numeric",
    "margin": "numeric",
    "markup": "numeric",
    "mod": "numeric",
    "pct_variance": "numeric",
    "round": "numeric",
    "substraction": "numeric",
    "abc": "text",
    "char": "text",
    "concat": "text",
    "hash": "text",
    "hex": "text",
    "left": "text",
    "length": "text",
    "lpad": "text",
    "right": "text",
    "rpad": "text",
    "slice": "text",
    "slugify": "text",
    "split_part": "text",
    "substring": "text",
    "trim": "text"
};
