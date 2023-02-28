import * as datePicker from "@zag-js/date-picker"
import { getYearsRange } from "@zag-js/date-utils"
import { normalizeProps, useMachine } from "@zag-js/react"
import { datePickerControls } from "@zag-js/shared"
import { useId } from "react"
import { StateVisualizer } from "../components/state-visualizer"
import { Toolbar } from "../components/toolbar"
import { useControls } from "../hooks/use-controls"

export default function Page() {
  const controls = useControls(datePickerControls)

  const [state, send] = useMachine(datePicker.machine({ id: useId() }), {
    context: controls.context,
  })

  const api = datePicker.connect(state, send, normalizeProps)

  return (
    <>
      <main className="date-picker">
        <div {...api.rootProps}>
          <output className="date-output">
            <div>Selected: {api.valueAsString ?? "-"}</div>
            <div>Focused: {api.focusedValueAsString}</div>
          </output>
          <div data-scope="date-picker" data-part="control">
            <input {...api.inputProps} />
            <button {...api.clearTriggerProps}>❌</button>
            <button {...api.triggerProps}>🗓</button>
          </div>

          <div style={{ marginBlock: "20px" }}>
            <select {...api.monthSelectProps}>
              {api.getMonths().map((month, i) => (
                <option key={i} value={i + 1}>
                  {month}
                </option>
              ))}
            </select>

            <select {...api.yearSelectProps}>
              {getYearsRange({ from: 100, to: 10_000 }).map((year, i) => (
                <option key={i} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div style={{ maxWidth: "230px" }}>
            <div
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBlock: "10px" }}
            >
              <button {...api.getPrevTriggerProps()}>Prev</button>
              <span>{api.getMonths().at(api.focusedValue.month - 1)}</span>
              <button {...api.getNextTriggerProps()}>Next</button>
            </div>
            <table {...api.getGridProps()}>
              <thead>
                <tr>
                  {api.weekDays.map((day, i) => (
                    <th key={i}>{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {api.weeks.map((week, i) => (
                  <tr key={i}>
                    {week.map((date, i) => (
                      <td key={i} {...api.getDayCellProps({ value: date })}>
                        {date.day}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: "flex", gap: "40px", marginTop: "24px" }}>
            <div>
              <div
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBlock: "10px" }}
              >
                <button {...api.getPrevTriggerProps({ view: "month" })}>Prev</button>
                <span>{api.focusedValue.year}</span>
                <button {...api.getNextTriggerProps({ view: "month" })}>Next</button>
              </div>

              <table>
                <tbody>
                  {api.getMonths({ columns: 4 }).map((months, row) => (
                    <tr key={row}>
                      {months.map((month, index) => (
                        <td key={index} {...api.getMonthCellProps({ value: row * 4 + index + 1 })}>
                          {month}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div>
              <div
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBlock: "10px" }}
              >
                <button {...api.getPrevTriggerProps({ view: "year" })}>Prev</button>
                <span>
                  {api.getDecade().start} - {api.getDecade().end}
                </span>
                <button {...api.getNextTriggerProps({ view: "year" })}>Next</button>
              </div>

              <table>
                <tbody>
                  {api.getYears({ columns: 4 }).map((years, row) => (
                    <tr key={row}>
                      {years.map((year, index) => (
                        <td key={index} {...api.getYearCellProps({ value: year })}>
                          {year}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <Toolbar viz controls={controls.ui}>
        <StateVisualizer state={state} omit={["weeks", "weekDays"]} />
      </Toolbar>
    </>
  )
}
