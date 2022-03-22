<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <br />
    {{ fullName }}
    <br />
    <button @click="change">change</button>
    <button @click="changeLast">change last name</button>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      firstName: "SHI",
      lastName: "QI",
      useless: 0,
    };
  },
  computed: {
    fullName() {
      return this.firstName + this.lastName;
    },
  },
  methods: {
    change() {
      this.useless++;
    },
    changeLast() {
      this.lastName = "QILONG";
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
