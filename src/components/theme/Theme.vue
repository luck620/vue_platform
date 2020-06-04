<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>专题管理</el-breadcrumb-item>
      <el-breadcrumb-item>专题列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!--列表数据显示-->
      <el-table :data="courseList" border stripe>
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="专题封面" prop="imageUrl">
          <template scope="scope">
            <img :src="scope.row.imageUrl" width="250" height="140"/>
          </template>
        </el-table-column>
        <el-table-column label="主题" prop="title"></el-table-column>
        <el-table-column label="类型" prop="type"></el-table-column>
        <el-table-column label="操作" width="210px">
          <template slot-scope="scope">
<!--            <el-tooltip :enterable="false" effect="dark" placement="top" content="修改">-->
<!--              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>-->
<!--            </el-tooltip>-->
<!--            <el-tooltip :enterable="false" effect="dark" placement="top" content="删除">-->
<!--              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeAccountById(scope.row.id)"></el-button>-->
<!--            </el-tooltip>-->
            <el-button type="info" icon="el-icon-check" size="mini" @click="findDetail(scope.row.id)">详情</el-button>
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
    <!--    &lt;!&ndash;添加&ndash;&gt;-->
    <!--    <el-dialog title="添加课程" :visible.sync="addDialogVisible" width="32%" @close="addDialogClosed">-->
    <!--      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">-->
    <!--        <el-form-item label="课程名称" prop="name">-->
    <!--          <el-input v-model="addForm.name" ></el-input>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="使用书籍" prop="realName">-->
    <!--          <el-input v-model="addForm.useBook"></el-input>-->
    <!--        </el-form-item>-->
    <!--      </el-form>-->
    <!--      &lt;!&ndash; 底部区域 &ndash;&gt;-->
    <!--      <span slot="footer" class="dialog-footer">-->
    <!--        <el-button @click="addDialogVisible = false">取 消</el-button>-->
    <!--        <el-button type="primary" @click="addAccount" >确 定</el-button>-->
    <!--      </span>-->
    <!--    </el-dialog>-->
    <!--修改-->
    <el-dialog title="修改账户信息" :visible.sync="editDialogVisible" width="32%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
        上传课程封面<el-upload
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
        <el-form-item label="课程名称" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="课程号" prop="courseNO">
          <el-input v-model="editForm.courseNO"></el-input>
        </el-form-item>
        <el-form-item label="课程描述" prop="description">
          <el-input v-model="editForm.description" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAccount" >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      options: [],
      imageUrl: '',
      imageURL: '',
      postData: {
        token: '',
        key: ''
      },
      course: {
        name: '',
        numberStart: '',
        numberEnd: '',
        teacherName: '',
        courseNO: ''
      },
      queryInfo: {
        pageNum: 1,
        pageSize: 10
      },
      courseList: [],
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      editForm: {
        name: '',
        imageUrl: '',
        description: '',
        courseNO: ''
      },
      editFormRules: {
        name: [
          { required: true, message: '请输入课程名称', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '课程名称的长度在2~10个字符之间',
            trigger: 'blur'
          }
        ],
        useBook: [
          { required: true, message: '请输入使用书籍名称', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getCourseList()
    this.getCourseListByOthers()
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
    findDetail (id) {
      window.sessionStorage.setItem('themeId', id)
      this.$router.push('/findThemeDetail')
    },
    findNoticeDetail (id) {
      window.sessionStorage.setItem('courseId', id)
      this.$router.push('/findNoticeDetail')
    },
    findExamDetail (id) {
      window.sessionStorage.setItem('courseId', id)
      this.$router.push('/findExamDetail')
    },
    async showEditDialog (id) {
      console.log(id)
      const { data: res } = await this.$http.get('http://localhost:8080/course/findCourseById/' + id)
      console.log(res)
      this.editForm = res
      this.editDialogVisible = true
    },
    resetTextForm () {
      this.course.name = ''
      this.course.numberStart = ''
      this.course.numberEnd = ''
      this.course.useBook = ''
    },
    async getCourseList () {
      await this.$http.get('http://localhost:8080/theme/getThemeAll/' + (this.queryInfo.pageNum - 1) + '/' + this.queryInfo.pageSize + '').then((res) => {
        console.log(res)
        console.log(res.data)
        if (res.status !== 200) return this.$message.error('获取账户列表失败')
        this.courseList = res.data.content
        this.total = res.data.totalElements
      })
    },
    async getCourseListByOthers () {
      const { data: res } = await this.$http.post('http://localhost:8080/course/getCourseListByOthers/' + (this.queryInfo.pageNum - 1) + '/' + this.queryInfo.pageSize + '', this.course)
      console.log(res)
      this.courseList = res.content
      this.total = res.totalElements
    },
    handleSizeChange (newSize) {
      console.log(123)
      this.queryInfo.pageSize = newSize
      this.getCourseList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pageNum = newPage
      this.getCourseList()
    },
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    addAccount () {
      this.$refs.addFormRef.validate(async valid => {
        console.log(valid)
        if (!valid) return
        const { data: res } = await this.$http.post('http://localhost:8080/course/addCourse', this.addForm)
        console.log(res)
        if (res.code !== 200) {
          this.$message.error('添加账户失败！')
        }
        this.$message.success('添加账户成功！')
        this.addDialogVisible = false
        this.getCourseList()
      })
    },
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    editAccount () {
      this.$refs.editFormRef.validate(async valid => {
        console.log(valid)
        if (!valid) return
        this.editForm.imageUrl = this.imageURL
        const { data: res } = await this.$http.post('http://localhost:8080/course/editCourseById/' + this.editForm.id, this.editForm)
        console.log(res)
        if (res.code !== 200) {
          this.$message.error('更新账户信息失败！')
        }
        this.$message.success('更新账户信息成功！')
        this.editDialogVisible = false
        this.getCourseList()
      })
    },
    async removeAccountById (id) {
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
      const { data: res } = await this.$http.get('http://localhost:8080/course/deleteCourseById/' + id)
      console.log(res)
      if (res.code !== 200) {
        return this.$message.error('删除用户失败！')
      }
      this.$message.success('删除用户成功！')
      this.getCourseList()
    }
  }
}
</script>
<style lang="less" scoped>

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
    margin-right: 10px;
    margin-bottom: 15px;
  }
  .stuNumberInput{
    width: 140px;
  }
</style>
