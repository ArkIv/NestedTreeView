<template>
  <template v-for="(item, index) in treeArray" :key="item[duty.label]">
    <component
      @click.stop="onClick(item)"
      @click.right.stop.prevent="$bus.emit('onRightMouse', item)"
      :id="getKeyPath(item, index)"
      :is="nodeLabelComponent"
      :item="item"
      :level="level"
      :duty="duty"
    >
    </component>
    <tree-leaf
      v-if="item[duty.expanded] && isChildren(item, index)"
      :nodeLabelComponent="nodeLabelComponent"
      :treeArray="item[duty.children]"
      :duty="duty"
      :level="level + 1"
      :keyPath="getKeyPath(item, index)"
    >
    </tree-leaf>
  </template>
</template>
<script>
//import ParentNodes from "/home/arkadii/Projects/treecomponent/src/components/ParentNodes.vue";
export default {
  inject: ["$bus", "serve"],
  name: "tree-leaf",
  data() {
    return {};
  },
  props: {
    nodeLabelComponent: {
      default: Object
    },
    treeArray: {
      default: null
    },
    keyPath: {
      type: [String, Number],
      default: ""
    },
    marginChildren: {
      type: Number,
      default: 115
    },
    level: {
      type: Number,
      default: 0
    },
    duty: {
      // поля которые обязательно должны быть в объекте, их можно переименовать для избежания конфликтов с бд
      type: Object,
      default() {
        return {};
      },
      validator: value => {
        // если нет данных создадим те которые мы принимаем по умолчанию
        // для обращения по ним к объекту
        if (!value.id) value.id = "id";
        if (!value.label) value.label = "label";
        if (!value.children) value.children = "children";
        if (!value.expanded) value.expanded = "expanded";
        if (!value.read) value.read = "read";
        if (!value.lazy) value.lazy = "lazy";
        if (!value.show) value.show = "show";
        return true;
      }
    }
  },
  components: {
    //   ParentNodes
  },
  // computed: {
  //   marginChildren() {
  //     return this.level * this.marginLeft;
  //   }
  // },
  mounted() {
    console.log("serve: ", this.serve);
  },
  methods: {
    getKeyPath(item, index) {
      item.keyPath = this.keyPath ? this.keyPath + "/" + index : index;
      return this.keyPath ? this.keyPath + "/" + index : index;
    },
    startAnimation(el) {
      console.log("startAnimation", el);
    },
    startTransition(el) {
      console.log("startTransition", el);
    },
    onClick(item) {
      item[this.duty.expanded] = item[this.duty.expanded] ? false : true;
      this.$bus.emit("onLeftMouse", item);
    },
    onClickRight(item) {
      console.log("local - onClickRight : ", item[this.duty.label]);
    },
    isChildren(item, index) {
      return Array.isArray(item[this.duty.children]);
    }
  }
};
</script>
<style lang="scss" scoped></style>
