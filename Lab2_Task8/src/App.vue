<template>
  <div class="container">
    <div class="card">
      <h1>Дискретна математика — Бінарні відношення (варіант 4)</h1>
      <small>Завдання 2–4: P1, P2, операції над відношеннями та композиції. Додатково: властивості відношення.</small>

      <div class="tabs">
        <button class="tab" :class="{active: tab==='t23'}" @click="tab='t23'">Завд. 2–3</button>
        <button class="tab" :class="{active: tab==='t4'}" @click="tab='t4'">Завд. 4</button>
        <button class="tab" :class="{active: tab==='props'}" @click="tab='props'">Властивості</button>
      </div>

      <div v-if="tab==='t23'" class="grid">
        <div class="card">
          <h2>Вхідні множини для P1</h2>
          <div class="row">
            <div class="col">
              <span class="label">A (цілі): від</span>
              <input v-model.number="Amin" type="number" />
            </div>
            <div class="col">
              <span class="label">A (цілі): до</span>
              <input v-model.number="Amax" type="number" />
            </div>
          </div>
          <div class="row" style="margin-top:12px;">
            <div class="col">
              <span class="label">B (натуральні): від</span>
              <input v-model.number="Bmin" type="number" />
            </div>
            <div class="col">
              <span class="label">B (натуральні): до</span>
              <input v-model.number="Bmax" type="number" />
            </div>
          </div>
          <div class="note" style="margin-top:12px;">
            B формується як натуральні числа (1,2,3,...) у межах [Bmin; Bmax]. Якщо Bmin ≤ 0, то починаємо з 1.
          </div>
          <div class="btns" style="margin-top:12px;">
            <button class="btn" @click="recomputeP1P2">Обчислити P1 і P2</button>
            <button class="btn secondary" @click="resetDefaults">Скинути до варіанту 4</button>
          </div>
        </div>

        <div class="card">
          <h2>Результати (P1, P2 та операції)</h2>
          <div class="row">
            <div class="col">
              <span class="label">P1</span>
              <div class="pairs">{{ p1Text }}</div>
            </div>
            <div class="col">
              <span class="label">P2</span>
              <div class="pairs">{{ p2Text }}</div>
            </div>
          </div>

          <div class="row" style="margin-top:12px;">
            <div class="col">
              <span class="label">P1 ∪ P2</span>
              <div class="pairs">{{ unionText }}</div>
            </div>
            <div class="col">
              <span class="label">P1 ∩ P2</span>
              <div class="pairs">{{ interText }}</div>
            </div>
          </div>

          <div class="row" style="margin-top:12px;">
            <div class="col">
              <span class="label">P1 \ P2</span>
              <div class="pairs">{{ p1diffText }}</div>
            </div>
            <div class="col">
              <span class="label">P2 \ P1</span>
              <div class="pairs">{{ p2diffText }}</div>
            </div>
          </div>

          <div class="row" style="margin-top:12px;">
            <div class="col">
              <span class="label">P1 Δ P2</span>
              <div class="pairs">{{ symDiffText }}</div>
            </div>
            <div class="col">
              <span class="label">Потужності</span>
              <div class="pairs">|P1| = {{ P1.length }}
|P2| = {{ P2.length }}
|P1 ∪ P2| = {{ U.length }}
|P1 ∩ P2| = {{ I.length }}
|P1 \ P2| = {{ D12.length }}
|P2 \ P1| = {{ D21.length }}
|P1 Δ P2| = {{ SD.length }}</div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="tab==='t4'" class="grid">
        <div class="card">
          <h2>Q ⊆ C × D</h2>
          <div class="row">
            <div class="col">
              <span class="label">C (список чисел)</span>
              <input v-model="Ctext" placeholder="Напр.: 1,2,3,4,5" />
            </div>
            <div class="col">
              <span class="label">D (список чисел)</span>
              <input v-model="Dtext" placeholder="Напр.: 10,20,30,40" />
            </div>
          </div>
          <div class="note" style="margin-top:12px;">
            За замовчуванням Q будується як декартів добуток C×D.
          </div>
          <div class="btns" style="margin-top:12px;">
            <button class="btn" @click="recomputeComposition">Обчислити R1 і R2</button>
            <button class="btn secondary" @click="resetDefaults">Скинути до варіанту 4</button>
          </div>
        </div>

        <div class="card">
          <h2>Композиції</h2>
          <div class="row">
            <div class="col">
              <span class="label">R1 = P1 ∘ Q</span>
              <div class="pairs">{{ r1Text }}</div>
            </div>
            <div class="col">
              <span class="label">R2 = P2 ∘ Q</span>
              <div class="pairs">{{ r2Text }}</div>
            </div>
          </div>
          <div class="row" style="margin-top:12px;">
            <div class="col">
              <span class="label">Потужності</span>
              <div class="pairs">|R1| = {{ R1.length }}
|R2| = {{ R2.length }}</div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="grid">
        <div class="card">
          <h2>Завд. 5 — властивості відношення R на A={1,2,3,4}</h2>
          <div class="note">R = {(1,1),(2,2),(3,3),(4,4),(1,2),(1,3),(1,4)}</div>
          <div class="btns" style="margin-top:12px;">
            <button class="btn" @click="recomputeProps">Перевірити</button>
          </div>
          <div class="pairs" style="margin-top:12px;">Рефлексивність: {{ props5.ref ? 'так' : 'ні' }}
Симетричність: {{ props5.sym ? 'так' : 'ні' }}
Антисиметричність: {{ props5.antisym ? 'так' : 'ні' }}
Транзитивність: {{ props5.trans ? 'так' : 'ні' }}</div>
        </div>

        <div class="card">
          <h2>Завд. 6 та 7 — швидка перевірка на скінченних множинах</h2>
          <div class="row">
            <div class="col">
              <span class="label">Завд. 6: перевірити еквівалентність (x+y парне) на A={1..k}</span>
              <input v-model.number="k" type="number" min="1" />
              <div class="btns" style="margin-top:12px;">
                <button class="btn" @click="recomputeEq">Перевірити</button>
              </div>
              <div class="pairs" style="margin-top:12px;">A={1..{{ k }}}
Еквівалентність: {{ eq.isEq ? 'так' : 'ні' }}
Рефлексивність: {{ eq.ref ? 'так' : 'ні' }}
Симетричність: {{ eq.sym ? 'так' : 'ні' }}
Транзитивність: {{ eq.trans ? 'так' : 'ні' }}</div>
            </div>

            <div class="col">
              <span class="label">Завд. 7: R={(x,y) | x≠y} на A (список)</span>
              <input v-model="A7text" placeholder="Напр.: 1,2,3,4,5" />
              <div class="btns" style="margin-top:12px;">
                <button class="btn" @click="recomputeNeq">Перевірити</button>
              </div>
              <div class="pairs" style="margin-top:12px;">A={{ A7.join(', ') || '∅' }}
Рефлексивність: {{ neq.ref ? 'так' : 'ні' }}
Симетричність: {{ neq.sym ? 'так' : 'ні' }}
Транзитивність: {{ neq.trans ? 'так' : 'ні' }}
|R| = {{ neq.size }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="note" style="margin-top:16px;">
        Як запустити: npm i → npm run dev.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import {
  Pair,
  cartesian,
  compose,
  diff,
  intersection,
  isAntisymmetric,
  isReflexive,
  isSymmetric,
  isTransitive,
  pairsToText,
  parseNumberList,
  symDiff,
  union
} from './lib/relations'

const tab = ref<'t23' | 't4' | 'props'>('t23')

const Amin = ref(-3)
const Amax = ref(3)
const Bmin = ref(-6)
const Bmax = ref(6)

const Ctext = ref('1,2,3,4,5')
const Dtext = ref('10,20,30,40')

const k = ref(10)
const A7text = ref('1,2,3,4,5')

const P1 = ref<Pair[]>([])
const P2 = ref<Pair[]>([])

const U = ref<Pair[]>([])
const I = ref<Pair[]>([])
const D12 = ref<Pair[]>([])
const D21 = ref<Pair[]>([])
const SD = ref<Pair[]>([])

const R1 = ref<Pair[]>([])
const R2 = ref<Pair[]>([])

const props5 = reactive({ ref: false, sym: false, antisym: false, trans: false })
const eq = reactive({ isEq: false, ref: false, sym: false, trans: false })
const neq = reactive({ ref: false, sym: false, trans: false, size: 0 })

const buildA = (): number[] => {
  const out: number[] = []
  const lo = Math.min(Amin.value, Amax.value)
  const hi = Math.max(Amin.value, Amax.value)
  for (let x = lo; x <= hi; x++) out.push(x)
  return out
}

const buildB = (): number[] => {
  const lo = Math.min(Bmin.value, Bmax.value)
  const hi = Math.max(Bmin.value, Bmax.value)
  const start = Math.max(1, lo)
  const out: number[] = []
  for (let y = start; y <= hi; y++) out.push(y)
  return out
}

const buildP1 = (): Pair[] => {
  const A = buildA()
  const B = buildB()
  const out: Pair[] = []
  for (const x of A) for (const y of B) if (x * y <= 0) out.push([x, y])
  return out
}

const buildP2 = (): Pair[] => {
  const xs = [-1, 0, 1]
  const ys = [0, 1, 2, 3]
  return cartesian(xs, ys)
}

const recomputeP1P2 = () => {
  P1.value = buildP1()
  P2.value = buildP2()
  U.value = union(P1.value, P2.value)
  I.value = intersection(P1.value, P2.value)
  D12.value = diff(P1.value, P2.value)
  D21.value = diff(P2.value, P1.value)
  SD.value = symDiff(P1.value, P2.value)
}

const recomputeComposition = () => {
  const C = parseNumberList(Ctext.value)
  const D = parseNumberList(Dtext.value)
  const Q = cartesian(C, D)
  R1.value = compose(P1.value, Q)
  R2.value = compose(P2.value, Q)
}

const recomputeProps = () => {
  const A = [1, 2, 3, 4]
  const R: Pair[] = [[1,1],[2,2],[3,3],[4,4],[1,2],[1,3],[1,4]]
  props5.ref = isReflexive(A, R)
  props5.sym = isSymmetric(R)
  props5.antisym = isAntisymmetric(R)
  props5.trans = isTransitive(R)
}

const recomputeEq = () => {
  const kk = Math.max(1, Math.floor(k.value))
  const A = Array.from({ length: kk }, (_, i) => i + 1)
  const R: Pair[] = []
  for (const x of A) for (const y of A) if ((x + y) % 2 === 0) R.push([x, y])
  eq.ref = isReflexive(A, R)
  eq.sym = isSymmetric(R)
  eq.trans = isTransitive(R)
  eq.isEq = eq.ref && eq.sym && eq.trans
}

const A7 = computed(() => parseNumberList(A7text.value))

const recomputeNeq = () => {
  const A = A7.value
  const R: Pair[] = []
  for (const x of A) for (const y of A) if (x !== y) R.push([x, y])
  neq.ref = isReflexive(A, R)
  neq.sym = isSymmetric(R)
  neq.trans = isTransitive(R)
  neq.size = new Set(R.map(p => `${p[0]},${p[1]}`)).size
}

const resetDefaults = () => {
  Amin.value = -3
  Amax.value = 3
  Bmin.value = -6
  Bmax.value = 6
  Ctext.value = '1,2,3,4,5'
  Dtext.value = '10,20,30,40'
  k.value = 10
  A7text.value = '1,2,3,4,5'
  recomputeP1P2()
  recomputeComposition()
  recomputeProps()
  recomputeEq()
  recomputeNeq()
}

resetDefaults()

const p1Text = computed(() => pairsToText(P1.value))
const p2Text = computed(() => pairsToText(P2.value))
const unionText = computed(() => pairsToText(U.value))
const interText = computed(() => pairsToText(I.value))
const p1diffText = computed(() => pairsToText(D12.value))
const p2diffText = computed(() => pairsToText(D21.value))
const symDiffText = computed(() => pairsToText(SD.value))

const r1Text = computed(() => pairsToText(R1.value))
const r2Text = computed(() => pairsToText(R2.value))
</script>
