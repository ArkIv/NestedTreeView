<template>
  <transition
    class="node"
    appear
    :css="false"
    @before-enter="beforeEnter"
    @enter="enter"
    @before-leave="leave"
    @leave="leave"
    @after-enter="afterEnter"
    @enter-cancelled="afterEnter"
  >
    <div :data-lvl="level" class="nodeLabel">
      <div style="display:flex;align-items:center">
        <img alt="." :src="iconNode(item)" style="width:10px " />
      </div>
      <div
        :style="{
          minWidth: '5px',
          background:
            getTreeProps('selectedNode') == item ? 'red' : nodeProps.color
        }"
      ></div>
      <div class="labelNodeTxt">
        {{ item.uid }}
        {{ nodeProps.color }}
        -{{ nodeProps.color }}- {{ item[serve.keyPath] }} -
        {{ item[serve.label] }}
      </div>
    </div>
  </transition>
</template>
<script>
// https://v3.vuejs.org/api/global-api.html#definecomponent
import { defineComponent } from "vue"; //! defineComponent не обязательно использовать
import { arkCounter } from "@/components/arkCounter";
export default defineComponent({
  inject: ["serve", "nodeProps", "setTreeProps", "getTreeProps"],
  setup() {
    const { counter, increment } = arkCounter();
    return { counter, increment };
  },
  props: {
    item: {
      type: Object
    },
    level: {
      type: Number
    },
    keyPath: {
      default: ""
    },
    src: {
      type: String
    }
  },
  beforeCreate() {
    // console.log("BeforeCreate NodeLeaf");
  },
  beforeMount() {
    // console.log("BeforeMount NodeLeaf");
  },
  mounted() {
    // console.log("mount:", "state", this.state);
  },
  beforeUnmount() {
    // console.log("beforeUnmount", this.$el.id);
    // this.setState("test555", "Запиано в unmount");
    //await new Promise(resolve => setTimeout(resolve, 10000));
    //console.log("beforeUnmount", "После таймаута");
    //this.$el.style.height = 3 + "px";
  },
  methods: {
    iconNode(item) {
      if (this.isChildren(item)) {
        if (item[this.serve.expanded]) return require("@/assets/arrowDown.svg");
        else {
          item[this.serve.children].forEach(el => {
            //  el.expanded = false;
          });
          return require("@/assets/arrowRight.svg");
        }
      } else return require("@/assets/circleEmpty.svg");
    },
    isChildren(item) {
      return Array.isArray(item[this.serve.children]);
    },
    //!  ///////////////////////////////
    beforeEnter: function(el) {
      // console.log("beforeEnter: ", el.id);
      if (!el.getBoundingClientRect) return;
      el.style.height = "0px";
      el.style.paddingLeft =
        el.dataset.lvl * this.nodeProps.marginChildren -
        this.nodeProps.marginChildren +
        "px";

      // el.classList.add("animation");
    },
    enter(el, done) {
      // https://developer.mozilla.org/ru/docs/Web/API/Element/animate#Implicit_tofrom_keyframes
      this.increment();
      let animation = el.animate(
        [
          { height: 0 },
          { height: el.scrollHeight + "px" },
          { opacity: 1, offset: 0.7 },
          //{ transform: "translate(40px, 0px)" },
          //{ transform: "translate(0px, 0px)" }
          {
            paddingLeft: el.dataset.lvl * this.nodeProps.marginChildren + "px",
            height: "auto"
          }
        ],
        {
          duration: 100, // время всего цикла
          delay: 100 * this.counter,
          fill: "forwards" // остановить на последнем кадре
          // delay: 100 * Math.floor(Math.random() * Math.floor(7)) // Задержка начала
        }
      );

      animation.addEventListener("finish", function() {
        // el.style.transform = "translate(10px, 0px)";
        el.style.height = "";
        el.style.opacity = "";
        el.style.paddingLeft = "";
      });
      done();
    },
    afterEnter(el) {
      // console.log("afterEnter: ", el.id);
      // el.classList.remove("startAnime");
      // el.style.height = "";
      // el.style.opacity = "";
      // el.classList.remove("animation");
    },
    leave: function(el, done) {
      console.log("Leave xxxxx", el);
      //if (!el.getBoundingClientRect) return;
      //done();
      //  done();
      // var delay = el.dataset.index * 150;
      // setTimeout(function() {
      //   Velocity(el, { opacity: 0, maxHeight: 0 }, { complete: done });
      // }, delay);
    }
  }
});
</script>
<style lang="scss" scoped>
.nodeLabel {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  background: lightblue;
  //animation: flash 1s ease 3;
  overflow-wrap: anywhere;
  overflow: hidden;
  height: auto;
  //opacity: 1;
  //transition: height 0.5s, opacity 0.8s;
  //transition-duration: 0.5s;
  //white-space: nowrap;
  cursor: pointer;
  //height: 0;
  //animation: expand 0.5s forwards;
  &:hover {
    background: lightpink;
  }
  min-width: fit-content; // на весь экран
}
.labelNodeTxt {
  display: flex;
  text-align: left;
}
.animation {
  height: 0px;
  transition-property: height;
  transition-duration: 501ms;
  overflow: hidden;
}
.startAnime {
  height: 0px;
  opacity: 0;
}
</style>
