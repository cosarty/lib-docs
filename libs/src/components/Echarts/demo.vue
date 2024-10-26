<template>
<Echarts :options="options" />
</template>

<script setup lang="ts">
import { PieECOption } from './type'
import Echarts from './Echarts.vue';

const options: PieECOption = {
  tooltip: {
    trigger: 'item',
  },
  legend: {
    top: '5%',
    orient: 'vertical',
    right: '0%',
  },
  grid: {
    left: '1%',
    right: '1%',
    top: '2  %',
    bottom: 0,
    containLabel: true,
  },
  series: [
    {
      name: '报名人数',
      type: 'pie',
      radius: '80%',
      center: ['50%', '50%'],
      color: ['#5ab1ef', '#b6a2de', '#67e0e3', '#2ec7c9'],
      data: [{ name: '男', value: 22 }, { name: '女', value: 33 }],
      roseType: 'radius',
      animationType: 'scale',
      animationEasing: 'exponentialInOut',
      animationDelay: function () {
        return Math.random() * 400
      },
    },
  ],
}
</script>

<style scoped lang="scss"></style>
