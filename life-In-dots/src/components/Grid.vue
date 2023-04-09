<script lang="ts">
type GridType = "years" | "weeks" | "months";

const mapGridRowCol: Record<GridType, [rows: number, cols: number]> = {
  years: [9, 10],
  months: [30, 36],
  weeks: [90, 52],
};

export default {
  props: {
    type: String,
    age: Number,
  },
  computed: {
    convertedAge() {
      console.count("testing");
      const age = this.age ?? 0;
      return this.type === "months"
        ? age * 12
        : this.type === "weeks"
        ? age * 52
        : age;
    },
    nRows() {
      return mapGridRowCol[this.type as GridType][0];
    },
    nCols() {
      return mapGridRowCol[this.type as GridType][1];
    },
  },
};
</script>

<template>
  <section class="grid__container">
    <span id="grid-desc">{{ `You are ${convertedAge} ${type} old` }}</span>
    <ol class="grid" :class="`grid--${type}`" aria-describedby="grid-desc">
      <li
        v-for="(_col, index) in nRows * nCols"
        class="cell"
        :class="{ selected: index < convertedAge }"
      ></li>
    </ol>
  </section>
</template>

<style scoped>
.grid__container {
  margin: 0 auto;
  margin-top: 1rem;
  max-width: 70%;
}

.grid {
  column-gap: 0.2rem;
  display: grid;
  margin: 1rem 0;
  padding: 0;
  row-gap: 0.2rem;
}

.grid--years {
  grid-template: repeat(9, 1fr) / repeat(10, 1fr);
}

.grid--months {
  grid-template: repeat(30, 1fr) / repeat(36, 1fr);
}

.grid--weeks {
  grid-template: repeat(90, 1fr) / repeat(52, 1fr);
}

.cell {
  display: block;
  aspect-ratio: 1;
  border: 1px solid #333;
}

.cell.selected {
  /* background: repeating-linear-gradient(
    45deg,
    red,
    red 10%,
    white 10%,
    white 20%
  ); */
  background-color: #666;
}
</style>
