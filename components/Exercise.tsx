'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface SetData {
  setNumber: number
  weight: string
  reps: string
  completed: boolean
}

interface ExerciseProps {
  name: string
  sets: number
  reps: number
  rest: number
  isInSession?: boolean
  onChange?: (payload: { name: string; data: SetData[] }) => void
}

export function Exercise({ name, sets, reps, rest, isInSession = false, onChange }: ExerciseProps) {
  const [setData, setSetData] = useState<SetData[]>(
    Array.from({ length: sets }, (_, i) => ({
      setNumber: i + 1,
      weight: '',
      reps: String(reps),
      completed: false,
    }))
  )

  const handleSetChange = (setNumber: number, field: 'weight' | 'reps' | 'completed', value: string | boolean) => {
    const nextData = setData.map(set =>
      set.setNumber === setNumber
        ? {
            ...set,
            [field]: field === 'completed' ? value : String(value),
          }
        : set
    )

    setSetData(nextData)
    onChange?.({ name, data: nextData })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">{name}</h3>
          <p className="text-sm text-muted-foreground">
            Rest: {rest}s between sets
          </p>
        </div>
      </div>

      <Card className="overflow-hidden p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Set</TableHead>
              <TableHead>Weight (lbs)</TableHead>
              <TableHead>Reps</TableHead>
              <TableHead>Completed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {setData.map((set) => (
              <TableRow key={set.setNumber}>
                <TableCell className="font-medium">{set.setNumber}</TableCell>
                <TableCell>
                  {isInSession ? (
                    <Input
                      type="text"
                      value={set.weight}
                      onChange={(e) => handleSetChange(set.setNumber, 'weight', e.target.value)}
                      placeholder="0"
                      className="h-8"
                    />
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  {isInSession ? (
                    <Input
                      type="text"
                      value={set.reps}
                      onChange={(e) => handleSetChange(set.setNumber, 'reps', e.target.value)}
                      placeholder={String(reps)}
                      className="h-8"
                    />
                  ) : (
                    <span className="text-sm">{set.reps}</span>
                  )}
                </TableCell>
                <TableCell align='center'>
                  <Checkbox
                    checked={set.completed}
                    onCheckedChange={(checked) => handleSetChange(set.setNumber, 'completed', checked as boolean)}
                    disabled={!isInSession}
                    className="h-4 w-4"
                    
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
