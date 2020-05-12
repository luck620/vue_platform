<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/findCourses' }">课程管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/findCourses' }">课程列表</el-breadcrumb-item>
      <el-breadcrumb-item>课程列表详情</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-form ref="textRow">
        <el-row :gutter="20" >
          教师姓名：<el-input placeholder="请输入内容" v-model="teacher.name" clearable></el-input>
          教师号：<el-input placeholder="请输入内容" v-model="teacher.tno" clearable></el-input>
          联系方式：<el-input placeholder="请输入内容" v-model="teacher.phone" clearable></el-input>
          <el-button type="success" square @click="findCourseDetailTea">查询</el-button>
          <el-button type="info" square @click="resetTeaTextForm">重置</el-button>
        </el-row>
      </el-form>
      <!--列表数据显示-->
      <el-table :data="courseDetailTeaList" border stripe>
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="教师姓名" prop="name"></el-table-column>
        <el-table-column label="教师号" prop="tno"></el-table-column>
        <el-table-column label="联系方式" prop="phone"></el-table-column>
        <el-table-column label="邮箱" prop="mail"></el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination
        @size-change="handleSizeChangeTea"
        @current-change="handleCurrentChangeTea"
        :current-page="queryInfoTea.pageNum"
        :page-sizes="[1,2,3]"
        :page-size="queryInfoTea.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalTea">
      </el-pagination>
    </el-card>
    <el-card>
      <el-form ref="textRow">
        <el-row :gutter="20" >
          学生姓名：<el-input placeholder="请输入内容" v-model="student.name" clearable></el-input>
          学号：<el-input placeholder="请输入内容" v-model="student.sno" clearable></el-input>
          联系方式：<el-input placeholder="请输入内容" v-model="student.phone" clearable></el-input>
          学生年级：<el-select v-model="student.grade" filterable placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
          <el-button type="success" square @click="findCourseDetailStu">查询</el-button>
          <el-button type="info" square @click="resetStuTextForm">重置</el-button>
        </el-row>
      </el-form>
      <!--列表数据显示-->
      <el-table :data="courseDetailStuList" border stripe>
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="学生姓名" prop="name"></el-table-column>
        <el-table-column label="学号" prop="sno"></el-table-column>
        <el-table-column label="联系方式" prop="phone"></el-table-column>
        <el-table-column label="邮箱" prop="mail"></el-table-column>
        <el-table-column label="年级" prop="grade"></el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination
        @size-change="handleSizeChangeStu"
        @current-change="handleCurrentChangeStu"
        :current-page="queryInfoStu.pageNum"
        :page-sizes="[1,2,3]"
        :page-size="queryInfoStu.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalStu">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      teacher: {
        name: '',
        tno: '',
        phone: ''
      },
      student: {
        name: '',
        sno: '',
        phone: '',
        grade: ''
      },
      options: [
        '大一', '大二', '大三', '大四'
      ],
      grade: '',
      queryInfoTea: {
        pageNum: 1,
        pageSize: 3
      },
      queryInfoStu: {
        pageNum: 1,
        pageSize: 3
      },
      courseDetailList: [],
      courseDetailTeaList: [],
      courseDetailStuList: [],
      totalTea: 0,
      totalStu: 0
    }
  },
  created () {
    this.getCourseDetailList()
    this.findCourseDetailTea()
    this.findCourseDetailStu()
  },
  methods: {
    resetTeaTextForm () {
      this.teacher.name = ''
      this.teacher.tno = ''
      this.teacher.phone = ''
    },
    resetStuTextForm () {
      this.student.name = ''
      this.student.sno = ''
      this.student.phone = ''
      this.student.grade = ''
    },
    async getCourseDetailList () {
      console.log(window.sessionStorage.getItem('courseId'))
      await this.$http.get('http://localhost:8080/course/findCourseDetail/' + window.sessionStorage.getItem('courseId')).then((res) => {
        console.log(res)
        console.log(res.data)
        if (res.status !== 200) return this.$message.error('获取账户列表失败')
        this.courseDetailList = res.data.content
        this.total = res.data.totalElements
      })
    },
    async findCourseDetailTea () {
      const { data: res } = await this.$http.post('http://localhost:8080/course/findCourseDetailTea/' + window.sessionStorage.getItem('courseId') + '/' + (this.queryInfoTea.pageNum - 1) + '/' + this.queryInfoTea.pageSize + '', this.teacher)
      console.log(res)
      this.courseDetailTeaList = res.content
      this.totalTea = res.totalElements
    },
    async findCourseDetailStu () {
      const { data: res } = await this.$http.post('http://localhost:8080/course/findCourseDetailStu/' + window.sessionStorage.getItem('courseId') + '/' + (this.queryInfoStu.pageNum - 1) + '/' + this.queryInfoStu.pageSize + '', this.student)
      console.log(res)
      this.courseDetailStuList = res.content
      this.totalStu = res.totalElements
    },
    handleSizeChangeTea (newSize) {
      console.log(123)
      this.queryInfoTea.pageSize = newSize
      this.findCourseDetailTea()
    },
    handleCurrentChangeTea (newPage) {
      this.queryInfoTea.pageNum = newPage
      this.findCourseDetailTea()
    },
    handleSizeChangeStu (newSize) {
      console.log(123)
      this.queryInfoStu.pageSize = newSize
      this.findCourseDetailStu()
    },
    handleCurrentChangeStu (newPage) {
      this.queryInfoStu.pageNum = newPage
      this.findCourseDetailStu()
    }
  }
}
</script>
<style scoped>
  .el-breadcrumb{
    margin-bottom: 15px;
    font-size: 12px;
  }
  .el-card{
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
    height: 337px;
  }
  .el-table{
    margin-top: 15px;
    font-size: 12px;
  }
  .el-pagination{
    margin-top: 15px;
  }
  .el-input{
    width: 150px;
    margin-right: 10px;
    margin-bottom: 15px;
  }
  .el-select{
    width: 150px;
    margin-right: 30px;
    margin-bottom: 15px;
  }
  .diaglog >>> .el-input__inner {
    width: 150px!important;
    margin-right: 30px;
    margin-bottom: 15px;
  }
</style>
