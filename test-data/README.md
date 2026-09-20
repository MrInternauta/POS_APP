# Product import fixtures

Files for the **Import CSV** button on the products tab (`/tabs/tab2`, admin only). Each one
covers a different path of the importer and says what the summary should say, so a run that
answers something else is a regression.

The importer matches on `code`: a code already in the table is updated, one that is not there is
created. Headers are read without case, accents or punctuation, and several spellings are
accepted per column (`codigo`/`code`/`barcode`, `producto`/`nombre`/`name`,
`existencias`/`stock`/`cantidad`/`inventario`, `precio de venta`/`precio`, `precio de
compra`/`costo`, `descripcion`). The delimiter is detected per file.

| File | What it covers | Expected summary |
| --- | --- | --- |
| `productos-nuevos.csv` | Six codes that are not in the catalogue, comma separated, every column filled | 6 total, **6 created** |
| `actualizar-inventario.csv` | Eight codes that are already there, only code, name and stock | 8 total, **8 updated** |
| `casos-limite.csv` | Formats and rows that should fail, semicolon separated | 5 total, **2 created, 1 updated, 2 failed** |

## productos-nuevos.csv

Run it twice: the second run answers **6 updated** rather than 6 created, which is the whole point
of matching on the code. The codes start at `7790000000011` and belong to no real product, so they
are safe to leave in a development catalogue and easy to find and delete afterwards.

## actualizar-inventario.csv

Restocks eight products that the development catalogue currently holds at zero or one unit. It carries no prices on purpose: a
column that is not in the file is left alone, so the purchase and selling prices have to come out
of the run unchanged. Six of the eight sit at stock 0, so the products tab should stop showing
them as out of stock once it is imported.

## casos-limite.csv

One row per thing that can go wrong:

| Row | What it is | What should happen |
| --- | --- | --- |
| 2 | Quoted name with a comma in it, `1.500` units, `$12,50` cost, `$1.234,50` price, a description with a comma and escaped quotes | Created with stock 1500, price 13 and selling price 1235 |
| 3 | Every value wrapped in single quotes | Created, quotes stripped |
| 4 | No code | Failed, "The row has no code" |
| 5 | No name | Failed, "The row has no name" |
| 6 | Blank line | Skipped, not counted in the total |
| 7 | Existing code with only a stock | Updated, prices untouched |

The prices round because the columns are integers: `$12,50` lands as 13 and `$1.234,50` as 1235.
That is the importer working as written, not a bug, but it is the reason a shop that sells in
cents cannot use this file as it stands.
