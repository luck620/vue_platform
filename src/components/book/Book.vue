<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>图书资源管理</el-breadcrumb-item>
      <el-breadcrumb-item>图书资源列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-form ref="textRow" class="diaglog">
        <el-row :gutter="20" >
          图书名称：<el-input placeholder="请输入内容" v-model="book.name" clearable></el-input>
          图书出版社：<el-input placeholder="请输入内容" v-model="book.publish" clearable></el-input>
          图书类型：<el-select clearable v-model="book.type" filterable remote reserve-keyword :remote-method="remoteMethod" :loading="loading" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
        </el-row>
        <el-row :gutter="20">
          发行时间：<el-date-picker
            v-model="book.publishTimeStartAndEnd"
            value-format="yyyy-MM-dd HH:mm:ss"
            :unlink-panels=true
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期" clearable>
          </el-date-picker>
          作者：<el-input placeholder="请输入内容" v-model="book.author" clearable></el-input>
          ISBN：<el-input placeholder="请输入内容" v-model="book.isbn" clearable></el-input>
          <el-button type="success" square @click="getBookListByOthers">查询</el-button>
          <el-button type="info" square @click="resetTextForm">重置</el-button>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4">
            <el-button type="primary" @click="addDialogVisible = true">添加图书</el-button>
          </el-col>
        </el-row>
      </el-form>
      <!--列表数据显示-->
      <el-table :data="bookList" border stripe>
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="图书封面" prop="imageUrl">
          <template scope="scope">
            <img :src="scope.row.imageUrl" width="120" height="180"/>
          </template>
        </el-table-column>
        <el-table-column label="图书名称" prop="name"></el-table-column>
        <el-table-column label="图书出版社" prop="publish"></el-table-column>
        <el-table-column label="ISBN" prop="isbn"></el-table-column>
        <el-table-column label="图书类型" prop="type"></el-table-column>
        <el-table-column label="作者" prop="author"></el-table-column>
        <el-table-column label="发行时间" prop="publishTime"></el-table-column>
        <el-table-column label="简介" prop="introduction"></el-table-column>
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
    <el-dialog title="添加图书" :visible.sync="addDialogVisible" width="32%" @close="addDialogClosed" class="diaglog">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        上传图书封面<el-upload
          class="avatar-uploader"
          :multiple="true"
          action="http://upload-z2.qiniup.com"
          accept="image/jpeg,image/gif,image/png,image/bmp"
          :show-file-list="false"
          :data="postData"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :on-error="handleError">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <el-form-item label="图书名称" prop="name">
          <el-input v-model="addForm.name" ></el-input>
        </el-form-item>
        <el-form-item label="图书出版社" prop="publish">
          <el-input v-model="addForm.publish"></el-input>
        </el-form-item>
        <el-form-item label="ISBN" prop="isbn">
          <el-input v-model="addForm.isbn" ></el-input>
        </el-form-item>
        <el-form-item label="作者" prop="author">
        <el-input v-model="addForm.author" ></el-input>
      </el-form-item>
        <el-form-item label="简介" prop="introduction">
          <el-input v-model="addForm.introduction" type="textarea" ></el-input>
        </el-form-item>
        <div class="addType" style="margin-left: 30px">
          图书类型<el-select clearable style="margin-left: 12px" v-model="addForm.type" filterable remote reserve-keyword :remote-method="remoteMethod" :loading="loading" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
        </div>
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
    <el-dialog title="修改图书信息" :visible.sync="editDialogVisible" width="32%" @close="editDialogClosed" class="diaglog">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        上传图书封面<el-upload
        class="avatar-uploader"
        :multiple="true"
        action="http://upload-z2.qiniup.com"
        accept="image/jpeg,image/gif,image/png,image/bmp"
        :show-file-list="false"
        :data="postData"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
        :on-error="handleError">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
        <el-form-item label="图书名称" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="图书出版社" prop="publish">
          <el-input v-model="editForm.publish"></el-input>
        </el-form-item>
        <el-form-item label="ISBN" prop="isbn">
          <el-input v-model="editForm.isbn" ></el-input>
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="editForm.author" ></el-input>
        </el-form-item>
        <el-form-item label="简介" prop="introduction">
          <el-input v-model="editForm.introduction" type="textarea" ></el-input>
        </el-form-item>
        <div class="addType" style="margin-left: 30px">
          图书类型<el-select style="margin-left: 12px" v-model="editForm.type" filterable remote reserve-keyword :remote-method="remoteMethod" :loading="loading" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
        </div>
        <el-form-item label="发行时间" prop="publishTime">
          <el-date-picker
            v-model="editForm.publishTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
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
      options: [],
      loading: false,
      type: '',
      imageUrl: '',
      imageURL: '',
      postData: {
        token: '',
        key: ''
      },
      book: {
        name: '',
        publish: '',
        type: '',
        isbn: '',
        author: '',
        publishTimeStartAndEnd: '',
        publishTimeStart: '',
        publishTimeEnd: ''
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
        author: '',
        isbn: '',
        introduction: '',
        imageUrl: '',
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
        author: '',
        isbn: '',
        introduction: '',
        imageUrl: '',
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
    this.remoteMethod()
    this.getToken()
  },
  methods: {
    async getToken () {
      await this.$http.get('http://localhost:8080/getUpToken').then((res) => {
        console.log(res)
        this.postData.token = res.data
      })
    },
    handleError: function (res) {
      console.log(res)
      this.$message({
        message: '上传失败',
        duration: 2000,
        type: 'warning'
      })
    },
    handleAvatarSuccess (res, file) {
      console.log(res)
      console.log(file)
      console.log(file.raw)
      this.$message.success('上传成功')
      this.imageUrl = 'http://qaath1lbd.bkt.clouddn.com/' + res.key
      this.imageURL = res.key
      console.log(this.imageUrl)
    },
    beforeAvatarUpload (file) {
      this.postData.key = file.name
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG && !isPNG) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    async remoteMethod () {
      const { data: res } = await this.$http.get('http://localhost:8080/book/findAllType')
      console.log(res)
      this.options = res
    },
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
      this.book.publishTimeStartAndEnd = ''
      this.book.author = ''
      this.book.isbn = ''
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
      console.log(this.book.publishTimeStartAndEnd)
      if (this.book.publishTimeStartAndEnd !== '') {
        this.book.publishTimeStart = this.book.publishTimeStartAndEnd[0]
        this.book.publishTimeEnd = this.book.publishTimeStartAndEnd[1]
      }
      console.log(this.book.publishTimeStart)
      console.log(this.book.publishTimeEnd)
      const { data: res } = await this.$http.post('http://localhost:8080/book/getBookListByOthers/' + (this.queryInfo.pageNum - 1) + '/' + this.queryInfo.pageSize + '', this.book)
      console.log(res)
      this.bookList = res.content
      this.total = res.totalElements
    },
    handleSizeChange (newSize) {
      console.log(123)
      this.queryInfo.pageSize = newSize
      if (this.book.type === '' && this.book.publishTimeStartAndEnd === '' && this.book.publishTimeStart === '' && this.book.publishTimeEnd === '' &&
        this.book.publish === '' && this.book.author === '' && this.book.isbn === '' && this.book.name === '') {
        this.getBookList()
      } else {
        this.getBookListByOthers()
      }
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pageNum = newPage
      if (this.book.type === '' && this.book.publishTimeStartAndEnd === '' && this.book.publishTimeStart === '' && this.book.publishTimeEnd === '' &&
        this.book.publish === '' && this.book.author === '' && this.book.isbn === '' && this.book.name === '') {
        this.getBookList()
      } else {
        this.getBookListByOthers()
      }
    },
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    addBook () {
      this.$refs.addFormRef.validate(async valid => {
        console.log(valid)
        if (!valid) return
        this.addForm.imageUrl = this.imageURL
        console.log(this.imageURL)
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
        this.editForm.imageUrl = this.imageURL
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
<style scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 60px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    border: 1px dashed #5191d9;
    margin-left: 100px;
    margin-bottom: 30px;
  }
  .avatar {
    cursor: pointer;
    width: 100px;
    height: 100px;
    display: block;
  }
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
    margin-right: 30px;
    margin-bottom: 15px;
  }
  .el-date-picker{
    margin-right: 10px;
  }
  .diaglog >>> .el-input__inner {
    width: 300px!important;
    margin-right: 30px;
    margin-bottom: 15px;
  }
</style>
