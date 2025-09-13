import { Keyword } from "./keywords"

export interface Task {
  id: number
  title: string
  is_done: boolean
  keywords: Keyword[]
}
