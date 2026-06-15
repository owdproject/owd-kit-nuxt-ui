<script setup lang="ts">
import { explorerEntryAbsolutePath } from "@owdproject/module-fs/runtime/utils/utilExplorerEntryPath";
import { fetchExplorerEntryMetadata } from "@owdproject/module-fs/runtime/utils/utilExplorerEntryMetadata";
import { ref, computed, watch } from "vue";
import FileContextMenu from "./FileContextMenu.vue";
import FileIcon from "./FileIcon.vue";
import { useExplorerInternalDrag } from "@owdproject/module-fs/runtime/composables/useExplorerInternalDrag";
import { useExplorerFolderDropTarget } from "@owdproject/module-fs/runtime/composables/useExplorerFolderDropTarget";

const props = defineProps({
  basePath: { type: String, required: true },
  fileName: { type: String, required: true },
  layout: { type: String, required: true },
  selected: { type: Boolean, required: false },
  cutted: { type: Boolean, required: false },
  window: { type: Object, required: true },
  contextMenuComponent: { type: null, required: false },
  openPathInNewTab: { type: Function, required: false },
  dragEnabled: { type: Boolean, required: false }
});

const menuImpl = computed(
  () => props.contextMenuComponent ?? FileContextMenu
);

const emit = defineEmits([
  "openDirectory",
  "openFile",
  "rename"
]);

const path = computed(
  () => explorerEntryAbsolutePath(props.basePath, props.fileName)
);

const pathStats = ref<any>(null);
const isDirectory = ref(false);
const isFile = ref();
const fileContent = ref(null);
const contextMenuRef = ref<any>();

function fetchStatsAndContent(currentPath: string) {
  fetchExplorerEntryMetadata(currentPath, (meta) => {
    pathStats.value = meta.stats;
    isFile.value = meta.isFile;
    isDirectory.value = meta.isDirectory;
    fileContent.value = meta.fileContent;
  });
}

function onFileOpen() {
  if (isDirectory.value) {
    props.window.fsExplorer.openDirectory(props.fileName);
  } else {
    props.window.fsExplorer.openFile(props.fileName);
  }
}

function onRightClick(event: MouseEvent) {
  contextMenuRef.value?.show(event);
}

function onAuxClick(event: MouseEvent) {
  if (event.button !== 1) return;
  if (!isDirectory.value || !props.openPathInNewTab) return;
  event.preventDefault();
  event.stopPropagation();
  props.openPathInNewTab(path.value);
}

watch(
  path,
  (p) => {
    fetchStatsAndContent(p);
  },
  { immediate: true }
);

const isRenaming = ref(false);
const editableName = ref(props.fileName);

function renameCommit() {
  const newName = editableName.value.trim();
  if (newName && newName !== props.fileName) {
    emit("rename", { oldName: props.fileName, newName });
  }
  isRenaming.value = false;
}

function renameStart() {
  editableName.value = props.fileName;
  isRenaming.value = true;
}

function renameCancel() {
  editableName.value = props.fileName;
  isRenaming.value = false;
}

const isRowLayout = computed(
  () => props.layout === "list" || props.layout === "details"
);

function formatBytes(n: number) {
  if (!Number.isFinite(n) || n < 0) return "—";
  if (n < 1024) return `${n} B`;
  const units = ["KB", "MB", "GB", "TB"];
  let v = n / 1024;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  const rounded = v < 10 && i > 0 ? v.toFixed(1) : String(Math.round(v));
  return `${rounded} ${units[i]}`;
}

function statToDate(stats: any) {
  if (!stats) return null;
  const m = stats.mtime;
  if (m instanceof Date) return m;
  if (typeof m === "number") return new Date(m);
  return null;
}

const modifiedLabel = computed(() => {
  const d = statToDate(pathStats.value);
  if (!d || Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, {
    dateStyle: "short",
    timeStyle: "short"
  });
});

const typeLabel = computed(() => {
  if (isDirectory.value) return "File folder";
  const parts = props.fileName.split(".");
  if (parts.length < 2) return "File";
  return `${parts.pop()?.toUpperCase()} file`;
});

const sizeLabel = computed(() => {
  if (!pathStats.value || isDirectory.value) return "—";
  if (typeof pathStats.value.isFile === 'function' && !pathStats.value.isFile()) return "—";
  return formatBytes(pathStats.value.size);
});

const dragEnabledValue = computed(() => props.dragEnabled ?? true);
const { onDragStart } = useExplorerInternalDrag({
  entryPath: () => path.value,
  selectedFiles: () => props.window.fsExplorer?.selectedFiles.value ?? [],
  dragEnabled: () => dragEnabledValue.value
});

const folderDrop = useExplorerFolderDropTarget({
  fsExplorer: props.window.fsExplorer,
  folderPath: () => path.value,
  enabled: () => dragEnabledValue.value && isDirectory.value
});

const classes = computed(() => {
  const list: any[] = [
    "owd-file select-none rounded-lg transition-all cursor-pointer p-1.5 flex flex-col items-center",
    isRowLayout.value ? "w-full text-left" : "w-[90px] text-center"
  ];
  if (props.selected) {
    list.push("bg-primary-50 dark:bg-primary-950/30 ring-1 ring-primary-500/50");
  } else {
    list.push("hover:bg-gray-100 dark:hover:bg-gray-800/50");
  }
  if (props.cutted) {
    list.push("opacity-50");
  }
  if (folderDrop.isDragOver.value) {
    list.push("bg-blue-100/50 dark:bg-blue-900/30 ring-2 ring-dashed ring-blue-500");
  }
  return list;
});
</script>

<template>
  <div
    :class="classes"
    :title="fileName"
    :draggable="dragEnabledValue"
    @dragstart.stop="onDragStart"
    @dragenter="folderDrop.onDragEnter"
    @dragover="folderDrop.onDragOver"
    @dragleave="folderDrop.onDragLeave"
    @drop="folderDrop.onDrop"
    @dblclick="onFileOpen"
    @contextmenu.prevent="onRightClick"
    @auxclick.prevent="onAuxClick"
  >
    <template v-if="isRowLayout">
      <div class="flex items-center w-full space-x-3">
        <div class="w-8 flex-shrink-0 flex items-center justify-center">
          <slot
            name="icon"
            :file-name="fileName"
            :is-directory="isDirectory"
            :layout="layout"
          >
            <FileIcon
              :file-name="fileName"
              :is-directory="isDirectory"
              :layout="layout"
            />
          </slot>
        </div>

        <div class="flex-1 min-w-0">
          <span
            v-if="!isRenaming"
            @dblclick.stop="renameStart"
            class="text-sm truncate block font-medium text-gray-700 dark:text-gray-200"
            v-text="fileName"
          />

          <input
            v-else
            v-model="editableName"
            class="text-sm truncate border border-primary-500 rounded px-1 w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 outline-none"
            @blur="renameCommit"
            @keyup.enter="renameCommit"
            @keyup.esc="renameCancel"
            autofocus
          />
        </div>

        <template v-if="layout === 'details'">
          <div class="text-xs text-gray-400 w-32 text-right truncate tabular-nums">{{ modifiedLabel }}</div>
          <div class="text-xs text-gray-400 w-24 truncate" :title="typeLabel">{{ typeLabel }}</div>
          <div class="text-xs text-gray-400 w-20 text-right truncate tabular-nums">{{ sizeLabel }}</div>
        </template>
      </div>
    </template>

    <template v-else>
      <div class="p-1 rounded flex items-center justify-center mb-1">
        <slot
          name="icon"
          :file-name="fileName"
          :is-directory="isDirectory"
          :layout="layout"
        >
          <FileIcon
            :file-name="fileName"
            :is-directory="isDirectory"
            :layout="layout"
          />
        </slot>
      </div>

      <div class="w-full text-center">
        <span
          v-if="!isRenaming"
          @dblclick.stop="renameStart"
          class="text-xs block truncate font-medium text-gray-700 dark:text-gray-200 px-1"
          v-text="fileName"
        />

        <input
          v-else
          v-model="editableName"
          class="text-xs truncate border border-primary-500 rounded px-1 w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 outline-none text-center"
          @blur="renameCommit"
          @keyup.enter="renameCommit"
          @keyup.esc="renameCancel"
          autofocus
        />
      </div>
    </template>

    <component
      :is="menuImpl"
      ref="contextMenuRef"
      :file-name="fileName"
      :window="window"
      :is-directory="!!isDirectory"
      :open-path-in-new-tab="openPathInNewTab"
      @open="onFileOpen"
      @rename="renameStart"
    />
  </div>
</template>
