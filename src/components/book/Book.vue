<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>图书资源管理</el-breadcrumb-item>
      <el-breadcrumb-item>图书资源列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-form ref="textRow">
        <el-row :gutter="20" >
          图书名称：<el-input placeholder="请输入内容" v-model="book.name" clearable></el-input>
          图书出版社：<el-input placeholder="请输入内容" v-model="book.publish" clearable></el-input>
          图书类型：<el-input placeholder="请输入内容" v-model="book.type" clearable></el-input>
          <el-button type="success" square @click="getBookListByOthers">查询</el-button>
          <el-button type="info" square @click="resetTextForm">重置</el-button>
          <el-col :span="4">
            <el-button type="primary" @click="addDialogVisible = true">添加图书</el-button>
          </el-col>
        </el-row>
      </el-form>
      <!--列表数据显示-->
      <el-table :data="bookList" border stripe>
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="图书名称" prop="name"></el-table-column>
        <el-table-column label="图书出版商" prop="publish"></el-table-column>
        <el-table-column label="图书类型" prop="type"></el-table-column>
        <el-table-column label="添加时间" prop="addTime"></el-table-column>
        <el-table-column label="发行时间" prop="publishTime"></el-table-column>
        <el-table-column label="操作" width="170px">
          <template slot-scope="scope">
            <el-tooltip :enterable="false" effect="dark" placement="top" content="修改">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip :enterable="false" effect="dark" placement="top" content="删除">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeBookById(scope.row.id)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNum"
        :page-sizes="[10, 20, 30 ,40, 100]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!--添加-->
    <el-dialog title="添加图书" :visible.sync="addDialogVisible" width="32%" @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
        <el-form-item label="图书名称" prop="name">
          <el-input v-model="addForm.name" ></el-input>
        </el-form-item>
        <el-form-item label="图书出版商" prop="publish">
          <el-input v-model="addForm.publish"></el-input>
        </el-form-item>
        <el-form-item label="图书类型" prop="type">
          <el-input v-model="addForm.type"></el-input>
        </el-form-item>
        <el-form-item label="发行时间" prop="publishTime">
          <el-date-picker
            v-model="addForm.publishTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addBook" >确 定</el-button>
      </span>
    </el-dialog>
    <!--修改-->
    <el-dialog title="修改图书信息" :visible.sync="editDialogVisible" width="32%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
        <el-form-item label="图书名称" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="图书出版社" prop="publish">
          <el-input v-model="editForm.publish"></el-input>
        </el-form-item>
        <el-form-item label="图书类型" prop="type">
          <el-input v-model="editForm.type"></el-input>
        </el-form-item>
        <el-form-item label="添加时间" prop="addTime">
          <el-input v-model="editForm.addTime"></el-input>
        </el-form-item>
        <el-form-item label="发行时间" prop="publishTime">
          <el-input v-model="editForm.publishTime"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editBook" >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      book: {
        name: '',
        publish: '',
        type: ''
      },
      queryInfo: {
        pageNum: 1,
        pageSize: 10
      },
      bookList: [],
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      addForm: {
        name: '',
        publish: '',
        type: '',
        addTime: '',
        publishTime: ''
      },
      addFormRules: {
        name: [
          { required: true, message: '请输入图书名称', trigger: 'blur' },
          {
            min: 1,
            max: 20,
            message: '图书名称的长度在1~20个字符之间',
            trigger: 'blur'
          }
        ],
        publish: [
          { required: true, message: '请输入图书出版社名称', trigger: 'blur' },
          {
            min: 1,
            max: 15,
            message: '密码的长度在1~15个字符之间',
            trigger: 'blur'
          }
        ],
        type: [
          { required: true, message: '请输入图书类型', trigger: 'blur' }
        ],
        publishTime: []
      },
      editForm: {
        name: '',
        publish: '',
        type: '',
        addTime: '',
        publishTime: ''
      },
      editFormRules: {
        name: [
          { required: true, message: '请输入图书名称', trigger: 'blur' },
          {
            min: 1,
            max: 20,
            message: '图书名称的长度在1~20个字符之间',
            trigger: 'blur'
          }
        ],
        publish: [
          { required: true, message: '请输入图书出版社名称', trigger: 'blur' },
          {
            min: 1,
            max: 15,
            message: '密码的长度在1~15个字符之间',
            trigger: 'blur'
          }
        ],
        type: [
          { required: true, message: '请输入图书类型', trigger: 'blur' }
        ],
        publishTime: []
      }
    }
  },
  created () {
    this.getBookList()
    this.getBookListByOthers()
  },
  methods: {
    async showEditDialog (id) {
      console.log(id)
      const { data: res } = await this.$http.get('http://localhost:8080/book/findBookById/' + id)
      console.log(res)
      this.editForm = res
      this.editDialogVisible = true
    },
    resetTextForm () {
      this.book.name = ''
      this.book.publish = ''
      this.book.type = ''
    },
    async getBookList () {
      await this.$http.get('http://localhost:8080/book/getBookList/' + (this.queryInfo.pageNum - 1) + '/' + this.queryInfo.pageSize + '').then((res) => {
        console.log(res)
        console.log(res.data)
        if (res.status !== 200) return this.$message.error('获取图书列表失败')
        this.bookList = res.data.content
        this.total = res.data.totalElements
      })
    },
    async getBookListByOthers () {
      const { data: res } = await this.$http.post('http://localhost:8080/book/getBookListByOthers/' + (this.queryInfo.pageNum - 1) + '/' + this.queryInfo.pageSize + '', this.book)
      console.log(res)
      this.bookList = res.content
      this.total = res.totalElements
    },
    handleSizeChange (newSize) {
      console.log(123)
      this.queryInfo.pageSize = newSize
      this.getBookList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pageNum = newPage
      this.getBookList()
    },
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    addBook () {
      this.$refs.addFormRef.validate(async valid => {
        console.log(valid)
        if (!valid) return
        const { data: res } = await this.$http.post('http://localhost:8080/book/addBook', this.addForm)
        console.log(res)
        if (res.code !== 200) {
          this.$message.error('添加图书失败！')
        }
        this.$message.success('添加图书成功！')
        this.addDialogVisible = false
        this.getBookList()
      })
    },
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    editBook () {
      this.$refs.editFormRef.validate(async valid => {
        console.log(valid)
        if (!valid) return
        const { data: res } = await this.$http.post('http://localhost:8080/book/editBookById/' + this.editForm.id, this.editForm)
        console.log(res)
        if (res.code !== 200) {
          this.$message.error('更新图书信息失败！')
        }
        this.$message.success('更新图书信息成功！')
        this.editDialogVisible = false
        this.getBookList()
      })
    },
    async removeBookById (id) {
      console.log(id)
      const confirmResult = await this.$confirm('确定删除该条数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 如果用户确认删除，则返回值为字符串 confirm
      // 如果用户取消了删除，则返回值为字符串 cancel
      console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.get('http://localhost:8080/book/deleteBookById/' + id)
      console.log(res)
      if (res.code !== 200) {
        return this.$message.error('删除用户失败！')
      }
      this.$message.success('删除用户成功！')
      this.getBookList()
    }
  }
}
</script>
<style lang="less" scoped>
  .el-breadcrumb{
    margin-bottom: 15px;
    font-size: 12px;
  }
  .el-card{
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
  }
  .el-table{
    margin-top: 15px;
    font-size: 12px;
  }
  .el-pagination{
    margin-top: 15px;
  }
  .el-input{
    width: 300px;
    margin-right: 10px;
    margin-bottom: 15px;
  }
</style>
