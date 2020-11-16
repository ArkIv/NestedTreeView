<template>
  <template v-for="(item, index) in nodeArray" :key="getKey(item, index)">
    <component
      @click.stop="onClick(item)"
      @click.right.stop.prevent="$bus.emit('onRightMouse', item)"
      :id="item[this.serve.keyPath]"
      :is="nodeLabelComponent"
      :item="item"
      :level="level"
    >
    </component>
    <tree-leaf
      v-if="item[serve.expanded] && isChildren(item, index)"
      :nodeLabelComponent="nodeLabelComponent"
      :nodeArray="item[serve.children]"
      :parent="item"
      :level="level + 1"
      :keyPath="item[this.serve.keyPath]"
    >
    </tree-leaf>
  </template>
</template>
<script>
export default {
  inject: [
    "$bus",
    "serve",
    "getNumKey",
    "setTreeProps",
    "treeProps",
    "getTreeProps"
  ],
  name: "tree-leaf",
  data() {
    return {};
  },
  props: {
    nodeLabelComponent: {
      default: Object
    },
    nodeArray: {
      default: null
    },
    parent: {
      type: Object,
      default: null
    },
    keyPath: {
      type: [String, Number],
      default: ""
    },
    level: {
      type: Number,
      default: 0
    }
  },
  components: {
    //   ParentNodes
  },

  mounted() {
    // console.log("serve: ", this.serve);
  },
  methods: {
    getKey(item, index) {
      item[this.serve.keyPath] = this.keyPath
        ? this.keyPath + "/" + index
        : index;
      item[this.serve.parent] = this.parent;
      if (typeof item[this.serve.uid] !== "undefined")
        return item[this.serve.uid];
      item[this.serve.uid] = this.getNumKey();
      //

      return item[this.serve.uid];
    },
    onClick(item) {
      item[this.serve.label] = item[this.serve.label] + "X ";
      this.setTreeProps("selectedNode", item);
      item[this.serve.expanded] = item[this.serve.expanded] ? false : true;
      let Xnode = this.getTreeProps("selectedNode");
      Xnode[this.serve.label] = Xnode[this.serve.label] + "Y ";
      console.log("selected", Xnode);
      this.$bus.emit("onLeftMouse", item);
    },
    isChildren(item, index) {
      return Array.isArray(item[this.serve.children]);
    }
  }
};
</script>
<style lang="scss" scoped></style>
