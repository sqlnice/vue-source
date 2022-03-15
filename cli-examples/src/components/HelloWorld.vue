<template>
  <div class="hello">
    <h1>{{ nested.msg }}</h1>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  data() {
    return {
      nested: {
        msg: "Hello Message",
      },
    };
  },
  mounted() {
    console.log(1);
    setTimeout(() => {
      this.nested.msg = "修改后";
    }, 1000);
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
