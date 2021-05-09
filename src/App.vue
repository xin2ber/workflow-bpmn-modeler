<template>
  <div class="workflow-bpmn-modeler">
    <bpmn-modeler
      ref="refNode"
      :modelId="modelId"
      :processDefinitionId="processDefinitionId"
      :is-view="isView"
      @submitSuccess="submitSuccess"
    />
  </div>
</template>

<script>
import bpmnModeler from '../package/index'
export default {
  components: {
    bpmnModeler
  },
  data() {
    return {
      modelId: '',
      processDefinitionId: '',
      isView: false
    }
  },
  mounted() {
    this.modelId = document.getElementById('modelId').value ?? ''
    this.processDefinitionId = document.getElementById('processDefinitionId').value ?? ''
  },
  methods: {
    submitSuccess() {
      returnModelTable()
    },
    set(eventData) {
      if (eventData.modelId) {
        this.modelId = eventData.modelId
      }
      if (eventData.processDefinitionId) {
        this.processDefinitionId = eventData.processDefinitionId
      }
      if (eventData.isView) {
        this.isView = eventData.isView
      }
    }
  }
}
</script>

<style lang="scss">
.workflow-bpmn-modeler {
  height: 100%;
  margin: 0;
}
</style>
