<template>
  <div class="wrap">
    <header class="header">
      <h1>Мінімальне остовне дерево (MST)</h1>
      <p class="sub">Алгоритми: Прима або Краскала. Вивід етапів на екран. Тест — граф із Завдання 3.</p>
    </header>

    <section class="card">
      <div class="row">
        <label class="label">Алгоритм</label>
        <select class="select" v-model="algo">
          <option value="kruskal">Краскал</option>
          <option value="prim">Прим</option>
        </select>

        <label class="label" v-if="algo==='prim'">Стартова вершина</label>
        <select class="select" v-if="algo==='prim'" v-model.number="primStart">
          <option v-for="v in vertices" :key="v" :value="v">{{ v }}</option>
        </select>

        <button class="btn" @click="run">Запустити</button>
        <button class="btn" @click="reset">Скинути</button>
      </div>

      <div class="meta">
        <div class="mono"><b>Вершини:</b> {{ vertices.join(", ") }}</div>
        <div class="mono"><b>Ребра:</b> {{ edges.length }}</div>
      </div>
    </section>

    <section class="card">
      <h2>Вхідний граф (ребра з вагами)</h2>
      <table class="table">
        <thead>
          <tr>
            <th>#</th>
            <th>u</th>
            <th>v</th>
            <th>w</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(e, i) in edges" :key="i">
            <td class="mono">{{ i+1 }}</td>
            <td class="mono">{{ e.u }}</td>
            <td class="mono">{{ e.v }}</td>
            <td class="mono">{{ e.w }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="card" v-if="steps.length">
      <div class="row space">
        <h2>Етапи алгоритму</h2>
      </div>

      <table class="table">
        <thead>
          <tr>
            <th>Крок</th>
            <th>Дія</th>
            <th>Ребро</th>
            <th>Причина</th>
            <th>Поточна вага</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in steps" :key="s.k">
            <td class="mono">{{ s.k }}</td>
            <td>{{ s.action }}</td>
            <td class="mono">{{ s.edgeText }}</td>
            <td>{{ s.reason }}</td>
            <td class="mono">{{ s.weight }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="card" v-if="mstEdges.length">
      <h2>Результат</h2>
      <div class="mono big"><b>MST вага:</b> {{ mstWeight }}</div>
      <div class="mono"><b>Ребра MST:</b> {{ mstEdges.map(e => `${e.u}-${e.v}(${e.w})`).join(", ") }}</div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

type Edge = { u: number; v: number; w: number };
type Step = { k: number; action: string; edgeText: string; reason: string; weight: number };

const edges = ref<Edge[]>([
  { u: 1, v: 2, w: 4 },
  { u: 1, v: 3, w: 3 },
  { u: 1, v: 4, w: 2 },
  { u: 2, v: 5, w: 7 },
  { u: 3, v: 5, w: 5 },
  { u: 3, v: 6, w: 4 },
  { u: 4, v: 6, w: 2 },
  { u: 4, v: 7, w: 1 },
  { u: 2, v: 7, w: 6 },
  { u: 5, v: 8, w: 5 },
  { u: 6, v: 8, w: 7 },
  { u: 5, v: 9, w: 3 },
  { u: 6, v: 10, w: 1 },
  { u: 7, v: 9, w: 4 },
  { u: 7, v: 10, w: 2 },
  { u: 8, v: 11, w: 4 },
  { u: 9, v: 11, w: 7 },
  { u: 10, v: 11, w: 3 }
]);

const vertices = computed(() => {
  const s = new Set<number>();
  edges.value.forEach(e => { s.add(e.u); s.add(e.v); });
  return Array.from(s).sort((a,b) => a-b);
});

const algo = ref<"kruskal" | "prim">("prim");
const primStart = ref<number>(1);

const steps = ref<Step[]>([]);
const mstEdges = ref<Edge[]>([]);
const mstWeight = ref<number>(0);

const reset = () => {
  steps.value = [];
  mstEdges.value = [];
  mstWeight.value = 0;
};

class DSU {
  parent: number[];
  rank: number[];
  constructor(n: number) {
    this.parent = Array.from({ length: n + 1 }, (_, i) => i);
    this.rank = Array(n + 1).fill(0);
  }
  find(x: number): number {
    let p = this.parent[x];
    while (p !== this.parent[p]) p = this.parent[p];
    while (x !== p) {
      const nx = this.parent[x];
      this.parent[x] = p;
      x = nx;
    }
    return p;
  }
  union(a: number, b: number): boolean {
    let ra = this.find(a);
    let rb = this.find(b);
    if (ra === rb) return false;
    if (this.rank[ra] < this.rank[rb]) [ra, rb] = [rb, ra];
    this.parent[rb] = ra;
    if (this.rank[ra] === this.rank[rb]) this.rank[ra] += 1;
    return true;
  }
}

const edgeText = (e: Edge) => `${e.u}-${e.v}(${e.w})`;

const runKruskal = () => {
  reset();
  const vs = vertices.value;
  const maxV = vs[vs.length - 1] ?? 0;
  const dsu = new DSU(maxV);

  const sorted = [...edges.value].sort((a,b) => a.w - b.w || a.u - b.u || a.v - b.v);

  let k = 1;
  let total = 0;
  const chosen: Edge[] = [];

  for (const e of sorted) {
    const ok = dsu.union(e.u, e.v);
    if (ok) {
      chosen.push(e);
      total += e.w;
      steps.value.push({ k, action: "Додати", edgeText: edgeText(e), reason: "Не утворює цикл", weight: total });
    } else {
      steps.value.push({ k, action: "Пропустити", edgeText: edgeText(e), reason: "Утворює цикл", weight: total });
    }
    k += 1;
    if (chosen.length === vs.length - 1) break;
  }

  mstEdges.value = chosen;
  mstWeight.value = total;
};

const buildAdj = () => {
  const adj = new Map<number, Edge[]>();
  for (const v of vertices.value) adj.set(v, []);
  for (const e of edges.value) {
    adj.get(e.u)?.push(e);
    adj.get(e.v)?.push({ u: e.v, v: e.u, w: e.w });
  }
  return adj;
};

const runPrim = () => {
  reset();
  const vs = vertices.value;
  const adj = buildAdj();

  const start = primStart.value;
  const used = new Set<number>();
  used.add(start);

  let total = 0;
  const chosen: Edge[] = [];
  let k = 1;

  const getCandidates = (): Edge[] => {
    const out: Edge[] = [];
    for (const u of used) {
      const list = adj.get(u) ?? [];
      for (const e of list) {
        if (!used.has(e.v)) out.push(e);
      }
    }
    return out;
  };

  while (chosen.length < vs.length - 1) {
    const cand = getCandidates().sort((a,b) => a.w - b.w || a.u - b.u || a.v - b.v);
    if (cand.length === 0) break;
    const e = cand[0];

    used.add(e.v);
    chosen.push({ u: e.u, v: e.v, w: e.w });
    total += e.w;

    steps.value.push({
      k,
      action: "Додати",
      edgeText: edgeText(e),
      reason: `Найменша вага серед ребер, що виходять із множини S={${Array.from(used).sort((a,b)=>a-b).join(",")}}`,
      weight: total
    });
    k += 1;
  }

  mstEdges.value = chosen;
  mstWeight.value = total;
};

const run = () => {
  if (algo.value === "kruskal") runKruskal();
  else runPrim();
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
.label{font-size:13px;color:#555;min-width:90px}
.select{padding:10px 12px;border-radius:10px;border:1px solid #d1d5db;font-size:14px;min-width:180px}
.btn{padding:10px 12px;border-radius:10px;border:1px solid #d1d5db;background:#fff;cursor:pointer;font-size:14px}
.btn:hover{background:#f9fafb}
.mono{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}
.big{font-size:18px}
.meta{margin-top:10px;display:flex;gap:16px;flex-wrap:wrap;color:#333}
.table{width:100%;border-collapse:separate;border-spacing:0;margin-top:10px;overflow:hidden;border:1px solid #e5e7eb;border-radius:12px}
.table th,.table td{padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:center}
.table thead th{background:#f3f4f6;font-weight:600}
.table tbody tr:last-child td{border-bottom:none}
.footer{margin-top:10px;color:#666;font-size:12px}
</style>
