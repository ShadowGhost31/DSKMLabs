<template>
  <div class="wrap">
    <header class="header">
      <h1>Булеві функції f(x,y,z)</h1>
      <p class="sub">Таблиця істинності · Вектор значень · Порядковий номер · Набори, на яких f = 1</p>
    </header>

    <section class="card">
      <div class="row">
        <label class="label">Вибір формули</label>
        <select class="select" v-model="selectedKey">
          <option v-for="opt in options" :key="opt.key" :value="opt.key">{{ opt.title }}</option>
        </select>
      </div>

      <div class="formula">
        <div class="label">Формула</div>
        <div class="mono">{{ current.formulaText }}</div>
      </div>

      <div class="grid">
        <div class="box">
          <div class="label">Вектор значень (000…111)</div>
          <div class="mono big">{{ vectorString }}</div>
        </div>
        <div class="box">
          <div class="label">Порядковий номер</div>
          <div class="mono big">{{ ordinalNumber }}</div>
        </div>
        <div class="box">
          <div class="label">Номери наборів, де f = 1 (0…7)</div>
          <div class="mono">{{ ones0.join(", ") }}</div>
        </div>
        <div class="box">
          <div class="label">Номери наборів, де f = 1 (1…8)</div>
          <div class="mono">{{ ones1.join(", ") }}</div>
        </div>
      </div>
    </section>

    <section class="card">
      <div class="row space">
        <h2>Таблиця істинності</h2>
      </div>

      <table class="table">
        <thead>
          <tr>
            <th>#</th>
            <th>x</th>
            <th>y</th>
            <th>z</th>
            <th>f</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in rows" :key="r.idx">
            <td class="mono">{{ r.idx }}</td>
            <td class="mono">{{ r.x }}</td>
            <td class="mono">{{ r.y }}</td>
            <td class="mono">{{ r.z }}</td>
            <td class="mono" :class="{ zero: r.f === 0, one: r.f === 1 }">{{ r.f }}</td>
          </tr>
        </tbody>
      </table>

      <p class="note">
        Порядок наборів: 000, 001, 010, 011, 100, 101, 110, 111 (x — старший біт, z — молодший).
      </p>
    </section>

    <footer class="footer">
      <div class="mono"></div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

type Row = { idx: number; x: 0 | 1; y: 0 | 1; z: 0 | 1; f: 0 | 1 };

type FormulaKey = "f1" | "f2";

type Option = {
  key: FormulaKey;
  title: string;
  formulaText: string;
  evalFn: (x: 0 | 1, y: 0 | 1, z: 0 | 1) => 0 | 1;
};

const imp = (a: 0 | 1, b: 0 | 1): 0 | 1 => ((a === 1 && b === 0) ? 0 : 1);

const options: Option[] = [
  {
    key: "f1",
    title: "Формула 1",
    formulaText: "f(x,y,z) = (x ∧ ¬(z ∧ y)) ∨ (¬y ∨ ¬x)",
    evalFn: (x, y, z) => {
      const zy: 0 | 1 = (z === 1 && y === 1) ? 1 : 0;
      const notZy: 0 | 1 = zy === 1 ? 0 : 1;
      const left: 0 | 1 = (x === 1 && notZy === 1) ? 1 : 0;
      const notY: 0 | 1 = y === 1 ? 0 : 1;
      const notX: 0 | 1 = x === 1 ? 0 : 1;
      const right: 0 | 1 = (notY === 1 || notX === 1) ? 1 : 0;
      return (left === 1 || right === 1) ? 1 : 0;
    }
  },
  {
    key: "f2",
    title: "Формула 2",
    formulaText: "f = ((x → (y ∨ z)) → ((x → y) → (x → z)))",
    evalFn: (x, y, z) => {
      const yOrZ: 0 | 1 = (y === 1 || z === 1) ? 1 : 0;
      const a: 0 | 1 = imp(x, yOrZ);
      const b: 0 | 1 = imp(x, y);
      const c: 0 | 1 = imp(x, z);
      const bc: 0 | 1 = imp(b, c);
      return imp(a, bc);
    }
  }
];

const selectedKey = ref<FormulaKey>("f1");

const current = computed(() => options.find(o => o.key === selectedKey.value) ?? options[0]);

const rows = computed<Row[]>(() => {
  const out: Row[] = [];
  const ev = current.value.evalFn;
  const combos: Array<[0|1,0|1,0|1]> = [
    [0,0,0],[0,0,1],[0,1,0],[0,1,1],
    [1,0,0],[1,0,1],[1,1,0],[1,1,1]
  ];
  combos.forEach((t, idx) => {
    const [x, y, z] = t;
    out.push({ idx, x, y, z, f: ev(x, y, z) });
  });
  return out;
});

const vector = computed(() => rows.value.map(r => r.f));
const vectorString = computed(() => vector.value.join(""));

const ordinalNumber = computed(() => {
  const bits = vector.value.join("");
  return parseInt(bits, 2);
});

const ones0 = computed(() => rows.value.filter(r => r.f === 1).map(r => r.idx));
const ones1 = computed(() => ones0.value.map(n => n + 1));

const copyResults = async () => {
  const header = `Формула: ${current.value.formulaText}`;
  const tableLines = ["x y z | f", ...rows.value.map(r => `${r.x} ${r.y} ${r.z} | ${r.f}`)];
  const text = [
    header,
    "",
    ...tableLines,
    "",
    `Вектор значень: ${vectorString.value}`,
    `Порядковий номер: ${ordinalNumber.value}`,
    `Номери наборів (0..7), де f=1: ${ones0.value.join(", ") || "-"}`,
    `Номери наборів (1..8), де f=1: ${ones1.value.join(", ") || "-"}`
  ].join("\n");
  try {
    await navigator.clipboard.writeText(text);
    alert("Скопійовано в буфер обміну");
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    alert("Скопійовано в буфер обміну");
  }
};
</script>

<style scoped>
.wrap{max-width:980px;margin:0 auto;padding:24px;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#111}
.header{margin-bottom:16px}
h1{margin:0 0 6px 0;font-size:28px}
.sub{margin:0;color:#555}
.card{border:1px solid #e5e7eb;border-radius:14px;padding:16px;margin:16px 0;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.04)}
.row{display:flex;gap:12px;align-items:center;flex-wrap:wrap}
.row.space{justify-content:space-between}
.label{font-size:13px;color:#555;min-width:120px}
.select{padding:10px 12px;border-radius:10px;border:1px solid #d1d5db;font-size:14px;min-width:240px}
.formula{margin-top:14px}
.mono{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}
.big{font-size:18px}
.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:16px}
.box{border:1px solid #eef2f7;border-radius:12px;padding:12px;background:#fafafa}
.table{width:100%;border-collapse:separate;border-spacing:0;margin-top:10px;overflow:hidden;border:1px solid #e5e7eb;border-radius:12px}
.table th,.table td{padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:center}
.table thead th{background:#f3f4f6;font-weight:600}
.table tbody tr:last-child td{border-bottom:none}
.zero{color:#b91c1c;font-weight:700}
.one{color:#065f46;font-weight:700}
.btn{padding:10px 12px;border-radius:10px;border:1px solid #d1d5db;background:#fff;cursor:pointer;font-size:14px}
.btn:hover{background:#f9fafb}
.note{margin:10px 0 0 0;color:#555;font-size:13px}
.footer{margin-top:10px;color:#666;font-size:12px}
@media (max-width:720px){.grid{grid-template-columns:1fr}}
</style>
