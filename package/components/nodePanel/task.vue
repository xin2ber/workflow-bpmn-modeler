<template>
  <div>
    <x-form ref="xForm" v-model="formData" :config="formConfig">
      <template #executionListener>
        <el-badge :value="executionListenerLength">
          <el-button size="small" @click="dialogName = 'executionListenerDialog'">编辑</el-button>
        </el-badge>
      </template>
      <template #taskListener>
        <el-badge :value="taskListenerLength">
          <el-button size="small" @click="dialogName = 'taskListenerDialog'">编辑</el-button>
        </el-badge>
      </template>
      <template #multiInstance>
        <el-badge :is-dot="hasMultiInstance">
          <el-button size="small" @click="dialogName = 'multiInstanceDialog'">编辑</el-button>
        </el-badge>
      </template>
      <template #candidateUsers>
        <el-badge :is-dot="hasCandidateUsers">
          <el-button size="small" @click="dialogName = 'candidateUsersDialog'">编辑</el-button>
        </el-badge>
      </template>
      <template #in>
        <el-badge :is-dot="hasIn">
          <el-button size="small" @click="dialogName = 'inDialog'">编辑</el-button>
        </el-badge>
      </template>
    </x-form>
    <executionListenerDialog
      v-if="dialogName === 'executionListenerDialog'"
      :element="element"
      :modeler="modeler"
      @close="finishExecutionListener"
    />
    <taskListenerDialog
      v-if="dialogName === 'taskListenerDialog'"
      :element="element"
      :modeler="modeler"
      @close="finishTaskListener"
    />
    <multiInstanceDialog
      v-if="dialogName === 'multiInstanceDialog'"
      :element="element"
      :modeler="modeler"
      @close="finishMultiInstance"
    />
    <candidateUsersDialog
      v-if="dialogName === 'candidateUsersDialog'"
      :element="element"
      :modeler="modeler"
      @close="finishCandidateUsers"
    />
    <inOutDialog
      v-if="dialogName === 'inDialog'"
      :element="element"
      :modeler="modeler"
      @close="finishIn"
    />
  </div>
</template>

<script>
import mixinPanel from '../../common/mixinPanel'
import executionListenerDialog from './property/executionListener'
import taskListenerDialog from './property/taskListener'
import multiInstanceDialog from './property/multiInstance'
import candidateUsersDialog from './property/candidateUsers'
import inOutDialog from './property/inOut'
import { commonParse, userTaskParse } from '../../common/parseElement'
export default {
  components: {
    executionListenerDialog,
    taskListenerDialog,
    multiInstanceDialog,
    candidateUsersDialog,
    inOutDialog
  },
  mixins: [mixinPanel],
  props: {
    users: {
      type: Array,
      required: true
    },
    groups: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      userTypeOption: [
        { label: '用户', value: 'candidateUsers' },
        { label: '工作组', value: 'candidateGroups' },
        { label: '角色', value: 'candidateRoles' },
        { label: '部门', value: 'candidateDepts' },
        { label: '人员脚本', value: 'assigneeExpression' }
      ],
      dialogName: '',
      executionListenerLength: 0,
      taskListenerLength: 0,
      hasMultiInstance: false,
      formData: {}
    }
  },
  computed: {
    formConfig() {
      const _this = this
      return {
        inline: false,
        item: [
          {
            xType: 'input',
            name: 'id',
            label: '节点 id',
            rules: [{ required: true, message: ' ' }]
          },
          {
            xType: 'input',
            name: 'name',
            label: '节点名称',
            rules: [{ required: true, message: ' ' }]
          },
          {
            xType: 'input',
            name: 'documentation',
            label: '节点描述'
          },
          {
            xType: 'slot',
            name: 'executionListener',
            label: '执行监听器'
          },
          {
            xType: 'slot',
            name: 'taskListener',
            label: '任务监听器',
            show: !!_this.showConfig.taskListener
          },
          {
            xType: 'slot',
            name: 'candidateUsers',
            label: '节点人员',
            show: !!_this.showConfig.candidateUsers
          },
          {
            xType: 'slot',
            name: 'multiInstance',
            label: '多实例'
          },
          {
            xType: 'slot',
            name: 'in',
            label: '输入参数',
            show: !!_this.showConfig.inOutParameters
          },
          {
            xType: 'switch',
            name: 'async',
            label: '异步',
            activeText: '是',
            inactiveText: '否',
            show: !!_this.showConfig.async
          },
          {
            xType: 'input',
            name: 'calledElement',
            label: '流程key',
            show: !!_this.showConfig.calledElement
          },
          {
            xType: 'input',
            name: 'businessKey',
            label: '业务key',
            show: !!_this.showConfig.businessKey
          },
          {
            xType: 'input',
            name: 'processInstanceName',
            label: '实例名称',
            show: !!_this.showConfig.processInstanceName
          },
          {
            xType: 'input',
            name: 'priority',
            label: '优先级',
            show: !!_this.showConfig.priority
          },
          {
            xType: 'input',
            name: 'formKey',
            label: '表单标识key',
            show: !!_this.showConfig.formKey
          },
          {
            xType: 'input',
            name: 'skipExpression',
            label: '跳过表达式',
            show: !!_this.showConfig.skipExpression
          },
          {
            xType: 'switch',
            name: 'isForCompensation',
            label: '是否为补偿',
            activeText: '是',
            inactiveText: '否',
            show: !!_this.showConfig.isForCompensation
          },
          {
            xType: 'switch',
            name: 'triggerable',
            label: '服务任务可触发',
            activeText: '是',
            inactiveText: '否',
            show: !!_this.showConfig.triggerable
          },
          {
            xType: 'switch',
            name: 'autoStoreVariables',
            label: '自动存储变量',
            activeText: '是',
            inactiveText: '否',
            show: !!_this.showConfig.autoStoreVariables
          },
          {
            xType: 'input',
            name: 'ruleVariablesInput',
            label: '输入变量',
            show: !!_this.showConfig.ruleVariablesInput
          },
          {
            xType: 'input',
            name: 'rules',
            label: '规则',
            show: !!_this.showConfig.rules
          },
          {
            xType: 'input',
            name: 'resultVariable',
            label: '结果变量',
            show: !!_this.showConfig.resultVariable
          },
          {
            xType: 'switch',
            name: 'exclude',
            label: '排除',
            activeText: '是',
            inactiveText: '否',
            show: !!_this.showConfig.exclude
          },
          {
            xType: 'input',
            name: 'class',
            label: '类',
            show: !!_this.showConfig.class
          },
          {
            xType: 'datePicker',
            type: 'datetime',
            name: 'dueDate',
            label: '到期时间',
            show: !!_this.showConfig.dueDate
          },
          {
            xType: 'input',
            name: 'pcUrl',
            label: 'PC端URL',
            show: !!_this.showConfig.pcUrl
          },
          {
            xType: 'input',
            name: 'pcInfoUrl',
            label: 'PC端详情URL',
            show: !!_this.showConfig.pcInfoUrl
          },
          {
            xType: 'input',
            name: 'mobileUrl',
            label: '移动端URL',
            show: !!_this.showConfig.mobileUrl
          },
          {
            xType: 'input',
            name: 'mobileInfoUrl',
            label: '移动端详情URL',
            show: !!_this.showConfig.mobileInfoUrl
          }
        ]
      }
    }
  },
  watch: {
    'formData.userType': function(val, oldVal) {
      if (oldVal) {
        const types = ['assignee', 'candidateUsers', 'candidateGroups']
        types.forEach(type => {
          delete this.element.businessObject.$attrs[`flowable:${type}`]
          delete this.formData[type]
        })
      }
    },
    'formData.assignee': function(val) {
      if (this.formData.userType !== 'assignee') {
        delete this.element.businessObject.$attrs[`flowable:assignee`]
        return
      }
      this.updateProperties({ 'flowable:assignee': val })
    },
    'formData.candidateUsers': function(val) {
      if (this.formData.userType !== 'candidateUsers') {
        delete this.element.businessObject.$attrs[`flowable:candidateUsers`]
        return
      }
      this.updateProperties({ 'flowable:candidateUsers': val?.join(',') })
    },
    'formData.candidateGroups': function(val) {
      if (this.formData.userType !== 'candidateGroups') {
        delete this.element.businessObject.$attrs[`flowable:candidateGroups`]
        return
      }
      this.updateProperties({ 'flowable:candidateGroups': val?.join(',') })
    },
    'formData.async': function(val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:async': val })
    },
    'formData.dueDate': function(val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:dueDate': val })
    },
    'formData.formKey': function(val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:formKey': val })
    },
    'formData.calledElement': function(val) {
      if (val) {
        this.updateProperties({ 'flowable:calledElement': val })
      } else {
        delete this.element.businessObject.$attrs[`flowable:calledElement`]
      }
    },
    'formData.businessKey': function(val) {
      if (val) {
        this.updateProperties({ 'flowable:businessKey': val })
      } else {
        delete this.element.businessObject.$attrs[`flowable:businessKey`]
      }
    },
    'formData.processInstanceName': function(val) {
      if (val) {
        this.updateProperties({ 'flowable:processInstanceName': val })
      } else {
        delete this.element.businessObject.$attrs[`flowable:processInstanceName`]
      }
    },
    'formData.priority': function(val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:priority': val })
    },
    'formData.skipExpression': function(val) {
      if (val) {
        this.updateProperties({ 'flowable:skipExpression': val })
      } else {
        delete this.element.businessObject.$attrs[`flowable:skipExpression`]
      }
    },
    'formData.isForCompensation': function(val) {
      if (val === '') val = null
      this.updateProperties({ 'isForCompensation': val })
    },
    'formData.triggerable': function(val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:triggerable': val })
    },
    'formData.class': function(val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:class': val })
    },
    'formData.autoStoreVariables': function(val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:autoStoreVariables': val })
    },
    'formData.exclude': function(val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:exclude': val })
    },
    'formData.ruleVariablesInput': function(val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:ruleVariablesInput': val })
    },
    'formData.rules': function(val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:rules': val })
    },
    'formData.resultVariable': function(val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:resultVariable': val })
    },
    'formData.pcUrl': function(val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:pcUrl': val })
    },
    'formData.mobileUrl': function(val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:mobileUrl': val })
    },
    'formData.pcInfoUrl': function(val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:pcInfoUrl': val })
    },
    'formData.mobileInfoUrl': function(val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:mobileInfoUrl': val })
    }

  },
  created() {
    let cache = commonParse(this.element)
    cache = userTaskParse(cache)
    this.formData = cache
    this.computedExecutionListenerLength()
    this.computedTaskListenerLength()
    this.computedHasMultiInstance()
    this.computedIn()
  },
  methods: {
    computedExecutionListenerLength() {
      this.executionListenerLength = this.element.businessObject.extensionElements?.values
        ?.filter(item => item.$type === 'flowable:ExecutionListener').length ?? 0
    },
    computedTaskListenerLength() {
      this.taskListenerLength = this.element.businessObject.extensionElements?.values
        ?.filter(item => item.$type === 'flowable:TaskListener').length ?? 0
    },
    computedHasMultiInstance() {
      if (this.element.businessObject.loopCharacteristics) {
        this.hasMultiInstance = true
      } else {
        this.hasMultiInstance = false
      }
    },
    computedIn() {
      this.taskListenerLength = this.element.businessObject.extensionElements?.values
        ?.filter(item => item.$type === 'flowable:in').length ?? 0
    },
    finishExecutionListener() {
      if (this.dialogName === 'executionListenerDialog') {
        this.computedExecutionListenerLength()
      }
      this.dialogName = ''
    },
    finishTaskListener() {
      if (this.dialogName === 'taskListenerDialog') {
        this.computedTaskListenerLength()
      }
      this.dialogName = ''
    },
    finishMultiInstance() {
      if (this.dialogName === 'multiInstanceDialog') {
        this.computedHasMultiInstance()
      }
      this.dialogName = ''
    },
    finishCandidateUsers() {
      if (this.dialogName === 'candidateUsersDialog') {
        this.computedHasMultiInstance()
      }
      this.dialogName = ''
    },
    finishIn() {
      if (this.dialogName === 'inDialog') {
        this.computedIn()
      }
      this.dialogName = ''
    }
  }
}
</script>

<style></style>
