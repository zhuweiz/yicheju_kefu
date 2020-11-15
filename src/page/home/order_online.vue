<template>
  <div class="w-100 order flex-col h-100 over-y-auto" style="padding-left: 30px;">
    <div class="p-tb-20">
      <!-- <h2 class="left f-18" style="width: 150px;color: #0D906E;padding-top:12px;font-weight: normal;">| 系统设置</h2> -->
      <ul class="left orderUl" style="width:80%;padding-top: 5px;">
        <li
          :class="index==orderNavActive?'active':''"
          v-for="(item,index) in orderList"
          :key="index"
          @click="orderTab(index,item.link)"
        >{{item.name}}</li>
      </ul>
      <div class="clear"></div>
    </div>
    <router-view />
  </div>
</template>

<script>
export default {
  name: "formPage",
  data() {
    return {
      orderList: [
        { name: "门店模式", link: "/home/order_meng" },
        { name: "供应商模式", link: "/home/order_gong" }
      ],
      orderNavActive: null,
      maxHeight: undefined
    };
  },
  created() {
    this.orderTab(0, "../home/order_meng");
  },
  mounted() {
    if (this.$route.path == "/home/order_meng") {
      this.orderNavActive = 0;
    } else if (this.$route.path == "/home/order_gong") {
      this.orderNavActive = 1;
    }
  },
  methods: {
    orderTab(i, link) {
      this.orderNavActive = i;
      this.$router.push({ path: link });
    }
  }
};
</script>
<style scoped>
.orderUl li {
  float: left;
  padding: 4px 10px;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;
  transition: 0.5s;
  font-size: 16px;
}

.orderUl li:hover {
  background: rgba(0, 0, 0, 0.1);
  transition: 0.5s;
}

.orderUl li.active {
  background: #3ac29f;
  color: #fff;
}
</style>

