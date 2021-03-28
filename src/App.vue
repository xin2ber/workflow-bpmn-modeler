<template>
  <div class="workflow-bpmn-modeler">
    <bpmn-modeler
      ref="refNode"
      :xml="xml"
      :users="users"
      :groups="groups"
      :categorys="categorys"
      :is-view="isView"
      @save="saveModeler"
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
      xml: '',
      users: [],
      groups: [],
      categorys: [],
      isView: false
    }
  },
  mounted() {
    window.addEventListener('message', (event) => {
      if (!event.data.isSave) {
        this.set(event.data)
      }
    })
  },
  methods: {
    saveModeler(data) {
      addModel(data)
    },
    set(eventData) {
      if (eventData.xml) {
        this.xml = eventData.xml
      }
      if (eventData.users) {
        this.users = eventData.users
      }
      if (eventData.groups) {
        this.groups = eventData.groups
      }
      if (eventData.categorys) {
        this.categorys = eventData.categorys
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
