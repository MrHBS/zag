import { useMachine } from "@zag-js/react"
import { transitionControls } from "@zag-js/shared"
import * as transition from "@zag-js/transition"
import { StateVisualizer } from "../components/state-visualizer"
import { Toolbar } from "../components/toolbar"
import { useControls } from "../hooks/use-controls"

export default function Page() {
  const controls = useControls(transitionControls)

  const [state, send] = useMachine(transition.machine({}), {
    context: controls.context,
  })

  const api = transition.connect(state, send)

  const transitionStyles = api.transition({
    base: { transformOrigin: "center" },
    variants: {
      enter: { opacity: 1, transform: "scale(1)" },
      exit: { opacity: 0, transform: "scale(0.8)" },
    },
  })

  return (
    <>
      <main className="presence">
        <div>
          <h2>{state.value}</h2>
          <pre>{JSON.stringify(transitionStyles, null, 4)}</pre>
          <button onClick={api.toggle}>Open</button>
          <br />
          <br />
          {api.unmount ? null : (
            <div style={{ background: "tomato", padding: "40px", ...transitionStyles }}>Unmount On Exit</div>
          )}
          <br />
          <div hidden={api.unmount} style={{ background: "tomato", padding: "40px", ...transitionStyles }}>
            Keep Mounted with Hidden Attribute
          </div>
        </div>
      </main>
      <Toolbar controls={null}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
