import { BugType } from "./bug"
import { EventType } from "./event"
import { ProjectType } from "./project"
import { TodoType } from "./todo"
import { UserType } from "./user"

export interface ProjectPropsType extends Props {
  project: ProjectType
}

export interface SetProjectPropsType extends ProjectPropsType {
  setProject: React.Dispatch<React.SetStateAction<ProjectType>>
}

export interface EventPropsType extends ProjectPropsType {
  singleEvent: EventType
}

export interface BugPropsType extends SetProjectPropsType {
  singleBug: BugType
}

export interface TodoPropsType extends SetProjectPropsType {
  singleTodo: TodoType
}

export interface UiPropsType extends React.PropsWithChildren {
  className?: string
}
