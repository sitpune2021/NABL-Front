/* eslint-disable @typescript-eslint/no-explicit-any */
import { addCustomBlocks } from './blocks.config'
import { addDynamicFields } from './dynamicFields.config'

export function loadEditorPlugins(editor: any) {
    addCustomBlocks(editor)
    addDynamicFields(editor)
}
