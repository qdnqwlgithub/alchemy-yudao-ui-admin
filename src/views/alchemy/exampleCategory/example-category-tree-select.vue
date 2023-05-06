<template>
  <treeselect v-model="categoryId" :options="options" :normalizer="normalizer" :show-count="true"
              placeholder="选择上级菜单"/>
</template>

<script>
import {getExampleCategoryPage} from '@/api/alchemy/exampleCategory'
import mixin from '@/mixin';
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  props:{
    value: [Number]
  },
  mixins: [mixin],
  components:{
    Treeselect
  },
  watch: {
    value: {
      handler(val) {
        this.categoryId=val;
      }
    },
    categoryId:{
      handler(val) {
        this.$emit("input", val);
      },
    }
  },
  data() {
    return {
      options: [],
      categoryId: undefined
    }
  },
  methods: {
    /** 查询菜单下拉树结构 */
    getTreeselect() {
      getExampleCategoryPage({pageSize: 100}).then(response => {
        this.options = [];
        const menu = { id: 0, name: {zh: '主类目',en:'root'}, children: [] };
        menu.children = this.handleTree(response.data.list, "id","parentId");
        this.options.push(menu);
        if(this.value!==undefined){
          this.categoryId=this.value;
        }
      });
    },
    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: `${node.name.zh}-${node.name.en}`,
        children: node.children
      };
    },
  },
};
</script>
