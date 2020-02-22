<template>
  <main>
    <h1>{{ message }}</h1>
    <p>
      <nuxt-link to="/">
        Repeat API request from the client
      </nuxt-link>
    </p>
  </main>
</template>

<script>
export default {
  async asyncData ({ $api }) {
    const { data } = await $api.hello.msg()
    return data
  }
}
</script>
