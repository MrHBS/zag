import type { StateMachine as S } from "@zag-js/core"
import type { Placement, PositioningOptions } from "@zag-js/popper"
import type { CommonProperties, Context, DirectionProperty, RequiredBy } from "@zag-js/types"

type ElementIds = Partial<{
  trigger: string
  content: string
}>

type PublicContext = DirectionProperty &
  CommonProperties & {
    /**
     * The ids of the elements in the popover. Useful for composition.
     */
    ids?: ElementIds
    /**
     * Function invoked when the hover card is opened.
     */
    onOpenChange?: (open: boolean) => void
    /**
     * The duration from when the mouse enters the trigger until the hover card opens.
     */
    openDelay: number
    /**
     * The duration from when the mouse leaves the trigger or content until the hover card closes.
     */
    closeDelay: number
    /**
     * Whether to open the hover card on page load
     */
    defaultOpen?: boolean
    /**
     * The user provided options used to position the popover content
     */
    positioning: PositioningOptions
  }

type PrivateContext = Context<{
  /**
   * @internal
   * The computed placement of the tooltip.
   */
  currentPlacement?: Placement
  /**
   * @internal
   * Whether the dynamic placement has been computed
   */
  isPlacementComplete?: boolean
  /**
   * @internal
   * Whether the hover card is open by pointer
   */
  isPointer?: boolean
}>

type ComputedContext = Readonly<{}>

export type UserDefinedContext = RequiredBy<PublicContext, "id">

export type MachineContext = PublicContext & PrivateContext & ComputedContext

export type MachineState = {
  value: "opening" | "open" | "closing" | "closed"
  tags: "open" | "closed"
}

export type State = S.State<MachineContext, MachineState>

export type Send = S.Send<S.AnyEventObject>
