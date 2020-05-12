<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>课程管理</el-breadcrumb-item>
      <el-breadcrumb-item>课程列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-form ref="textRow">
        <el-row :gutter="20" >
          课程名称：<el-input placeholder="请输入内容" v-model="course.name" clearable></el-input>
          参加课程人数：<el-input placeholder="请输入内容" v-model="course.numberStart" clearable class="stuNumberInput" type="number"></el-input>~
          <el-input placeholder="请输入内容" v-model="course.numberEnd" clearable class="stuNumberInput" type="number"></el-input>
          使用书籍：<el-input placeholder="请输入内容" v-model="course.useBook" clearable></el-input>
          <el-button type="success" square @click="getCourseListByOthers">查询</el-button>
          <el-button type="info" square @click="resetTextForm">重置</el-button>
          <el-col :span="4">
            <el-button type="primary" @click="addDialogVisible = true">添加课程</el-button>
          </el-col>
        </el-row>
      </el-form>
      <!--列表数据显示-->
      <el-table :data="courseList" border stripe>
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="课程名称" prop="name"></el-table-column>
        <el-table-column label="学生人数" prop="stuNumber"></el-table-column>
        <el-table-column label="使用书籍" prop="useBook"></el-table-column>
        <el-table-column label="操作" width="210px">
          <template slot-scope="scope">
            <el-tooltip :enterable="false" effect="dark" placement="top" content="修改">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip :enterable="false" effect="dark" placement="top" content="删除">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeAccountById(scope.row.id)"></el-button>
            </el-tooltip>
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
    <!--添加-->
    <el-dialog title="添加课程" :visible.sync="addDialogVisible" width="32%" @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
        <el-form-item label="课程名称" prop="name">
          <el-input v-model="addForm.name" ></el-input>
        </el-form-item>
        <el-form-item label="使用书籍" prop="realName">
          <el-input v-model="addForm.useBook"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAccount" >确 定</el-button>
      </span>
    </el-dialog>
    <!--修改-->
    <el-dialog title="修改账户信息" :visible.sync="editDialogVisible" width="32%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
        <el-form-item label="课程名称" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="使用书籍" prop="useBook">
          <el-input v-model="editForm.useBook"></el-input>
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
      course: {
        name: '',
        numberStart: '',
        numberEnd: '',
        useBook: ''
      },
      queryInfo: {
        pageNum: 1,
        pageSize: 10
      },
      courseList: [],
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      addForm: {
        name: '',
        useBook: ''
      },
      addFormRules: {
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
      },
      editForm: {
        name: '',
        useBook: ''
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
  },
  methods: {
    findDetail (id) {
      window.sessionStorage.setItem('courseId', id)
      this.$router.push('/findCourseDetail')
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
      await this.$http.get('http://localhost:8080/course/getCourseList/' + (this.queryInfo.pageNum - 1) + '/' + this.queryInfo.pageSize + '').then((res) => {
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
