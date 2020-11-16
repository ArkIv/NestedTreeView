import {
  ref,
  reactive,
  readonly,
  provide,
  watch,
  watchEffect,
  computed,
  inject,
  isReactive,
  isReadonly,
  read,
  toRaw,
  isRef,
  unref
} from "vue";

const counter = ref(-1);
let numKey = 1;
let timeout = null;
export function arkCounter() {
  const increment = () => {
    // инкримент для анимации, сколько успеет за секунду.
    // при создании элементов выдает им порядковый номер для
    // таймера анимации
    clearTimeout(timeout);
    counter.value++;
    timeout = setTimeout(() => {
      counter.value = -1;
    }, 1000);
    return counter.value;
  };

  return { counter, increment };
}
//###############################################
export const initStore = (props = {}, $bus) => {
  const nodeProps = reactive(toRaw(props.nodeProps)); // для node CSS all other
  // toRaw - снимает readonly и reactive  с объекта
  console.log("nodeArray", isReactive(props.nodeArray), props.nodeArray);
  delete toRaw(props).nodeProps; // удалим из props - а можно и не удалять

  const treeProps = reactive({}); // для компонента
  const setTreeProps = (key, value) => {
    // функция для записи в хранилище
    let ch = false; // для проверки
    let oldValue = treeProps[key]; // сохраним старое значение
    if (treeProps[key] !== value) ch = true; // проверим изменилось ли
    treeProps[key] = value; // запишшем новое значение в хранилище
    console.debug("set treeProps", key, treeProps, value);
    key = "change" + key[0].toUpperCase() + key.slice(1); // создадим имя события "changeKey" перевод key с большой буквы
    if (ch) $bus.emit(key, value, oldValue); // инициируем событие если что то изменилось
  };

  const getTreeProps = key => {
    // функция для чтения из хранилища возвращает настояшую ссылку на объект( можно toRaw )
    // readonly возвратит элемент который нельзя сравнить с оригиналом
    return treeProps[key];
  };
  provide("getTreeProps", getTreeProps); // передаем детям возвращает настоящий объект без readonly
  provide("setTreeProps", setTreeProps); // функцию в путеществие по детям
  provide("treeProps", readonly(treeProps)); // будем только читать из хранилища
  provide("nodeProps", readonly(nodeProps)); // отдаем в мир

  const getNumKey = () => {
    //функция инкремента для создания уникального ID на время жизни компонента
    return numKey++;
  };
  provide("getNumKey", getNumKey); // отпрвим детям
  return { setTreeProps, getTreeProps, treeProps: readonly(treeProps) }; // отдаем в этот компонент
};
//###########################################
export const initServeKey = (value = {}) => {
  // установим нужные для работы ключи
  // и заменим если чтото надо подменить
  const serve = reactive({
    uid: "uid",
    key: "key",
    parent: "parent",
    label: "label",
    children: "children",
    expanded: "expanded",
    keyPath: "keyPath",
    read: "read",
    lazy: "lazy",
    show: "show",
    ...value
  });
  provide("serve", readonly(serve)); // отдадим детям
  return { serve: readonly(serve) }; // отдадим в кабинет
};
