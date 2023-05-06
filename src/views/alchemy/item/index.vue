<template>
  <div class="app-container">

    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="元素名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入元素名称" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="元素简介" prop="intro">
        <el-input v-model="queryParams.intro" placeholder="请输入元素简介" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="所属分类" prop="categoryId">
        <CategoryTreeSelect ref="categoryTreeSelectOfQuery" v-model="queryParams.categoryId"></CategoryTreeSelect>
      </el-form-item>
<!--      <el-form-item label="浏览量" prop="viewNum">-->
<!--        <el-input v-model="queryParams.viewNum" placeholder="请输入浏览量" clearable @keyup.enter.native="handleQuery"/>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="显示顺序" prop="sort">-->
<!--        <el-input v-model="queryParams.sort" placeholder="请输入显示顺序" clearable @keyup.enter.native="handleQuery"/>-->
<!--      </el-form-item>-->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作工具栏 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
                   v-hasPermi="['alchemy:item:create']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading"
                   v-hasPermi="['alchemy:item:export']">导出</el-button>
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
    <el-table v-loading="loading" :data="list">
      <el-table-column label="元素ID" align="center" prop="id" />
      <el-table-column label="元素名称" align="center" :prop="'name.'+language" />
      <el-table-column label="元素简介" align="center" :prop="'intro.'+language" />
<!--      <el-table-column label="所属分类id" align="center" prop="categoryId" />-->
      <el-table-column label="头像地址" align="center" :prop="'avatar.'+language">
        <template v-slot="scope">
          <image-preview :src="scope.row.avatar[language]"></image-preview>
        </template>
      </el-table-column>
      <el-table-column label="轮播图地址" align="center">
        <template v-slot="scope">
          <image-preview :src="scope.row.carousel[language]"></image-preview>
        </template>
      </el-table-column>
      <el-table-column label="元素详情" align="center" :prop="'content.'+language">
        <template v-slot="scope">
          <image-preview :src="scope.row.content[language]"></image-preview>
        </template>
      </el-table-column>
      <el-table-column label="产品手册" align="center" :prop="'doc.'+language" />
      <el-table-column label="浏览量" align="center" :prop="'viewNum.'+language" />
      <el-table-column label="显示顺序" align="center" :prop="'sort.'+language" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['alchemy:item:update']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['alchemy:item:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
                @pagination="getList"/>

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" v-dialogDrag append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="所属分类" prop="categoryId">
          <CategoryTreeSelect ref="categoryTreeSelectOfForm" v-model="form.categoryId"></CategoryTreeSelect>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="语言" prop="name">
              <el-tag type="danger">中文</el-tag>
            </el-form-item>
            <el-form-item label="元素名称" prop="name">
              <el-input v-model="form.name.zh" placeholder="请输入元素名称" />
            </el-form-item>
            <el-form-item label="元素简介" prop="intro">
              <el-input v-model="form.intro.zh" placeholder="请输入元素简介" />
            </el-form-item>
            <el-form-item label="头像地址">
              <imageUpload v-model="form.avatar.zh" :limit="1" />
            </el-form-item>
            <el-form-item label="轮播图地址">
              <imageUpload v-model="form.carousel.zh"/>
            </el-form-item>
            <el-form-item label="元素详情">
              <imageUpload v-model="form.content.zh"/>
            </el-form-item>
            <el-form-item label="产品手册">
              <fileUpload v-model="form.doc.zh"/>
            </el-form-item>
            <el-form-item label="显示顺序" prop="sort">
              <el-input v-model="form.sort.zh" placeholder="请输入显示顺序" />
            </el-form-item>
            <el-form-item label="浏览量" prop="viewNum">
              <el-input v-model="form.viewNum.zh" placeholder="请输入浏览量" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="语言" prop="name">
              <el-tag>英文</el-tag>
            </el-form-item>
            <el-form-item label="元素名称" prop="name">
              <el-input v-model="form.name.en" placeholder="请输入元素名称" />
            </el-form-item>
            <el-form-item label="元素简介" prop="intro">
              <el-input v-model="form.intro.en" placeholder="请输入元素简介" />
            </el-form-item>
            <el-form-item label="头像地址">
              <imageUpload v-model="form.avatar.en" :limit="1" />
            </el-form-item>
            <el-form-item label="轮播图地址">
              <imageUpload v-model="form.carousel.en"/>
            </el-form-item>
            <el-form-item label="元素详情">
              <imageUpload v-model="form.content.en"/>
            </el-form-item>
            <el-form-item label="产品手册">
              <fileUpload v-model="form.doc.en"/>
            </el-form-item>
            <el-form-item label="显示顺序" prop="sort">
              <el-input v-model="form.sort.en" placeholder="请输入显示顺序" />
            </el-form-item>
            <el-form-item label="浏览量" prop="viewNum">
              <el-input v-model="form.viewNum.en" placeholder="请输入浏览量" />
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
import { createItem, updateItem, deleteItem, getItem, getItemPage, exportItemExcel } from "@/api/alchemy/item";
import ImageUpload from '@/components/ImageUpload';
import FileUpload from '@/components/FileUpload';
import mixin from '@/mixin';
import ImagePreview from '@/components/ImagePreview/index.vue'
import CategoryTreeSelect from '@/views/alchemy/category/category-tree-select.vue'




export default {
  name: "Item",
  mixins: [mixin],
  components: {
    ImagePreview,
    ImageUpload,
    FileUpload,
    CategoryTreeSelect
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 显示搜索条件
      showSearch: false,
      // 总条数
      total: 0,
      // 元素列表
      list: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      parentCategoryOptions: [],
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        name: null,
        intro: null,
        categoryId: null,
        avatar: null,
        carousel: null,
        content: null,
        doc: null,
        viewNum: null,
        sort: null,
        createBy: null,
        createTime: [],
        updateBy: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [{ required: true, message: "元素名称不能为空", trigger: "blur" }],
        intro: [{ required: true, message: "元素简介不能为空", trigger: "blur" }],
        categoryId: [{ required: true, message: "所属分类id不能为空", trigger: "blur" }],
        viewNum: [{ required: true, message: "浏览量不能为空", trigger: "blur" }],
        sort: [{ required: true, message: "显示顺序不能为空", trigger: "blur" }],
      }
    };
  },
  beforeMount() {
    this.reset()
    this.getList();
  },
  mounted() {
    this.$refs.categoryTreeSelectOfQuery.getTreeselect();
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      // 执行查询
      getItemPage(this.queryParams).then(response => {
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
        name: this.createLanguageStringParameter(),
        intro: this.createLanguageStringParameter(),
        categoryId: undefined,
        avatar: this.createLanguageStringParameter(),
        carousel: this.createLanguageStringParameter(),
        content: this.createLanguageStringParameter(),
        doc: this.createLanguageStringParameter(),
        sort: this.createLanguageNumberParameter(),
        viewNum: this.createLanguageNumberParameter(),
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
      this.$refs.categoryTreeSelectOfForm.getTreeselect();
      this.reset();
      this.open = true;
      this.title = "添加元素";
      this.$nextTick(()=>{
        this.$refs.categoryTreeSelectOfForm.getTreeselect();
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getItem(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改元素";
        this.$nextTick(()=>{
          this.$refs.categoryTreeSelectOfForm.getTreeselect();
        })
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
          updateItem(this.form).then(response => {
            this.$modal.msgSuccess("修改成功");
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createItem(this.form).then(response => {
          this.$modal.msgSuccess("新增成功");
          this.open = false;
          this.getList();
        });
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id;
      this.$modal.confirm('是否确认删除元素编号为"' + id + '"的数据项?').then(function() {
          return deleteItem(id);
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
      this.$modal.confirm('是否确认导出所有元素数据项?').then(() => {
          this.exportLoading = true;
          return exportItemExcel(params);
        }).then(response => {
          this.$download.excel(response, '元素.xls');
          this.exportLoading = false;
        }).catch(() => {});
    }
  },
};
</script>
