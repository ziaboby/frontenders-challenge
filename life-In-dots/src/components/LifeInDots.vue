<script lang="ts">
import { defineComponent } from "vue";
import Grid from "./Grid.vue";

export default defineComponent({
  data() {
    return {
      age: 0,
      sToday: new Date().toISOString().substring(0, 10),
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
      if (value) {
        const ageInMs = Date.now() - value.getTime(),
          msInYear = 365 * 24 * 60 * 60 * 1000;
        this.age = Math.floor(ageInMs / msInYear);
      }
    },
  },
  components: { Grid },
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
          <span class="sr-only">Insert your date of birth</span>
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
          <span class="sr-only">See</span> your life in
          <select id="type" name="type" @change="setType">
            <option value="years">Years</option>
            <option value="months">Months</option>
            <option value="weeks">Weeks</option>
          </select>
        </label>
      </div>
    </form>
  </section>
  <Grid v-if="age" :type="type" :age="age" />
</template>

<style scoped>
.type__container {
  margin-top: 0.5rem;
}
</style>
