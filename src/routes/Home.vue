<template>
  <article>
    <h1>{{spec.title}}</h1>
    <p v-if="spec.version || spec.author">
      <code v-if="spec.version">{{spec.version}}</code>
      <code v-if="spec.author">{{spec.author}}</code>
    </p>
    <section v-if="spec.description" v-html="spec.description"></section>
    <blockquote v-for="(note,index) in spec.notes" :key="index" v-html="note"></blockquote>
    <template v-if="apis&&apis.length"> <h2>API 模块</h2>
      <ul>
        <li v-for="(item,index) in apis" :key="index"> <router-link :to="item.link">{{item.text}}</router-link>
        </li>
      </ul>
    </template>
    <template v-if="spec.docs && spec.docs.length">
      <h2>文章</h2>
      <template v-for="(group,gid) of spec.docs">
        <ul v-if="group.prefix" :key="gid">{{group.prefix}}</ul>
        <ul v-else :key="gid">
          <li v-for="(item,iid) of group.list" :key="iid">
            <router-link :to="item.link">{{item.title}}</router-link>
          </li>
        </ul>
      </template>
    </template>
  </article>
</template>

<script>
export default {
  props: ['spec', 'apis'], };
</script>
