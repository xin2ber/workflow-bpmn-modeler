<template>
  <div>
    <el-dialog
      title="参数"
      :visible.sync="dialogVisible"
      width="900px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      @closed="$emit('close')"
    >
      <x-form ref="xForm" v-model="formData" :config="formConfig" />
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
      formData: {
        inOut: []
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
                label: '参数',
                name: 'inOut',
                column: [
                  {
                    label: 'source',
                    name: 'source',
                    xType: 'input',
                    rules: [{ required: true, message: '请输入', trigger: ['blur', 'change'] }]
                  },
                  {
                    label: 'target',
                    name: 'target',
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
    this.formData.inOut = this.element.businessObject.extensionElements?.values
      .filter(item => item.$type === 'flowable:In')
      .map(item => {
        return {
          source: item.source || item.sourceExpression,
          target: item.target || item.targetExpression
        }
      }) ?? []
  },
  methods: {
    updateElement() {
      if (this.formData.inOut?.length) {
        let extensionElements = this.element.businessObject.get('extensionElements')
        if (!extensionElements) {
          extensionElements = this.modeler.get('moddle').create('bpmn:ExtensionElements')
        }
        // 清除旧值
        extensionElements.values = extensionElements.values?.filter(item => item.$type !== 'flowable:In') ?? []
        this.formData.inOut.forEach(item => {
          const inOut = this.modeler.get('moddle').create('flowable:In')
          if (/\$+\{+.+\}/.test(item.source)) {
            inOut['sourceExpression'] = item.source
          } else {
            inOut['source'] = item.source
          }
          if (/\$+\{+.+\}/.test(item.target)) {
            inOut['targetExpression'] = item.target
          } else {
            inOut['target'] = item.target
          }
          extensionElements.get('values').push(inOut)
        })
        this.updateProperties({ extensionElements: extensionElements })
      } else {
        const extensionElements = this.element.businessObject[`extensionElements`]
        if (extensionElements) {
          extensionElements.values = extensionElements.values?.filter(item => item.$type !== 'flowable:In') ?? []
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
