<template>
  <div class="input-file">
    <input type="text" :placeholder="placeholder" :value="display">
    <input type="file" :multiple="multiple" @change="change">
    <close-icon @click="clear" v-if="value" class="close-icon"></close-icon>
  </div>
</template>

<script>
export default {
  props: ['multiple', 'value', 'placeholder'],
  computed: {
    display() {
      if (!this.value) {
        return '';
      }
      if (Array.isArray(this.value)) {
        return this.value.map(file => file.name).join(',');
      }
      return this.value.name;
    },
  },
  methods: {
    change(event) {
      const files = Array.from(event.target.files);
      event.target.value = null;
      const value = this.multiple ? files : files[0];
      this.$emit('input', value);
    },
    clear() {
      this.$emit('input', null);
    },
  },
};
</script>

<style scoped>
.input-file {
  position: relative;
}
.input-file input[type='text'] {
  width: calc(100% - 20px);
  text-overflow: ellipsis;
}
.input-file input[type='file'] {
  position: absolute;
  opacity: 0;
  top: 0;
  left: 0;
  width: calc(100% - 20px);
  bottom: 0;
}

.close-icon {
  position: absolute;
  top: 0;
  right: 0;
}
.close-icon >>> svg {
  color: #ccc;
}
</style>
