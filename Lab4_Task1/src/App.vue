<template>
  <div class="wrap">
    <header class="header">
      <h1>Перевірка еквівалентності: початкова формула та ДНФ</h1>
      <p class="sub">Туризм · Варіант 4</p>
    </header>

    <section class="card">
      <h2>Змінні</h2>
      <ul class="list">
        <li><span class="k">A</span>: Клієнт бронює квитки</li>
        <li><span class="k">B</span>: Клієнт отримує візу</li>
        <li><span class="k">C</span>: Клієнт бронює готель</li>
      </ul>

      <div class="formula">
        <div class="label">Початкова формула</div>
        <div class="mono big">F = (A → B) ∨ ¬(B ∧ C)</div>
      </div>

      <div class="formula">
        <div class="label">ДНФ</div>
        <div class="mono big">F_DNF = 1</div>
      </div>
    </section>

    <section class="card">
      <div class="row space">
        <h2>Перевірка для однієї ситуації</h2>
      </div>

      <div class="toggles">
        <label class="toggle"><input type="checkbox" v-model="A" /> A</label>
        <label class="toggle"><input type="checkbox" v-model="B" /> B</label>
        <label class="toggle"><input type="checkbox" v-model="C" /> C</label>
      </div>

      <div class="grid">
        <div class="box">
          <div class="label">F (початкова)</div>
          <div class="mono big" :class="valClass(F)">{{ F ? 1 : 0 }}</div>
        </div>
        <div class="box">
          <div class="label">F_DNF</div>
          <div class="mono big" :class="valClass(F_DNF)">{{ F_DNF ? 1 : 0 }}</div>
        </div>
        <div class="box">
          <div class="label">Еквівалентність</div>
          <div class="mono big" :class="valClass(eq)">{{ eq ? "так" : "ні" }}</div>
        </div>
      </div>
    </section>

    <section class="card">
      <div class="row space">
        <h2>Перевірка для всіх можливих ситуацій</h2>
      </div>

      <table class="table">
        <thead>
          <tr>
            <th>#</th>
            <th>A</th>
            <th>B</th>
            <th>C</th>
            <th>F</th>
            <th>F_DNF</th>
            <th>Eq</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in rows" :key="r.idx">
            <td class="mono">{{ r.idx }}</td>
            <td class="mono">{{ r.a }}</td>
            <td class="mono">{{ r.b }}</td>
            <td class="mono">{{ r.c }}</td>
            <td class="mono" :class="valClass(r.f)">{{ r.f ? 1 : 0 }}</td>
            <td class="mono" :class="valClass(r.dnf)">{{ r.dnf ? 1 : 0 }}</td>
            <td class="mono" :class="valClass(r.eq)">{{ r.eq ? "так" : "ні" }}</td>
          </tr>
        </tbody>
      </table>

      <p class="note mono">Порядок наборів: ABC = 000,001,010,011,100,101,110,111</p>

      <div class="result">
        <div class="label">Висновок</div>
        <div class="mono big" :class="valClass(allEq)">
          {{ allEq ? "Формула еквівалентна ДНФ для всіх наборів" : "Є набори, де формули різні" }}
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

const A = ref(false);
const B = ref(false);
const C = ref(false);

const imp = (p: boolean, q: boolean) => (!p) || q;

const F = computed(() => {
  const a = A.value;
  const b = B.value;
  const c = C.value;
  return imp(a, b) || !(b && c);
});

const F_DNF = computed(() => true);

const eq = computed(() => F.value === F_DNF.value);

type Row = { idx: number; a: 0|1; b: 0|1; c: 0|1; f: boolean; dnf: boolean; eq: boolean };

const rows = computed<Row[]>(() => {
  const out: Row[] = [];
  const combos: Array<[0|1,0|1,0|1]> = [
    [0,0,0],[0,0,1],[0,1,0],[0,1,1],
    [1,0,0],[1,0,1],[1,1,0],[1,1,1]
  ];
  combos.forEach((t, idx) => {
    const [a, b, c] = t;
    const f = imp(a === 1, b === 1) || !((b === 1) && (c === 1));
    const dnf = true;
    out.push({ idx, a, b, c, f, dnf, eq: f === dnf });
  });
  return out;
});

const allEq = computed(() => rows.value.every(r => r.eq));

const valClass = (v: boolean) => (v ? "one" : "zero");



</script>

<style scoped>
.wrap{max-width:980px;margin:0 auto;padding:24px;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#111}
.header{margin-bottom:16px}
h1{margin:0 0 6px 0;font-size:28px}
.sub{margin:0;color:#555}
.card{border:1px solid #e5e7eb;border-radius:14px;padding:16px;margin:16px 0;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.04)}
.list{margin:10px 0 0 18px}
.k{font-weight:700}
.formula{margin-top:14px}
.label{font-size:13px;color:#555}
.mono{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}
.big{font-size:18px}
.row{display:flex;gap:12px;align-items:center;flex-wrap:wrap}
.row.space{justify-content:space-between}
.btn{padding:10px 12px;border-radius:10px;border:1px solid #d1d5db;background:#fff;cursor:pointer;font-size:14px}
.btn:hover{background:#f9fafb}
.toggles{display:flex;gap:16px;margin-top:12px;flex-wrap:wrap}
.toggle{display:flex;gap:8px;align-items:center;font-size:15px}
.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:16px}
.box{border:1px solid #eef2f7;border-radius:12px;padding:12px;background:#fafafa}
.table{width:100%;border-collapse:separate;border-spacing:0;margin-top:10px;overflow:hidden;border:1px solid #e5e7eb;border-radius:12px}
.table th,.table td{padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:center}
.table thead th{background:#f3f4f6;font-weight:600}
.table tbody tr:last-child td{border-bottom:none}
.zero{color:#b91c1c;font-weight:700}
.one{color:#065f46;font-weight:700}
.note{margin:10px 0 0 0;color:#555;font-size:13px}
.result{margin-top:12px}
.footer{margin-top:10px;color:#666;font-size:12px}
@media (max-width:900px){.grid{grid-template-columns:1fr}}
</style>
