<template>
  <div class="app-container">

    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="小程序顶部logo" prop="headImg">
        <el-input v-model="queryParams.headImg" placeholder="请输入小程序顶部logo" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="轮播图地址" prop="carousel">
        <el-input v-model="queryParams.carousel" placeholder="请输入轮播图地址" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="index页面底部图片" prop="indexBottomImg">
        <el-input v-model="queryParams.indexBottomImg" placeholder="请输入index页面底部图片" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="公司名" prop="companyName">
        <el-input v-model="queryParams.companyName" placeholder="请输入公司名" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="公司地址" prop="address">
        <el-input v-model="queryParams.address" placeholder="请输入公司地址" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="电话号码" prop="phoneNumber">
        <el-input v-model="queryParams.phoneNumber" placeholder="请输入电话号码" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="邮箱地址" prop="email">
        <el-input v-model="queryParams.email" placeholder="请输入邮箱地址" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="地图坐标" prop="position">
        <el-input v-model="queryParams.position" placeholder="请输入地图坐标" clearable @keyup.enter.native="handleQuery"/>
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
                   v-hasPermi="['alchemy:mini-app-config:create']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading"
                   v-hasPermi="['alchemy:mini-app-config:export']">导出</el-button>
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
    <el-table v-loading="loading" :data="realTable">
      <el-table-column label="小程序配置ID" align="center" prop="id" />
      <el-table-column label="小程序顶部logo" align="center" :prop="'headImg.'+language" />
      <el-table-column label="轮播图地址" align="center" :prop="'carousel.'+language" />
      <el-table-column label="index页面底部图片" align="center" :prop="'indexBottomImg.'+language" />
      <el-table-column label="公司名" align="center" :prop="'companyName.'+language" />
      <el-table-column label="公司地址" align="center" :prop="'address.'+language" />
      <el-table-column label="电话号码" align="center" :prop="'phoneNumber.'+language" />
      <el-table-column label="邮箱地址" align="center" :prop="'email.'+language" />
      <el-table-column label="地图坐标" align="center" :prop="'position.'+language" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['alchemy:mini-app-config:update']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['alchemy:mini-app-config:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
                @pagination="getList"/>

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" v-dialogDrag append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="语言" prop="name">
              <el-tag type="danger">中文</el-tag>
            </el-form-item>
            <el-form-item label="小程序顶部logo" prop="headImg">
              <el-input v-model="form.headImg.zh" placeholder="请输入小程序顶部logo" />
            </el-form-item>
            <el-form-item label="轮播图地址" prop="carousel">
              <el-input v-model="form.carousel.zh" placeholder="请输入轮播图地址" />
            </el-form-item>
            <el-form-item label="index页面底部图片" prop="indexBottomImg">
              <el-input v-model="form.indexBottomImg.zh" placeholder="请输入index页面底部图片" />
            </el-form-item>
            <el-form-item label="公司名" prop="companyName">
              <el-input v-model="form.companyName.zh" placeholder="请输入公司名" />
            </el-form-item>
            <el-form-item label="公司地址" prop="address">
              <el-input v-model="form.address.zh" placeholder="请输入公司地址" />
            </el-form-item>
            <el-form-item label="电话号码" prop="phoneNumber">
              <el-input v-model="form.phoneNumber.zh" placeholder="请输入电话号码" />
            </el-form-item>
            <el-form-item label="邮箱地址" prop="email">
              <el-input v-model="form.email.zh" placeholder="请输入邮箱地址" />
            </el-form-item>
            <el-form-item label="地图坐标" prop="position">
              <el-input v-model="form.position.zh" placeholder="请输入地图坐标" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="语言" prop="name">
            <el-tag>英文</el-tag>
          </el-form-item>
            <el-form-item label="小程序顶部logo" prop="headImg">
              <el-input v-model="form.headImg.en" placeholder="请输入小程序顶部logo" />
            </el-form-item>
            <el-form-item label="轮播图地址" prop="carousel">
              <el-input v-model="form.carousel.en" placeholder="请输入轮播图地址" />
            </el-form-item>
            <el-form-item label="index页面底部图片" prop="indexBottomImg">
              <el-input v-model="form.indexBottomImg.en" placeholder="请输入index页面底部图片" />
            </el-form-item>
            <el-form-item label="公司名" prop="companyName">
              <el-input v-model="form.companyName.en" placeholder="请输入公司名" />
            </el-form-item>
            <el-form-item label="公司地址" prop="address">
              <el-input v-model="form.address.en" placeholder="请输入公司地址" />
            </el-form-item>
            <el-form-item label="电话号码" prop="phoneNumber">
              <el-input v-model="form.phoneNumber.en" placeholder="请输入电话号码" />
            </el-form-item>
            <el-form-item label="邮箱地址" prop="email">
              <el-input v-model="form.email.en" placeholder="请输入邮箱地址" />
            </el-form-item>
            <el-form-item label="地图坐标" prop="position">
              <el-input v-model="form.position.en" placeholder="请输入地图坐标" />
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
import { createMiniAppConfig, updateMiniAppConfig, deleteMiniAppConfig, getMiniAppConfig, getMiniAppConfigPage, exportMiniAppConfigExcel } from "@/api/alchemy/miniAppConfig";
import mixin from '@/mixin'
import {convert2Real, convert2Table} from "@/utils/language";

export default {
  name: "MiniAppConfig",
  mixins: [mixin],
  components: {
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
      // 小程序配置列表
      list: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      i18nField: ['headImg','carousel','indexBottomImg','companyName','address','phoneNumber','email','position'],
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        headImg: null,
        carousel: null,
        indexBottomImg: null,
        companyName: null,
        address: null,
        phoneNumber: null,
        email: null,
        position: null,
      },
      // 表单参数
      form: {
        headImg: this.createLanguageStringParameter(),
        carousel: this.createLanguageStringParameter(),
        indexBottomImg: this.createLanguageStringParameter(),
        companyName: this.createLanguageStringParameter(),
        address: this.createLanguageStringParameter(),
        phoneNumber: this.createLanguageStringParameter(),
        email: this.createLanguageStringParameter(),
        position: this.createLanguageStringParameter(),
      },
      // 表单校验
      rules: {
        headImg: [{ required: true, message: "小程序顶部logo不能为空", trigger: "blur" }],
        carousel: [{ required: true, message: "轮播图地址不能为空", trigger: "blur" }],
        indexBottomImg: [{ required: true, message: "index页面底部图片不能为空", trigger: "blur" }],
        companyName: [{ required: true, message: "公司名不能为空", trigger: "blur" }],
        address: [{ required: true, message: "公司地址不能为空", trigger: "blur" }],
        phoneNumber: [{ required: true, message: "电话号码不能为空", trigger: "blur" }],
        email: [{ required: true, message: "邮箱地址不能为空", trigger: "blur" }],
        position: [{ required: true, message: "地图坐标不能为空", trigger: "blur" }],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      // 执行查询
      getMiniAppConfigPage(this.queryParams).then(response => {
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
        headImg: this.createLanguageStringParameter(),
        carousel: this.createLanguageStringParameter(),
        indexBottomImg: this.createLanguageStringParameter(),
        companyName: this.createLanguageStringParameter(),
        address: this.createLanguageStringParameter(),
        phoneNumber: this.createLanguageStringParameter(),
        email: this.createLanguageStringParameter(),
        position: this.createLanguageStringParameter()
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
      this.open = true;
      this.title = "添加小程序配置";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getMiniAppConfig(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改小程序配置";
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
          updateMiniAppConfig(convert2Real(this.form,this.i18nField)).then(response => {
            this.$modal.msgSuccess("修改成功");
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createMiniAppConfig(convert2Real(this.form,this.i18nField)).then(response => {
          this.$modal.msgSuccess("新增成功");
          this.open = false;
          this.getList();
        });
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id;
      this.$modal.confirm('是否确认删除小程序配置编号为"' + id + '"的数据项?').then(function() {
          return deleteMiniAppConfig(id);
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
      this.$modal.confirm('是否确认导出所有小程序配置数据项?').then(() => {
          this.exportLoading = true;
          return exportMiniAppConfigExcel(params);
        }).then(response => {
          this.$download.excel(response, '小程序配置.xls');
          this.exportLoading = false;
        }).catch(() => {});
    }
  },
  computed:{
    realTable(){
      return this.list.map(item=>{
        return convert2Table(item, this.i18nField)
      })
    },
  }

};
</script>
