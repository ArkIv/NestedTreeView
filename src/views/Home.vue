<template>
  <ark-tree-component
    ref="arkTree"
    :nodeLabel="nodeLabel"
    :nodeArray="treeArray"
    :nodeProps="nodeProps"
    :serveKey="serveKey"
    :getChildren="getChildren"
    @leftclick="onClick"
  />
  <!-- <ark-tree-component
    ref="arkTree3"
    :nodeLabel="nodeLabel"
    :nodeArray9="treeArray"
    :nodeProps="nodeProps"
    :serveKey="serveKey"
    @leftclick="onClick"
  /> -->
  <div @click="testClick">Жми</div>
</template>

<script>
// @ is an alias to /src
import { ref, markRaw, isReactive } from "vue";
import ArkTreeComponent from "../components/ArkTreeComponent";
import nodeLabelx from "../components/NodeLeafDefault";
import testArray from "../components/testArray";
export default {
  name: "Home",
  components: {
    ArkTreeComponent
  },
  setup() {
    const arkTree = ref(null); // ref="arkTree" все равно нужен
    return { arkTree }; // Здесь компонент
  },
  mounted() {
    console.log("++", this.$refs, this.arkTree);
    this.func = this.$refs.arkTree.test;
  },
  data() {
    return {
      nodeLabel: markRaw(nodeLabelx),
      treeArray: [],
      serveKey: { read: "load", key: "id" },
      nodeProps: { marginChildren: 15, color: "orange" },
      func: null
    };
  },
  created() {
    this.treeArray = testArray;
  },
  methods: {
    onClick(item) {
      console.log("home click:", item);
      this.func("Привет из функтсии");
      let currNode = this.$refs.arkTree.getCurrentNode();
      if (currNode) {
        let path = this.$refs.arkTree.findPathToNodeByKey(currNode.uid);
        console.log("Path то ", currNode.uid, " : ", path);
      }
    },
    testClick() {
      // if (this.nodeProps.color === "green") this.nodeProps.color = "yellow";
      // else this.nodeProps.color = "green";
      // if (this.nodeProps.marginChildren === 15)
      //   this.nodeProps.marginChildren = 30;
      // else this.nodeProps.marginChildren = 15;
      ////////this.$refs.arkTree.$forceUpdate();
      this.$refs.arkTree.gotoNodeByPath("2/4/2/1/2/2/2/2/2/2");
    },
    async getChildren(uid) {
      console.log("Запро UID:", uid);
      await new Promise(resolve => setTimeout(resolve, 5000));
      return [
        { label: "test1 " + uid },
        { label: "test2 " + uid },
        {
          label: "test3 " + uid,
          children: [] // { label: "childrennnnn", uid: 2005 }
        },
        { label: "test4 " + uid }
      ];
      //  }

      // delay(3000).then(() => bool);
    }
  }
};
</script>
<script1 type="text/x-template" id="defaultNode">
<div>
</div>
/*
Vue.component('recursive-item', {
  template: '#recursive-item-tmpl',
  props: ['lvl']
})
*/
</script1>
