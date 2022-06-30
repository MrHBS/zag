import { contains, getEventTarget } from "@zag-js/dom-utils"
import {
  trackInteractOutside,
  type FocusOutsideEvent,
  type InteractOutsideEvent,
  type PointerDownOutsideEvent,
  type InteractOutsideHandlers,
} from "@zag-js/interact-outside"
import { trackEscapeKeydown } from "./escape-keydown"
import { Layer, layerStack } from "./layer-stack"
import { assignPointerEventToLayers, clearPointerEvent, disablePointerEventsOutside } from "./pointer-event-outside"

type Container = HTMLElement | null | Array<HTMLElement | null>

export type DismissableElementOptions = InteractOutsideHandlers & {
  pointerBlocking?: boolean
  onDismiss: (event?: InteractOutsideEvent) => void
  onEscapeKeyDown?: (event: KeyboardEvent) => void
  onInteractOutside?: (event: InteractOutsideEvent) => void
  excludeContainers?: Container | (() => Container)
}

export function trackDismissableElement(node: HTMLElement | null, options: DismissableElementOptions) {
  if (!node) return

  const { onDismiss, pointerBlocking, excludeContainers } = options

  const layer: Layer = { dismiss: () => onDismiss(), node, pointerBlocking }

  layerStack.add(layer)
  assignPointerEventToLayers()

  function onPointerDownOutside(event: PointerDownOutsideEvent) {
    const target = getEventTarget(event)
    if (layerStack.isBelowPointerBlockingLayer(node!) || layerStack.isInBranch(target)) return
    options.onPointerDownOutside?.(event)
    options.onInteractOutside?.(event)
    if (event.defaultPrevented) return
    onDismiss?.(event)
  }

  function onFocusOutside(event: FocusOutsideEvent) {
    const target = getEventTarget(event)
    if (layerStack.isInBranch(target)) return
    options.onFocusOutside?.(event)
    options.onInteractOutside?.(event)
    if (event.defaultPrevented) return
    onDismiss?.(event)
  }

  function onEscapeKeyDown(event: KeyboardEvent) {
    if (!layerStack.isTopMost(node!)) return
    options.onEscapeKeyDown?.(event)
    if (!event.defaultPrevented && onDismiss) {
      event.preventDefault()
      onDismiss()
    }
  }

  function exclude(target: Element) {
    const containers = typeof excludeContainers === "function" ? excludeContainers() : excludeContainers
    const inContainers = Array.isArray(containers) ? containers : [containers]
    return inContainers.some((node) => contains(node, target)) || layerStack.isInChildLayer(node!, target)
  }

  const cleanups = [
    pointerBlocking ? disablePointerEventsOutside(node) : undefined,
    trackEscapeKeydown(onEscapeKeyDown),
    trackInteractOutside(node, { exclude, onFocusOutside, onPointerDownOutside }),
  ]

  return () => {
    layerStack.remove(node!)
    // re-assign pointer event to remaining layers
    assignPointerEventToLayers()
    // remove pointer event from removed layer
    clearPointerEvent(node!)
    cleanups.forEach((fn) => fn?.())
  }
}
