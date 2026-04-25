# Paraná — Testing dataset

## Qué contiene

| Fixture | Cantidad | Descripción |
|---------|----------|-------------|
| `tenant` | 1 | Test PyME SA, plan pro |
| `user` | 1 | admin@testpyme.com / test1234 |
| `customers` | 8 | Perfiles variados: grande B2B, sin CUIT, con deuda |
| `products` | 20 | EPDM/silicona/NBR/neopreno; 3 con stock crítico, 1 sin stock |
| `invoices` | 30 | Draft/issued/paid/overdue; distintos tipos A/B/C |
| `production_orders` | 8 | En 5 estados distintos de las 6 etapas |
| `whatsapp_conversations` | 5 | Open/closed/human; con IA y manual |

## Setup

```bash
cd backend
pip install -r requirements.txt pytest pytest-asyncio --break-system-packages
```

## Correr tests

```bash
# Todos los tests (SQLite en memoria, sin Postgres)
pytest backend/tests/ -v

# Solo el dataset
pytest backend/tests/test_dataset.py -v

# Contra Postgres real
TEST_DATABASE_URL=postgresql+psycopg://parana:parana@localhost:5432/parana_test \
  pytest backend/tests/ -v

# Un test específico
pytest backend/tests/test_dataset.py::test_dashboard_stats -v

# Con output de prints
pytest backend/tests/ -v -s
```

## Acceder a los datos en código

```python
# Usando el fixture full_dataset
def test_algo(client, auth_headers, full_dataset):
    data = full_dataset
    print(data["customers"][0].name)   # "Paladini SA"
    print(data["products"][4].sku)     # "BUR-SIL-40" (stock crítico)
    print(data["invoices"][2].status)  # "overdue"

# Usando fixtures individuales
def test_clientes(client, auth_headers, customers):
    r = client.get("/api/v1/customers", headers=auth_headers)
    assert len(r.json()) == 8
```

## Casos borde incluidos

- Cliente sin CUIT ni email (`Cliente Ocasional SN`)
- Producto sin precio ni material (`PROTOTIPO EN DESARROLLO`)
- Producto sin stock (`PER-U-12`)
- Factura tipo C (monotributista)
- Conversación WhatsApp derivada a humano (Comasa)
- Orden de producción terminada completamente (Sello Disc, Burlete Silicona)
- Pago que marca factura como `paid`
- Emisión de factura ya emitida → 400
