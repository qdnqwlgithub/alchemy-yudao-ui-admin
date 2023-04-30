<template>
  <div class="app-container">

    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入分类名称" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="头像地址" prop="avatar">
        <el-input v-model="queryParams.avatar" placeholder="请输入头像地址" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="父分类id" prop="parentId">
        <el-input v-model="queryParams.parentId" placeholder="请输入父分类id" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="浏览量" prop="viewNum">
        <el-input v-model="queryParams.viewNum" placeholder="请输入浏览量" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="显示顺序" prop="sort">
        <el-input v-model="queryParams.sort" placeholder="请输入显示顺序" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker v-model="queryParams.createTime" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss" type="daterange"
                        range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作工具栏 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
                   v-hasPermi="['alchemy:category:create']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading"
                   v-hasPermi="['alchemy:category:export']">导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-select v-model="language" placeholder="请选择" size="mini">
          <el-option
            v-for="languageOption in languageOptions"
            :key="languageOption"
            :label="languageOption"
            :value="languageOption">
          </el-option>
        </el-select>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <!-- 列表 -->
    <el-table v-loading="loading" :data="realTable"  row-key="id">
      <el-table-column label="分类id" align="center" prop="id" />
      <el-table-column label="分类名称" align="center" :prop="'name.'+language" />
      <el-table-column label="头像地址" align="center" :prop="'avatar.'+language" />
      <el-table-column label="浏览量" align="center" prop="viewNum" />
      <el-table-column label="显示顺序" align="center" :prop="'sort.'+language" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['alchemy:category:update']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['alchemy:category:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
                @pagination="getList"/>
    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" v-dialogDrag append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="父分类id" prop="parentId">
          <treeselect v-model="form.parentId" :options="parentCategoryOptions" :normalizer="normalizer" :show-count="true"
                      placeholder="选择上级菜单"/>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="语言" prop="name">
              <el-tag type="danger">中文</el-tag>
            </el-form-item>
            <el-form-item label="分类名称" prop="name">
              <el-input v-model="form.name['zh']" placeholder="请输入分类名称" />
            </el-form-item>
            <el-form-item label="头像" prop="avatar">
              <ImageUpload v-model="form.avatar['zh']" :limit="1" :is-show-tip="false" />
            </el-form-item>
            <el-form-item label="显示顺序" prop="sort">
              <el-input v-model="form.sort['zh']" placeholder="请输入显示顺序" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="语言" prop="name">
              <el-tag>英文</el-tag>
            </el-form-item>
            <el-form-item label="分类名称" prop="name">
              <el-input v-model="form.name['en']" placeholder="请输入分类名称" />
            </el-form-item>
            <el-form-item label="头像" prop="avatar">
              <ImageUpload v-model="form.avatar['en']" :limit="1" :is-show-tip="false" />
            </el-form-item>
            <el-form-item label="显示顺序" prop="sort">
              <el-input v-model="form.sort['en']" placeholder="请输入显示顺序" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { createCategory, updateCategory, deleteCategory, getCategory, getCategoryPage, exportCategoryExcel } from "@/api/alchemy/category";
import mixin from '@/mixin';
import ImageUpload from "@/components/ImageUpload/index.vue";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import _ from 'lodash'
import {convert2Real, convert2Table} from "@/utils/language";


export default {
  name: "Category",
  mixins: [mixin],
  components: {
    ImageUpload,
    Treeselect
  },
  data() {
    return {
      i18nFiled:['name','intro','avatar','carousel','content','doc','sort'],
      parentCategoryOptions: [],
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 显示搜索条件
      showSearch: false,
      // 总条数
      total: 0,
      // 分类列表
      list: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        name: null,
        avatar: null,
        parentId: null,
        viewNum: null,
        sort: null,
        createTime: [],
      },
      // 表单参数
      form: {
        name: {
          zh: '',
          en: ''
        },
        avatar: {
          zh: '',
          en: ''
        },
        viewNum:  0,
        sort:  {
          zh: 0,
          en: 0
        },
      },
      // 表单校验
      rules: {
        viewNum: [{ required: true, message: "浏览量不能为空", trigger: "blur" }],
      }
    };
  },
  created() {
    this.getList();
  },
  computed:{
    realForm(){
      let realForm = _.cloneDeep(this.form);
      realForm.name=JSON.stringify(realForm.name);
      realForm.avatar=JSON.stringify(realForm.avatar);
      realForm.sort=JSON.stringify(realForm.sort);
      return realForm;
    },
    realTable(){
      let map = this.list.map(item=>{
        return convert2Table(item, this.i18nFiled)
      });
      const category = { id: 0, name: '主类目', children: [] };
      category.children = this.handleTree(map, "id");
      return category.children;
    }
  },
  methods: {
    /** 查询菜单下拉树结构 */
    getTreeselect() {
      getCategoryPage({pageSize: 100}).then(response => {
        this.parentCategoryOptions = [];
        const category = { id: 0, name: '主类目', children: [] };
        category.children = this.handleTree(response.data.list, "id");
        this.parentCategoryOptions.push(category);
      });
    },
    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children
      };
    },
    /** 查询列表 */
    getList() {
      this.loading = true;
      // 执行查询
      getCategoryPage(this.queryParams).then(response => {
        this.list = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    /** 取消按钮 */
    cancel() {
      this.open = false;
      this.reset();
    },
    /** 表单重置 */
    reset() {
      this.form = {
        id: undefined,
        name: {
          zh: '',
          en: ''
        },
        avatar: {
          zh: '',
          en: ''
        },
        parentId: undefined,
        viewNum:  0,
        sort:  {
          zh: 0,
          en: 0
        },
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.getTreeselect();
      this.open = true;
      this.title = "添加分类";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      const id = row.id;
      getCategory(id).then(response => {
        this.form = convert2Table(response.data,this.i18nFiled);
        this.open = true;
        this.title = "修改分类";
      });
    },
    /** 提交按钮 */
    submitForm() {

      this.$refs["form"].validate(valid => {
        if (!valid) {
          return;
        }
        // 修改的提交
        if (this.form.id != null) {
          updateCategory(this.form).then(response => {
            this.$modal.msgSuccess("修改成功");
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createCategory(this.realForm).then(response => {
          this.$modal.msgSuccess("新增成功");
          this.open = false;
          this.getList();
        });
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id;
      this.$modal.confirm('是否确认删除分类编号为"' + id + '"的数据项?').then(function() {
          return deleteCategory(id);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      // 处理查询参数
      let params = {...this.queryParams};
      params.pageNo = undefined;
      params.pageSize = undefined;
      this.$modal.confirm('是否确认导出所有分类数据项?').then(() => {
          this.exportLoading = true;
          return exportCategoryExcel(params);
        }).then(response => {
          this.$download.excel(response, '分类.xls');
          this.exportLoading = false;
        }).catch(() => {});
    }
  }
};
</script>
