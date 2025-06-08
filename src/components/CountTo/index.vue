<template>
  <span>{{ displayValue }}</span>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  startVal: {
    type: Number,
    default: 0
  },
  endVal: {
    type: Number,
    default: 2023
  },
  duration: {
    type: Number,
    default: 1500
  },
  autoplay: {
    type: Boolean,
    default: true
  },
  decimals: {
    type: Number,
    default: 0
  },
  decimal: {
    type: String,
    default: '.'
  },
  separator: {
    type: String,
    default: ','
  },
  prefix: {
    type: String,
    default: ''
  },
  suffix: {
    type: String,
    default: ''
  },
  useEasing: {
    type: Boolean,
    default: true
  },
  easingFn: {
    type: Function,
    default: (t: number, b: number, c: number, d: number) => {
      return c * (-Math.pow(2, -10 * t / d) + 1) * 1024 / 1023 + b;
    }
  }
});

const localStartVal = ref(props.startVal);
const displayValue = ref(formatNumber(props.startVal));
const localDuration = ref(props.duration);
const remaining = ref(0);
const rAF: any = ref(null);
const timestamp = ref(null);

const countDown = ref(props.startVal > props.endVal);

watch(() => props.startVal, (val) => {
  if (props.autoplay) {
    start();
  }
});

watch(() => props.endVal, (val) => {
  if (props.autoplay) {
    start();
  }
});

onMounted(() => {
  if (props.autoplay) {
    start();
  }
  renderCountTo();
});

function start() {
  localStartVal.value = props.startVal;
  timestamp.value = null;
  remaining.value = props.duration;
  rAF.value = requestAnimationFrame(count);
}

function pauseResume() {
  if (rAF.value) {
    cancelAnimationFrame(rAF.value);
    rAF.value = null;
    remaining.value -= Date.now() - timestamp.value;
  } else {
    timestamp.value = Date.now();
    count();
  }
}

function reset() {
  if (rAF.value) {
    cancelAnimationFrame(rAF.value);
  }
  displayValue.value = formatNumber(props.startVal);
}

function count() {
  let now = Date.now();
  if (!timestamp.value) timestamp.value = now;
  const progress = Math.min((now - timestamp.value) / localDuration.value, 1);
  const value = countDown.value
    ? localStartVal.value - props.easingFn(progress, 0, localStartVal.value - props.endVal, 1) * (localStartVal.value - props.endVal)
    : props.easingFn(progress, localStartVal.value, props.endVal - localStartVal.value, 1) * (props.endVal - localStartVal.value) + localStartVal.value;
  displayValue.value = formatNumber(value);
  if (progress < 1) {
    rAF.value = requestAnimationFrame(count);
  }
}

function formatNumber(num: number): string {
  const fixedNum = Number(num).toFixed(props.decimals);
  const stringNum = fixedNum.toString();
  const x = stringNum.split('.');
  let x1 = x[0];
  const x2 = x.length > 1 ? props.decimal + x[1] : '';
  const rgx = /(\d+)(\d{3})/;
  if (props.separator && !isNumber(props.separator)) {
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + props.separator + '$2');
    }
  }
  return props.prefix + x1 + x2 + props.suffix;
}

function isNumber(val: string | number): boolean {
  return !isNaN(parseFloat(val as string)) && isFinite(val as number);
}

function renderCountTo() {
  if (props.startVal !== localStartVal.value) {
    localStartVal.value = props.startVal;
    reset();
  }
}

defineExpose({
  start,
  pauseResume,
  reset
});
</script>

<style scoped>
/* 添加必要的样式 */
</style> 