<template>
  <ArkTreeNodes :nodeLabelComponent="nodeLabel" :nodeArray="nodeArray">
  </ArkTreeNodes>
</template>
<script>
import $bus from "@/components/events.js";
import ArkTreeNodes from "@/components/ArkTreeNodes";
import { initStore, initServeKey } from "@/components/arkCounter";
import { isReactive, reactive } from "vue";

/*eslint no-unused-vars: ["off", { "vars": "local" }]*/
export default {
  //inheritAttrs: false,
  setup(props) {
    console.log("nodeArray-", isReactive(props.nodeArray));
    const { treeProps, setTreeProps, getTreeProps } = initStore(props, $bus);
    const { serve } = initServeKey(props.serveKey); // обзательно вызвать dfgd fdg d dg d gd dg dg dg dfgdfgdfg dfg df gdfg
    return { serve, treeProps, setTreeProps, getTreeProps };
  },
  //inject: ["serve"],
  emits: ["leftclick"],
  provide: {
    $bus
  },
  props: {
    nodeLabel: {
      type: Object,
      default: null
    },
    serveKey: {
      type: Object,
      default: () => reactive({})
    },
    nodeProps: {
      type: Object,
      default: () => {
        return reactive({
          marginChildren: 15
        });
      }
    },
    /**
     * Запрос детей по ID
     */
    getChildren: {
      type: Function,
      default: null
    },
    nodeArray: {
      default: () => {
        return reactive([
          { label: "Забыли указать иточник данных" },
          {
            label: "Нет источника данных",
            children: [{ label: "И тут нет." }, { label: "И тут нет." }]
          },
          { label: "Забыли указать иточник данных" }
        ]);
      }
    }
  },

  components: {
    ArkTreeNodes
    // nodeLabel: nodeLabel
  },
  mounted() {
    //console.log("f", ParentNodes);
    $bus.on("onRightMouse", this.onRightMouse);
    $bus.on("onLeftMouse", this.onLeftMouse);
    $bus.on("changeSelectedNode", (newValue, oldValue) => {
      console.debug(
        "изменилcя текущий ",
        oldValue?.keyPath,
        " на ",
        newValue?.keyPath
      );
    });
    $bus.on("changeSelectedNode", (newValue, oldValue) => {
      console.log(
        "изменилcя повтор",
        oldValue?.keyPath,
        " на ",
        newValue?.keyPath
      );
    });

    console.log(">>>>>> ", this.nodeArray);
  },

  unmounted() {
    $bus.off("onRightMouse", this.onRightMouse);
    $bus.off("onLeftMouse", this.onLeftMouse);
  },
  destroy() {},
  methods: {
    onRightMouse(item) {
      let keyPath = ("" + item[this.serve.keyPath]).split("/").map(Number); // в массив и в числа
      let It = this.nodeArray;
      // найдем ближайшего родителя по keyPath если он есть
      for (let i = 0; i < keyPath.length - 1; i++) {
        console.log(It[keyPath[i]]);
        It = It[keyPath[i]].children; // parent
      }
      // в It либо найденный родитель, либо корень дерева ели в пути был один элемент.
      if (typeof It !== "undefined") {
        It.splice(keyPath[keyPath.length - 1], 1);
        this.setTreeProps("selectedNode", null); //TODO изменить !!
        console.log("1:", It, "2:", keyPath[keyPath.length - 1]);
      }
      console.log("BUS right: ", keyPath[keyPath.length - 1], It);
    },
    onLeftMouse(item) {
      this.setTreeProps("selectedNode", item);

      console.log("BUS left -: ", item);
      this.$emit("leftclick", item);
    },
    test(value) {
      console.log("func", value);
    },
    /**
     * Получить текущий Узел
     */
    getCurrentNode() {
      return this.getTreeProps("selectedNode");
    },
    /**
     * Построение пути к узлу по ключу, если он существует
     */
    findPathToNodeByKey(key) {
      // найти путь к узлу по Ключу
      let path = "";
      path = findKeyRecursive(this.nodeArray, path)[1];
      function findKeyRecursive(arr) {
        for (let i = 0; i < arr.length; i++) {
          // console.log(arr[i].uid);
          if (arr[i].uid == key) {
            path += i; // нашли, выходим
            return [true, path];
          }

          if (arr[i].children?.length) {
            let m = path; // сохраним до захода к детм
            path += i + "/"; // заходим к детям, ставим родителя в путь
            if (findKeyRecursive(arr[i].children)[0]) {
              return [true, path]; // выходим с полным путем если нашли у детей
            } else path = m; // вышли в детях не нашли вернем то что было до захода, без родителя
          }
        }
        return [false, ""];
      }

      return path;
    },
    /**
     * переход к узлу по пути (4/4/8/3)
     * по пути запрашиваются дети
     */
    async gotoNodeByPath(path) {
      if (typeof path === "string") {
        path = path.split("/").map(Number); // в массив и в числа
      }
      if (!Array.isArray(path)) {
        console.log("gotoPath params Array or Stirng 'x/y/z..'");
        return;
      }
      console.log(path);
      let i = 0;
      let nArray = this.nodeArray;
      for (i = 0; i < path.length; i++) {
        console.log("Запро for :", i, path);
        if (nArray[path[i]].children?.length > 0) {
          //todo! сюда лази проверку
          nArray[path[i]][this.serve.expanded] = true;
          nArray = nArray[path[i]].children;
        } else {
          await this.$nextTick(); // ждем отрисовки DOM а во время отрисовки
          // проставляется уникальный  uid, если нет своего.
          let childs = await this.getChildren(nArray[path[i]].uid); // запрос новых деток
          nArray[path[i]][this.serve.children] = childs.slice(); // добавляем новых детей
          nArray[path[i]][this.serve.expanded] = true; // открываем узел
          nArray = nArray[path[i]][this.serve.children]; // новых детей в For
        }
        if (i == path.length - 1)
          // последний, фиксируем как SelectedNode
          this.setTreeProps("selectedNode", nArray[path[i]]);
      }
      // function testik(nArray, path, i) {
      //   console.log(
      //     "Возврат вызова функ из props",
      //     nArray,
      //     nArray[path[i]].uid
      //   );
      //   let childs = this.getChildren(nArray[path[i]].uid);
      //   nArray[path[i]][this.serve.children] = childs.slice(); // добавляем новых детей
      //   nArray[path[i]][this.serve.expanded] = true; // открываем узел
      //   nArray = nArray[path[i]][this.serve.children]; // новых детей в For
      // }
    }
  }
};
</script>
