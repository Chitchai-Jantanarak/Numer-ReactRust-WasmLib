import { BlockMath, InlineMath } from "react-katex"
import "katex/dist/katex.min.css"

const DataType = {
  isVec: (v) => Array.isArray(v) && typeof v[0] === "number",
  isMat: (v) => Array.isArray(v) && Array.isArray(v[0]),
  isNum: (val) => typeof val === "number",
  isString: (val) => typeof val === "string",
  getType: (val) => {
    if (DataType.isString(val)) return "string"
    if (DataType.isNum(val)) return "number"
    if (DataType.isVec(val)) return "vector"
    if (DataType.isMat(val)) return "matrix"
    return "other"
  },
}

const MathFormatter = {
  formatValue: (value, key) => {
    if (MathFormatter.isExplicitKey(key)) return key

    const type = DataType.getType(value)
    switch (type) {
      case "number":
        return value.toString()
      case "vector":
        return `\\begin{bmatrix}${value.join(" \\\\ ")}\\end{bmatrix}`
      case "matrix":
        return `\\begin{bmatrix}${value.map((row) => row.join(" & ")).join(" \\\\ ")}\\end{bmatrix}`
      case "string":
        return value
      default:
        return key
    }
  },

  shouldUseBlock: (value) => {
    return DataType.isMat(value)
  },

  isExplicitKey: (key) => {
    const EXPLICIT_KEY = ["=", "\n"]
    return EXPLICIT_KEY.includes(key)
  },
}

const MathRenderer = ({ value, isBlock = false }) => {
  const math = typeof value === "string" ? value : JSON.stringify(value)
  return isBlock ? <BlockMath math={math} /> : <InlineMath math={math} />
}

const MainItemVertical = ({ item }) => {
  const { key, value } = item
  const math = MathFormatter.formatValue(value, key)
  const isBlock = MathFormatter.shouldUseBlock(value)

  return (
    <div className="flex justify-between content-center items-center gap-4 py-1">
      <span>{key}</span>
      <MathRenderer value={math} isBlock={isBlock} />
    </div>
  )
}

const MainItemsHorizontal = ({ items }) => {
  const rows = []
  let currentRow = []

  items.forEach((item) => {
    if (item.key === "\n") {
      if (currentRow.length > 0) {
        rows.push(currentRow)
        currentRow = []
      }
    } else {
      currentRow.push(item)
    }
  })

  if (currentRow.length > 0) {
    rows.push(currentRow)
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex flex-col gap-6 min-w-fit">
        {rows.map((rowItems, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className="grid gap-x-4 gap-y-2 items-center justify-items-center"
            style={{
              gridTemplateColumns: `repeat(${rowItems.length}, minmax(auto, 1fr))`,
              gridTemplateRows: "auto auto",
            }}
          >
            {/* First row: Key names */}
            {rowItems.map(({ key }, index) => (
              <div
                key={`${key}-label-${rowIndex}`}
                className="text-sm font-medium text-gray-600 whitespace-nowrap"
                style={{ gridColumn: index + 1, gridRow: 1 }}
              >
                {!MathFormatter.isExplicitKey(key) ? key : ""}
              </div>
            ))}

            {/* Second row: Math expressions */}
            {rowItems.map(({ key, value }, index) => {
              const math = MathFormatter.formatValue(value, key)
              const isBlock = MathFormatter.shouldUseBlock(value)

              return (
                <div
                  key={`${key}-value-${rowIndex}`}
                  className="flex items-center justify-center"
                  style={{ gridColumn: index + 1, gridRow: 2 }}
                >
                  <MathRenderer value={math} isBlock={isBlock} />
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

const SubItem = ({ item }) => {
  const { key, value } = item
  return (
    <div className="flex justify-between gap-4 py-1">
      <span>{key}</span>
      <MathRenderer value={value} />
    </div>
  )
}

const SubItemsContainer = ({ items }) => {
  const groupedItems = items.reduce((acc, item) => {
    const type = DataType.getType(item.value)
    if (!acc[type]) acc[type] = []
    acc[type].push(item)
    return acc
  }, {})

  const typeOrder = ["string", "number", "vector", "matrix", "other"]

  return (
    <div className="flex flex-col gap-4 p-6 rounded-xl border">
      {typeOrder.flatMap((type) => (groupedItems[type] || []).map((item) => <SubItem key={item.key} item={item} />))}
    </div>
  )
}

const MainOutputContainer = ({ items, layout }) => {
  return (
    <div className="flex flex-col rounded-xl border p-12">
      {layout === "vertical" ? (
        items.map((item) => <MainItemVertical key={item.key} item={item} />)
      ) : (
        <MainItemsHorizontal items={items} />
      )}
    </div>
  )
}

const BoxMaker = ({ datas, io }) => {
  const { values, result } = datas
  const layout = io.layout || "horizontal"
  const mainKeys = io.main || []

  const allKeys = Object.keys({ ...values, ...result })

  const getValueByKey = (key) => {
    if (MathFormatter.isExplicitKey(key)) return key
    return values[key] ?? result[key]
  }

  const mainItems = mainKeys.map((key) => ({
    key,
    value: getValueByKey(key),
  }))

  const subItems = allKeys
    .filter((key) => !mainKeys.includes(key))
    .map((key) => ({
      key,
      value: getValueByKey(key),
    }))

  return (
    <div className="flex flex-col gap-4">
      <MainOutputContainer items={mainItems} layout={layout} />
      {subItems.length > 0 && <SubItemsContainer items={subItems} />}
    </div>
  )
}

export default BoxMaker