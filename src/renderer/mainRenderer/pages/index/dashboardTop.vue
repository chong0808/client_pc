<template>
  <div>
					<el-row :gutter="30">
            <el-col :span="6">
              <div class="i-content dashboard-item">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-zichanpankuiyingdengji"></use>
                </svg>
                <div class="dashboard-item-text">
                  <p>今天课时(已完成/总课时)</p>
                  <p>{{alreadyOn}}/{{total}}</p>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="i-content dashboard-item">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-xuesheng"></use>
                </svg>
                <div class="dashboard-item-text">
                  <p>今天请假(需补回/一共)</p>
                  <p>{{leaveClass}}/{{leaveClass+leaveClassOfno}}</p>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="i-content dashboard-item">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-zichanpankuiyingdengji"></use>
                </svg>
                <div class="dashboard-item-text">
                  <p>今天收入</p>
                  <p>{{alreadyIncome}}/{{totalIncome}}</p>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="i-content dashboard-item">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-tuanxuezhaoxin"></use>
                </svg>
                <div class="dashboard-item-text">
                  <p>今天缺课/未完成)</p>  
                  <p>{{missingClass}}/{{noOn}}</p>
                </div>
              </div>
            </el-col>
          </el-row>
  </div>
</template>
<script>
export default {
  name: "dashboardTop",
  data(){
    return {
      "total": 0,
      "alreadyOn": 0,
      "noOn": 0,
      "missingClass": 0,
      "leaveClass": 0,
      "leaveClassOfno": 0,
      "alreadyIncome": 0,
      "totalIncome": 0
    }
  },
  mounted(){
    this.$store.dispatch("GET_APP_NUM").then(data=>{
      if(data.success){
        this.total  = data.data.total
        this.noOn  = data.data.noOn
        this.missingClass  = data.data.missingClass
        this.leaveClass  = data.data.leaveClass
        this.leaveClassOfno  = data.data.leaveClassOfno
        this.alreadyIncome  = data.data.alreadyIncome
        this.totalIncome  = data.data.totalIncome
        this.alreadyOn  = data.data.alreadyOn
      }
    })
  }
};
</script>
<style>
.i-content {
  background: #fff;
  height: 120px;
  cursor: pointer;
}
.dashboard-item{
  padding: 32px;
  position: relative;
}

.dashboard-item svg{
  height: 60px;
  width: 60px;
}
.dashboard-item-text{
  position: absolute;
  top: 36px;
  left: 120px;
}
.dashboard-item-text p:first-child{
  font-size: 14px;
  color: #969696;
}
.dashboard-item-text p:last-child{
  font-size: 22px;
}
.dashboard-item-echart {
  height: 420px;
}
</style>


