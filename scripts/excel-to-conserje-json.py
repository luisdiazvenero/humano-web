#!/usr/bin/env python3
"""
Convert SOURCE OF TRUTH.xlsx to JSON for the conserje assistant.
Usage:
  python3 scripts/excel-to-conserje-json.py /path/to/SOURCE\ OF\ TRUTH.xlsx
"""

import json
import sys
import zipfile
import xml.etree.ElementTree as ET

SHEETS = [
    "Habitaciones",
    "Servicios",
    "Instalaciones",
    "Recomendaciones_Locales",
    "Reglas_de_Gobierno",
]

ARRAY_FIELDS = {
    "intenciones",
    "perfil_ideal",
    "restricciones_requisitos",
    "condiciones_servicio",
    "imagenes_url",
    "frases_sugeridas",
    "ctas",
}


def _col_index(cell_ref: str) -> int:
    letters = ""
    for ch in cell_ref:
        if ch.isalpha():
            letters += ch
        else:
            break
    idx = 0
    for ch in letters:
        idx = idx * 26 + (ord(ch.upper()) - ord("A") + 1)
    return idx - 1


def _read_shared_strings(zf: zipfile.ZipFile) -> list[str]:
    try:
        xml = zf.read("xl/sharedStrings.xml")
    except KeyError:
        return []
    root = ET.fromstring(xml)
    ns = {"ns": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
    shared = []
    for si in root.findall("ns:si", ns):
        texts = [t.text or "" for t in si.findall(".//ns:t", ns)]
        shared.append("".join(texts))
    return shared


def _sheet_name_to_target(zf: zipfile.ZipFile) -> dict[str, str]:
    wb_xml = zf.read("xl/workbook.xml")
    root = ET.fromstring(wb_xml)
    ns = {"ns": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
    name_to_rid = {
        s.attrib["name"]: s.attrib[
            "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id"
        ]
        for s in root.findall("ns:sheets/ns:sheet", ns)
    }

    rels_xml = zf.read("xl/_rels/workbook.xml.rels")
    rels = ET.fromstring(rels_xml)
    nsr = {"r": "http://schemas.openxmlformats.org/package/2006/relationships"}
    rel_map = {r.attrib["Id"]: r.attrib["Target"] for r in rels.findall("r:Relationship", nsr)}

    name_to_target = {}
    for name, rid in name_to_rid.items():
        target = rel_map[rid]
        if not target.startswith("xl/"):
            target = "xl/" + target
        name_to_target[name] = target
    return name_to_target


def _cell_value(cell: ET.Element, shared: list[str]) -> str:
    ns = {"ns": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
    v = cell.find("ns:v", ns)
    if v is not None:
        if cell.attrib.get("t") == "s":
            try:
                return shared[int(v.text)]
            except Exception:
                return ""
        return v.text or ""
    # inlineStr
    is_node = cell.find("ns:is", ns)
    if is_node is not None:
        t = is_node.find("ns:t", ns)
        if t is not None and t.text:
            return t.text
    return ""


def _read_sheet_rows(zf: zipfile.ZipFile, target: str, shared: list[str]) -> list[list[str]]:
    sheet_xml = zf.read(target)
    root = ET.fromstring(sheet_xml)
    ns = {"ns": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}

    rows = []
    for row in root.findall(".//ns:sheetData/ns:row", ns):
        cells = {}
        max_col = -1
        for c in row.findall("ns:c", ns):
            ref = c.attrib.get("r", "")
            if not ref:
                continue
            col_idx = _col_index(ref)
            max_col = max(max_col, col_idx)
            cells[col_idx] = _cell_value(c, shared)
        if max_col == -1:
            rows.append([])
            continue
        row_vals = [""] * (max_col + 1)
        for idx, val in cells.items():
            row_vals[idx] = val
        rows.append(row_vals)
    return rows


def _split_array(value: str) -> list[str]:
    parts = [p.strip() for p in value.split("|")]
    return [p for p in parts if p]


def _normalize_row(row: dict) -> dict:
    out = {}
    for k, v in row.items():
        if k in ARRAY_FIELDS:
            out[k] = _split_array(v) if v else []
        elif k in {"horario_apertura", "horario_cierre"}:
            out[k] = v if v else None
        else:
            out[k] = v if v else ""
    return out


def main() -> int:
    if len(sys.argv) < 2:
        print("Usage: python3 scripts/excel-to-conserje-json.py /path/to/SOURCE OF TRUTH.xlsx")
        return 1

    xlsx_path = sys.argv[1]
    with zipfile.ZipFile(xlsx_path) as zf:
        shared = _read_shared_strings(zf)
        name_to_target = _sheet_name_to_target(zf)

        data_items = []
        reglas = []

        for sheet in SHEETS:
            target = name_to_target.get(sheet)
            if not target:
                continue
            rows = _read_sheet_rows(zf, target, shared)
            if not rows:
                continue
            headers = rows[0]
            headers = [h.strip() if isinstance(h, str) else "" for h in headers]

            for row in rows[1:]:
                if not row or all((not str(v).strip()) for v in row):
                    continue
                row_dict = {}
                for idx, header in enumerate(headers):
                    if not header:
                        continue
                    row_dict[header] = row[idx] if idx < len(row) else ""

                if sheet == "Reglas_de_Gobierno":
                    regla_id = row_dict.get("regla_id", "")
                    regla_clave = row_dict.get("regla_clave", "")
                    descripcion = row_dict.get("descripcion_practica", "")
                    if regla_id or regla_clave or descripcion:
                        reglas.append({
                            "regla_id": regla_id,
                            "regla_clave": regla_clave,
                            "descripcion_practica": descripcion,
                        })
                    continue

                normalized = _normalize_row(row_dict)
                normalized["tipo"] = sheet
                data_items.append(normalized)

    output = {
        "items": data_items,
        "reglas": reglas,
    }

    with open("src/data/conserje.json", "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"Wrote {len(data_items)} items and {len(reglas)} reglas to src/data/conserje.json")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
