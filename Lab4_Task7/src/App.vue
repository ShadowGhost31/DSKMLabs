<template>
  <div class="wrap">
    <header class="header">
      <h1>Завдання 6–7: спрощення через карту Карно + перевірка програмно</h1>
      <p class="sub mono">f = ((x → (y ∨ z)) → ((x → y) → (x → z)))</p>
      <p class="sub">Набори: xyz = 000,001,010,011,100,101,110,111</p>
    </header>

    <section class="card">
      <h2>Результат спрощення (МДНФ)</h2>
      <div class="mono big">g(x,y,z) = ¬x ∨ ¬y ∨ z</div>
      <div class="mono">еквівалентно: g = ¬(x ∧ y ∧ ¬z)</div>
    </section>

    <section class="card">
      <div class="row space">
        <h2>Перевірка для всіх наборів</h2>
      </div>

      <table class="table">
        <thead>
          <tr>
            <th>#</th>
            <th>x</th>
            <th>y</th>
            <th>z</th>
            <th>f</th>
            <th>g</th>
            <th>eq</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in rows" :key="r.idx">
            <td class="mono">{{ r.idx }}</td>
            <td class="mono">{{ r.x }}</td>
            <td class="mono">{{ r.y }}</td>
            <td class="mono">{{ r.z }}</td>
            <td class="mono" :class="r.f===1?'one':'zero'">{{ r.f }}</td>
            <td class="mono" :class="r.g===1?'one':'zero'">{{ r.g }}</td>
            <td class="mono" :class="r.eq===1?'one':'zero'">{{ r.eq }}</td>
          </tr>
        </tbody>
      </table>

      <div class="result">
        <div class="label">Висновок</div>
        <div class="mono big" :class="allEq ? 'one' : 'zero'">
          {{ allEq ? "Функції еквівалентні на всіх 8 наборах" : "Є набори, де функції різні" }}
        </div>
      </div>
    </section>

    <section class="card">
      <h2>Карта Карно (3 змінні)</h2>
      <p class="note">Рядки: x=0,1. Стовпці: yz = 00, 01, 11, 10 (Gray-код).</p>

      <table class="kmap">
        <thead>
          <tr>
            <th class="corner mono">x \ yz</th>
            <th class="mono">00</th>
            <th class="mono">01</th>
            <th class="mono">11</th>
            <th class="mono">10</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th class="mono">0</th>
            <td class="mono" :class="cellClass(k00)">{{ k00 }}</td>
            <td class="mono" :class="cellClass(k01)">{{ k01 }}</td>
            <td class="mono" :class="cellClass(k11)">{{ k11 }}</td>
            <td class="mono" :class="cellClass(k10)">{{ k10 }}</td>
          </tr>
          <tr>
            <th class="mono">1</th>
            <td class="mono" :class="cellClass(k00x1)">{{ k00x1 }}</td>
            <td class="mono" :class="cellClass(k01x1)">{{ k01x1 }}</td>
            <td class="mono" :class="cellClass(k11x1)">{{ k11x1 }}</td>
            <td class="mono" :class="cellClass(k10x1)">{{ k10x1 }}</td>
          </tr>
        </tbody>
      </table>

      <p class="note">
        Єдина 0 у карті: x=1, y=1, z=0 (клітинка x=1, yz=10). Звідси g = ¬x ∨ ¬y ∨ z.
      </p>
    </section>

  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

type Bit = 0 | 1;
type Row = { idx: number; x: Bit; y: Bit; z: Bit; f: Bit; g: Bit; eq: Bit };

const imp = (a: Bit, b: Bit): Bit => (a === 1 && b === 0 ? 0 : 1);

const fOriginal = (x: Bit, y: Bit, z: Bit): Bit => {
  const yOrZ: Bit = (y === 1 || z === 1) ? 1 : 0;
  const a = imp(x, yOrZ);
  const b = imp(x, y);
  const c = imp(x, z);
  const bc = imp(b, c);
  return imp(a, bc);
};

const gSimplified = (x: Bit, y: Bit, z: Bit): Bit => {
  const nx: Bit = x === 1 ? 0 : 1;
  const ny: Bit = y === 1 ? 0 : 1;
  return (nx === 1 || ny === 1 || z === 1) ? 1 : 0;
};

const combos: Array<[Bit,Bit,Bit]> = [
  [0,0,0],[0,0,1],[0,1,0],[0,1,1],
  [1,0,0],[1,0,1],[1,1,0],[1,1,1]
];

const rows = computed<Row[]>(() => combos.map((t, idx) => {
  const [x,y,z] = t;
  const f = fOriginal(x,y,z);
  const g = gSimplified(x,y,z);
  const eq: Bit = (f === g) ? 1 : 0;
  return { idx, x, y, z, f, g, eq };
}));

const allEq = computed(() => rows.value.every(r => r.eq === 1));

const by = (x: Bit, y: Bit, z: Bit) => rows.value.find(r => r.x===x && r.y===y && r.z===z)?.f ?? 0;

const k00 = computed(() => by(0,0,0));
const k01 = computed(() => by(0,0,1));
const k11 = computed(() => by(0,1,1));
const k10 = computed(() => by(0,1,0));

const k00x1 = computed(() => by(1,0,0));
const k01x1 = computed(() => by(1,0,1));
const k11x1 = computed(() => by(1,1,1));
const k10x1 = computed(() => by(1,1,0));

const cellClass = (v: Bit) => (v === 1 ? "onebg" : "zerobg");


</script>

<style scoped>
.wrap{max-width:1100px;margin:0 auto;padding:24px;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#111}
.header{margin-bottom:16px}
h1{margin:0 0 8px 0;font-size:26px}
.sub{margin:0;color:#555}
.card{border:1px solid #e5e7eb;border-radius:14px;padding:16px;margin:16px 0;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.04)}
.mono{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}
.big{font-size:18px}
.row{display:flex;gap:12px;align-items:center;flex-wrap:wrap}
.row.space{justify-content:space-between}
.btn{padding:10px 12px;border-radius:10px;border:1px solid #d1d5db;background:#fff;cursor:pointer;font-size:14px}
.btn:hover{background:#f9fafb}
.table{width:100%;border-collapse:separate;border-spacing:0;margin-top:10px;overflow:hidden;border:1px solid #e5e7eb;border-radius:12px}
.table th,.table td{padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:center}
.table thead th{background:#f3f4f6;font-weight:600}
.table tbody tr:last-child td{border-bottom:none}
.zero{color:#b91c1c;font-weight:800}
.one{color:#065f46;font-weight:800}
.result{margin-top:12px}
.label{font-size:13px;color:#555}
.note{margin:10px 0 0 0;color:#555;font-size:13px}
.kmap{width:100%;border-collapse:separate;border-spacing:0;margin-top:10px;overflow:hidden;border:1px solid #e5e7eb;border-radius:12px;max-width:520px}
.kmap th,.kmap td{padding:12px;border-bottom:1px solid #e5e7eb;text-align:center}
.kmap thead th{background:#f3f4f6;font-weight:600}
.kmap tbody tr:last-child td,.kmap tbody tr:last-child th{border-bottom:none}
.corner{min-width:90px}
.onebg{background:#eafff3}
.zerobg{background:#ffecec}
.footer{margin-top:10px;color:#666;font-size:12px}
</style>
