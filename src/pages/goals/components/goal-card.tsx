import { useMemo, useState, useEffect } from 'react'
import Utilities from '@/utils/Utilities'
import { Goal } from '@/application/entity/goal'

interface GoalCardProps {
  // color: string
  // title: string
  // currentAmount: number
  goal: Goal,
  // onChange: (goal: Goal) => void
  onSave: (editedGoal: Goal) => void
}

export function GoalCard ({ goal, onSave }: GoalCardProps) {
  const maxAllocable: number = 5000
  const currentAmount = goal.amount
  const title = goal.categoryName
  const color = Utilities.stringToColor(goal.categoryName)
  const [editedGoal, setEditedGoal] = useState({ ...goal })

  useEffect(() => {
    const num = Number(editedGoal.amount)
    if (isNaN(num) || num === currentAmount) return
    const timer = setTimeout(() => {
      onSave(editedGoal)
    }, 500)

    return () => clearTimeout(timer)
  }, [editedGoal])

  const percentage = useMemo(() => {
    if (maxAllocable === 0) return 0
    return Math.min(100, Math.max(0, (editedGoal.amount / maxAllocable) * 100))
  }, [editedGoal.amount, maxAllocable])

  return (
    <div className="bg-card border border-border/50 rounded-xl p-5 flex flex-col gap-4 shadow-sm w-full transition-colors">
      <style>
        {`
          input[type=number]::-webkit-inner-spin-button, 
          input[type=number]::-webkit-outer-spin-button { 
            -webkit-appearance: none; 
            margin: 0; 
          }
        `}
      </style>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: color }}
          />
          <span className="font-bold text-foreground text-[15px]">{title}</span>
        </div>
        <div className="bg-muted/30 px-2 py-1 rounded-md border border-border flex flex-row items-center justify-between">
          <span className="text-muted-foreground font-semibold text-sm mr-1">R$</span>
          <input
            type="number"
            value={editedGoal.amount}
            onChange={(e) => {
              const val = Number(e.target.value)
              if (val > maxAllocable) {
                setEditedGoal({ ...goal, amount: maxAllocable })
              } else {
                setEditedGoal({ ...goal, amount: Number(e.target.value) })
              }
            }}
            // onKeyDown={(e) => {
            //   if (e.key === 'Enter') {
            //     const val = Number(inputValue)
            //     if (!isNaN(val)) {
            //       onChange(val)
            //       onSave(val)
            //       e.currentTarget.blur()
            //     }
            //   }
            // }}
            className="w-16 bg-transparent outline-none text-right font-semibold text-foreground text-sm focus:text-primary transition-colors hover:bg-muted/50 active:bg-muted/50 rounded-sm p-0 m-0"
            style={{ MozAppearance: 'textfield' }}
          />
        </div>
      </div>

      <div className="relative pt-4 pb-2">
        <input
          type="range"
          min={0}
          max={maxAllocable}
          step={50}
          value={currentAmount}
          onChange={(e) => setEditedGoal({ ...goal, amount: Number(e.target.value) })}
          // onMouseUp={onSave}
          // onTouchEnd={onSave}
          className="w-full absolute z-10 opacity-0 cursor-ew-resize h-4 -top-0.5"
        />

        {/* Custom Track */}
        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden absolute top-1 pointer-events-none">
          {/* Custom fill */}
          <div
            className="h-full rounded-full"
            style={{
              width: `${percentage}%`,
              backgroundColor: color
            }}
          />
        </div>

        {/* Custom Thumb */}
        <div
          className="w-3.5 h-3.5 rounded-full absolute top-0 -ml-1.5 shadow-sm pointer-events-none border border-white/20"
          style={{
            left: `${percentage}%`,
            backgroundColor: color
          }}
        />
      </div>

      <div className="flex items-center justify-between mt-1">
        <span className="text-[11px] font-medium text-muted-foreground">R$ 0</span>
        <span className="text-[11px] font-medium text-muted-foreground">
          {Utilities.currencyFormat(maxAllocable, 'pt-BR', 'BRL')}
        </span>
      </div>
    </div>
  )
}
