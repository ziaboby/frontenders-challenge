<script lang="ts">
import { defineComponent } from "vue";

type GridType = "years" | "weeks" | "months";

export default defineComponent({
  data() {
    return {
      sToday: new Date().toISOString().substring(0, 10),
      date: new Date(),
      type: "years",
    };
  },
  methods: {
    setType(event: Event) {
      const value = (<HTMLSelectElement>event.target)?.value;
      if (value) this.type = value;
    },
    setDate(event: Event) {
      const value = (<HTMLInputElement>event.target)?.valueAsDate;
      if (value) this.date = value;
    },
  },
});
</script>

<template>
  <header>
    <h1>Your life in dots</h1>
  </header>
  <section class="controllers">
    <form action="" method="get" @submit="false">
      <div class="date-birth__container">
        <label for="date-birth">
          Insert your date of birth
          <input
            id="type"
            name="type"
            type="date"
            :max="sToday"
            @change="setDate"
          />
        </label>
      </div>
      <div class="type__container">
        <label for="type">
          Your life in
          <select id="type" name="type" @change="setType">
            <option value="years">Years</option>
            <option value="months">Months</option>
            <option value="weeks">Weeks</option>
          </select>
        </label>
      </div>
    </form>
  </section>
</template>

<style scoped></style>
