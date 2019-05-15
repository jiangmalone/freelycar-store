import Vue from 'vue'
import Router from 'vue-router'

import login from '@/login'
import home from '@/view/home'
import navApp from '@/router/navApp'
import ConsumptionOrder from '@/router/ConsumptionOrder'
import MembershipManagement from '@/router/MembershipManagement'
import ProductManagement from '@/router/ProductManagement'
import FinancialManagement from '@/router/FinancialManagement'
import SystemSetup from '@/router/SystemSetup'

// 消费开单
import QuickBilling from '@/view/QuickBilling'
import SettlementCenter from '@/view/SettlementCenter'
import DocumentManagement from '@/view/DocumentManagement'
import DocumentDetails from '@/view/DocumentDetails'
// 会员管理
import CustomerManagement from '@/view/CustomerManagement'
import AddNewCustomers from '@/view/AddNewCustomers'
import ModifyCustomers from '@/view/ModifyCustomers'
import CustomerInformation from '@/view/CustomerInformation'
import ExpensesRecord from '@/view/ExpensesRecord'
import MemberProcessing from '@/view/MemberProcessing'
// 产品管理
import ItemCategory from '@/view/ItemCategory'
import CardManagement from '@/view/CardManagement'
import CreditVoucherManagement from '@/view/CreditVoucherManagement'
// 财务管理
import IncomeInquiry from '@/view/IncomeInquiry'
import FlowDetails from '@/view/FlowDetails'
import ProcurementExpenditure from '@/view/ProcurementExpenditure'
// 系统设置
import EmployeeManagement from '@/view/EmployeeManagement'
import StoreManagement from '@/view/StoreManagement'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: '登录',
      component: login
    },
    {
      path: '/',
      name: '首页',
      component: navApp,
      children: [
        {
          path: 'home',
          name: '',
          component: home
        },
        {
          path: 'ConsumptionOrder',
          name: '消费开单',
          component: ConsumptionOrder,
          children: [
            {
              path: 'QuickBilling',
              name: '快速开单',
              component: QuickBilling
            },
            {
              path: 'SettlementCenter',
              name: '结算中心',
              component: SettlementCenter
            },
            {
              path: 'DocumentManagement',
              name: '单据管理',
              component:DocumentManagement
            },
            {
              path: 'DocumentDetails',
              name: '单据详情',
              component:DocumentDetails
            },
          ]
        },
        {
          path: 'MembershipManagement',
          name: '会员管理',
          component: MembershipManagement,
          children: [
            {
              path: 'CustomerManagement',
              name: '客户管理',
              component:CustomerManagement
            },
            {
              path: 'AddNewCustomers',
              name: '新增客户',
              component:AddNewCustomers
            },
            {
              path: 'ModifyCustomers',
              name: '修改客户信息',
              component:ModifyCustomers
            },
            {
              path: 'CustomerInformation',
              name: '客户信息',
              component:CustomerInformation
            },
            {
              path: 'ExpensesRecord',
              name: '消费记录',
              component:ExpensesRecord
            },
            {
              path: 'MemberProcessing',
              name: '会员办理',
              component:MemberProcessing
            },
          ]
        },
        {
          path: 'ProductManagement',
          name: '产品管理',
          component: ProductManagement,
          children: [
            {
              path: 'ItemCategory',
              name: '项目类别',
              component:ItemCategory
            },
            {
              path: 'CardManagement',
              name: '卡类管理',
              component:CardManagement
            },
            {
              path: 'CreditVoucherManagement',
              name: '抵用券管理',
              component:CreditVoucherManagement
            },
          ]
        },
        {
          path: 'FinancialManagement',
          name: '财务管理',
          component: FinancialManagement,
          children: [
            {
              path: 'IncomeInquiry',
              name: '收入查询',
              component:IncomeInquiry
            },
            {
              path: 'FlowDetails',
              name: '流水明细',
              component:FlowDetails
            },
            {
              path: 'ProcurementExpenditure',
              name: '支出采购',
              component:ProcurementExpenditure
            },
          ]
        },
        {
          path: 'SystemSetup',
          name: '系统设置',
          component: SystemSetup,
          children: [
            {
              path: 'EmployeeManagement',
              name: '员工管理',
              component:EmployeeManagement
            },
            {
              path: 'StoreManagement',
              name: '门店管理',
              component:StoreManagement
            }
          ]
        },
      ]
    },

  ],
  base:'/saas/',
  mode: 'history',
})

