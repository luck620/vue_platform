<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/findCourses' }">课程管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/findCourses' }">课程列表</el-breadcrumb-item>
      <el-breadcrumb-item>课程测验详情</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!--列表数据显示-->
      <el-table :data="examList" border stripe>
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="题目" prop="title"></el-table-column>
        <el-table-column label="类型" prop="type"></el-table-column>
        <el-table-column label="选项A" prop="chooseA"></el-table-column>
        <el-table-column label="选项B" prop="chooseB"></el-table-column>
        <el-table-column label="选项C" prop="chooseC"></el-table-column>
        <el-table-column label="选项D" prop="chooseD"></el-table-column>
        <el-table-column label="答案" prop="answer"></el-table-column>
        <el-table-column label="解析" prop="content"></el-table-column>
        <!--        <el-table-column label="操作" width="170px">-->
        <!--        <template slot-scope="scope">-->
        <!--          <el-tooltip :enterable="false" effect="dark" placement="top" content="修改">-->
        <!--            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>-->
        <!--          </el-tooltip>-->
        <!--          <el-tooltip :enterable="false" effect="dark" placement="top" content="删除">-->
        <!--            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeAccountById(scope.row.id)"></el-button>-->
        <!--          </el-tooltip>-->
        <!--        </template>-->
        <!--        </el-table-column>-->
      </el-table>
      <!--分页-->
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      queryInfoStu: {
        pageNum: 1,
        pageSize: 10
      },
      examList: [],
      totalStu: 0
    }
  },
  created () {
    this.findCourseDetailStu()
  },
  methods: {
    async findCourseDetailStu () {
      const { data: res } = await this.$http.get('http://localhost:8080/exam/getExam/' + window.sessionStorage.getItem('courseId'), this.student)
      console.log(res)
      this.examList = res
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
