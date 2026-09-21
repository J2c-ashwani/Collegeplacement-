import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  change?: {
    value: string
    type: 'positive' | 'negative' | 'neutral'
  }
}

export function StatCard({ title, value, icon: Icon, description, change }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {change && (
          <p className={`text-xs mt-1 ${
            change.type === 'positive' ? 'text-green-500' : 
            change.type === 'negative' ? 'text-red-500' : 'text-muted-foreground'
          }`}>
            {change.type === 'positive' ? '+' : ''}{change.value} from last month
          </p>
        )}
      </CardContent>
    </Card>
  )
}
