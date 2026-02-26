<template>
  <div class="wrap">
    <header class="header">
      <h1>ДДНФ для f(X,Y,Z) · Система контролю якості</h1>
      <p class="sub">f=1 → ВІДХИЛИТИ, f=0 → СХВАЛИТИ. Порядок наборів: XYZ = 000..111 (X — старший біт).</p>
    </header>

    <section class="card">
      <h2>Змінні (сценарій)</h2>
      <div class="grid3">
        <div class="box">
          <div class="k mono">X (4-й біт)</div>
          <div class="v">Критичний дефект</div>
          <div class="d">Виявлено дефект, що впливає на безпеку або функціональність.</div>
        </div>
        <div class="box">
          <div class="k mono">Y (2-й біт)</div>
          <div class="v">Проблема з естетикою</div>
          <div class="d">Наявні незначні подряпини або нерівності покриття.</div>
        </div>
        <div class="box">
          <div class="k mono">Z (1-й біт)</div>
          <div class="v">Тест пройдено</div>
          <div class="d">Продукт успішно пройшов тестування.</div>
        </div>
      </div>
    </section>

    <section class="card">
      <div class="row space">
        <h2>Вхідні дані</h2>
        <button class="btn" @click="setDefault">Підставити приклад 10111001</button>
      </div>

      <div class="row">
        <label class="label">Вектор f (8 біт)</label>
        <input class="input mono" v-model="bits" placeholder="Напр.: 10111001" maxlength="8" />
        <span class="hint mono">довжина: {{ bits.trim().length }}</span>
      </div>

      <p v-if="error" class="err">{{ error }}</p>

      <div class="grid2" v-if="!error">
        <div class="box2">
          <div class="label">Комбінації (X,Y,Z), де f = 1 (ВІДХИЛИТИ)</div>
          <div class="mono">{{ onesTriplesText || "-" }}</div>
        </div>

        <div class="box2">
          <div class="label">ДДНФ</div>
          <div class="mono ddnf">{{ ddnfText }}</div>
        </div>

        <div class="box2">
          <div class="label">Логічне правило (людською мовою)</div>
          <ul class="list">
            <li v-for="r in onesRows" :key="r.idx">
              Якщо X={{ r.x }}, Y={{ r.y }}, Z={{ r.z }} → <b>ВІДХИЛИТИ</b>
            </li>
            <li>Інакше → <b>СХВАЛИТИ</b></li>
          </ul>
        </div>

      </div>
    </section>

    <section class="card" v-if="!error">
      <h2>Таблиця істинності</h2>
      <table class="table">
        <thead>
          <tr>
            <th>#</th>
            <th>X</th>
            <th>Y</th>
            <th>Z</th>
            <th>f</th>
            <th>Рішення</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in rows" :key="r.idx">
            <td class="mono">{{ r.idx }}</td>
            <td class="mono">{{ r.x }}</td>
            <td class="mono">{{ r.y }}</td>
            <td class="mono">{{ r.z }}</td>
            <td class="mono" :class="r.f===1 ? 'one' : 'zero'">{{ r.f }}</td>
            <td :class="r.f===1 ? 'rej' : 'ok'">{{ r.f===1 ? 'ВІДХИЛИТИ' : 'СХВАЛИТИ' }}</td>
          </tr>
        </tbody>
      </table>

      <p class="note mono">Набори: 000,001,010,011,100,101,110,111</p>
    </section>

  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

type Bit = 0 | 1;
type Row = { idx: number; x: Bit; y: Bit; z: Bit; f: Bit };

const bits = ref("10111001");

const combos: Array<[Bit,Bit,Bit]> = [
  [0,0,0],[0,0,1],[0,1,0],[0,1,1],
  [1,0,0],[1,0,1],[1,1,0],[1,1,1]
];

const normalized = computed(() => bits.value.trim());

const error = computed(() => {
  const s = normalized.value;
  if (s.length !== 8) return "Помилка: вектор f має містити рівно 8 символів (0 або 1).";
  if (!/^[01]{8}$/.test(s)) return "Помилка: дозволені лише символи 0 та 1.";
  return "";
});

const rows = computed<Row[]>(() => {
  if (error.value) return [];
  const s = normalized.value;
  return combos.map((t, idx) => {
    const [x,y,z] = t;
    const f: Bit = s[idx] === "1" ? 1 : 0;
    return { idx, x, y, z, f };
  });
});

const onesRows = computed(() => rows.value.filter(r => r.f === 1));

const onesTriplesText = computed(() =>
  onesRows.value.map(r => `(${r.x},${r.y},${r.z})`).join(", ")
);

const term = (r: Row) => {
  const a = r.x === 1 ? "X" : "¬X";
  const b = r.y === 1 ? "Y" : "¬Y";
  const c = r.z === 1 ? "Z" : "¬Z";
  return `(${a} ∧ ${b} ∧ ${c})`;
};

const ddnfText = computed(() => {
  if (error.value) return "";
  if (onesRows.value.length === 0) return "f(X,Y,Z) = 0";
  if (onesRows.value.length === 8) return "f(X,Y,Z) = 1";
  return `f(X,Y,Z) = ${onesRows.value.map(term).join(" ∨ ")}`;
});

const setDefault = () => {
  bits.value = "10111001";
};
</script>

<style scoped>
.wrap{max-width:1100px;margin:0 auto;padding:24px;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#111}
.header{margin-bottom:16px}
h1{margin:0 0 6px 0;font-size:28px}
.sub{margin:0;color:#555}
.card{border:1px solid #e5e7eb;border-radius:14px;padding:16px;margin:16px 0;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.04)}
.row{display:flex;gap:12px;align-items:center;flex-wrap:wrap}
.row.space{justify-content:space-between}
.label{font-size:13px;color:#555;min-width:130px}
.hint{color:#6b7280}
.input{padding:10px 12px;border-radius:10px;border:1px solid #d1d5db;font-size:16px;min-width:240px}
.btn{padding:10px 12px;border-radius:10px;border:1px solid #d1d5db;background:#fff;cursor:pointer;font-size:14px}
.btn:hover{background:#f9fafb}
.mono{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}
.grid3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:10px}
.grid2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:14px}
.box,.box2{border:1px solid #eef2f7;border-radius:12px;padding:12px;background:#fafafa}
.k{font-weight:700}
.v{font-weight:600;margin-top:6px}
.d{color:#555;margin-top:6px;font-size:13px;line-height:1.35}
.ddnf{white-space:pre-wrap;word-break:break-word}
.list{margin:8px 0 0 18px}
.err{margin-top:10px;color:#b91c1c;font-weight:700}
.table{width:100%;border-collapse:separate;border-spacing:0;margin-top:10px;overflow:hidden;border:1px solid #e5e7eb;border-radius:12px}
.table th,.table td{padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:center}
.table thead th{background:#f3f4f6;font-weight:600}
.table tbody tr:last-child td{border-bottom:none}
.zero{color:#b91c1c;font-weight:800}
.one{color:#065f46;font-weight:800}
.rej{color:#b91c1c;font-weight:700}
.ok{color:#065f46;font-weight:700}
.note{margin:10px 0 0 0;color:#555;font-size:13px}
.footer{margin-top:10px;color:#666;font-size:12px}
@media (max-width:980px){.grid3{grid-template-columns:1fr}.grid2{grid-template-columns:1fr}}
</style>
