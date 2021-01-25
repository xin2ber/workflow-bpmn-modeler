<template>
  <div>
    <el-dialog
      title="节点人员"
      :visible.sync="dialogVisible"
      width="900px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      @closed="$emit('close')"
    >
      <x-form ref="xForm" v-model="formData" :config="formConfig">
      </x-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium" @click="ok">确 定</el-button>
        <el-button plain size="medium" @click="closeDialog">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mixinPanel from '../../../common/mixinPanel'
export default {
  mixins: [mixinPanel],
  data() {
    return {
      dialogVisible: true,
      showParamDialog: false,
      nowIndex: null,
      formData: {
        candidates: []
      }
    }
  },
  computed: {
    formConfig() {
    //   const _this = this
      return {
        inline: false,
        item: [
          {
            xType: 'tabs',
            tabs: [
              {
                add: function(arr) {
                  console.log(arr)
                  arr.splice(arr.length, 0, {})
                },
                label: '节点人员',
                name: 'candidates',
                column: [
                  {
                    label: '类型',
                    name: 'type',
                    width: 180,
                    rules: [{ required: true, message: '请选择', trigger: ['blur', 'change'] }],
                    xType: 'select',
                    dic: [
                      { label: '用户', value: 'user' },
                      { label: '单位', value: 'company' },
                      { label: '工作组', value: 'group' },
                      { label: '作业区', value: 'workArea' },
                      { label: '角色', value: 'role' },
                      { label: '脚本', value: 'expression' },
                      { label: '操作符', value: 'operator' }
                    ]
                  },
                  {
                    label: '值',
                    name: 'value',
                    xType: 'input',
                    rules: [{ required: true, message: '请输入', trigger: ['blur', 'change'] }]
                  }
                ]
              }
            ]
          }
        ]
      }
    }
  },
  mounted() {
    const candidates = this.element.businessObject.extensionElements?.values.filter(item => item.$type === 'flowable:Candidates')[0]
    console.log(candidates)
    this.formData.candidates = candidates?.get('candidates')?.map(item => {
      return {
        type: item.type,
        value: item.value
      }
    }) ?? []
  },
  methods: {
    configParam(index) {
      this.nowIndex = index
      const nowObj = this.formData.executionListener[index]
      if (!nowObj.params) {
        nowObj.params = []
      }
      this.showParamDialog = true
    },
    finishConfigParam(param) {
      this.showParamDialog = false
      const cache = this.formData.executionListener[this.nowIndex]
      cache.params = param
      this.$set(this.formData.executionListener[this.nowIndex], this.nowIndex, cache)
      this.nowIndex = null
    },
    updateElement() {
      if (this.formData.candidates?.length) {
        let extensionElements = this.element.businessObject.get('extensionElements')
        if (!extensionElements) {
          extensionElements = this.modeler.get('moddle').create('bpmn:ExtensionElements')
        }
        // 清除旧值
        extensionElements.values = extensionElements.values?.filter(item => item.$type !== 'flowable:Candidates') ?? []
        const candidates = this.modeler.get('moddle').create('flowable:Candidates')
        this.formData.candidates.forEach(item => {
          const candidate = this.modeler.get('moddle').create('flowable:Candidate')
          candidate['type'] = item.type
          candidate['value'] = item.value
          candidates.get('candidates').push(candidate)
        })
        extensionElements.get('values').push(candidates)
        console.log(extensionElements)
        this.updateProperties({ extensionElements: extensionElements })
      } else {
        const extensionElements = this.element.businessObject[`extensionElements`]
        if (extensionElements) {
          extensionElements.values = extensionElements.values?.filter(item => item.$type !== 'flowable:Candidates') ?? []
        }
      }
    },
    ok() {
      this.$refs.xForm.validate().then(() => {
        this.updateElement()
        this.dialogVisible = false
      }).catch(e => console.error(e))
    },
    closeDialog() {
      this.dialogVisible = false
    }
  }
}
</script>

<style>
.flow-containers  .el-badge__content.is-fixed {
    top: 18px;
}
</style>
