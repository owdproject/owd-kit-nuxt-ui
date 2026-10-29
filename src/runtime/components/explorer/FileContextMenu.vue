<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { explorerEntryAbsolutePath } from '@owdproject/module-nuxt-fs/runtime/utils/utilExplorerEntryPath'

const { t } = useI18n()

const props = defineProps<{
  fileName: string
  window: any
  isDirectory?: boolean
  openPathInNewTab?: (p: string) => void
}>()

const emit = defineEmits(['open', 'rename'])

const isOpen = ref(false)
const virtualElement = ref({ getBoundingClientRect: () => ({} as any) })

const entryPath = computed(() =>
  explorerEntryAbsolutePath(
    props.window.fsExplorer.basePath.value,
    props.fileName,
  ),
)

function selectEntry() {
  props.window.fsExplorer.selectFiles([entryPath.value])
}

const items = computed(() => [
  [
    {
      label: t('fs.contextMenu.open'),
      click: () => {
        emit('open', props.fileName)
      },
    }
  ],
  [
    {
      label: t('fs.contextMenu.cut'),
      click: () => {
        selectEntry()
        props.window.fsExplorer.cutSelectedFiles()
      },
    },
    {
      label: t('fs.contextMenu.copy'),
      click: () => {
        selectEntry()
        props.window.fsExplorer.copySelectedFiles()
      },
    }
  ],
  [
    {
      label: t('fs.contextMenu.delete'),
      click: () => {
        selectEntry()
        props.window.fsExplorer.fsController.deleteSelectedFiles()
      },
    },
    {
      label: t('fs.contextMenu.rename'),
      click: () => {
        emit('rename', props.fileName)
      },
    }
  ]
])

function show(event: MouseEvent) {
  event.preventDefault()
  virtualElement.value = {
    getBoundingClientRect: () => ({
      width: 0,
      height: 0,
      top: event.clientY,
      right: event.clientX,
      bottom: event.clientY,
      left: event.clientX,
    }) as any
  }
  isOpen.value = true
}

defineExpose({
  show,
})
</script>

<template>
  <UContextMenu v-model="isOpen" :virtual-element="virtualElement">
    <UCard :ui="{ body: { padding: 'p-1' } }">
      <UVerticalNavigation :links="[items[0], items[1], items[2]]" />
    </UCard>
  </UContextMenu>
</template>
