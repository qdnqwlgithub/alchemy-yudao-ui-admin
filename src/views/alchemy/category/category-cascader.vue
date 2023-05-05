<template>
    <el-cascader
      style="width: 100%"
      v-model="categoryId"
      :props="{label: 'name.zh' ,value: 'id',expandTrigger: 'hover',emitPath: false  }"
      :options="options">
      <template slot-scope="{ node, data }">
        <span>{{ data.label }}</span>
        <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
      </template>
    </el-cascader>
</template>

<script>
import { getCategoryPage } from "@/api/alchemy/category";
import _ from "lodash";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import mixin from '@/mixin';
import { convert2Entity, convert2Vo } from "@/utils/language";




export default {
  name: "CategorySelect",
  props:{
    value: [Number]
  },
  mixins: [mixin],
  watch: {
    value: {
      handler(val) {
        this.categoryId=val;
      },
      immediate: true
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
  created() {
    this.initOptions();
  },
  methods: {
    /** 查询菜单下拉树结构 */
    initOptions() {
      getCategoryPage({ pageSize: 100 }).then(response => {
        this.options = this.handleTree(response.data.list, "id","parentId");
        console.log(this.options)
      });
    },
  }
};
</script>
