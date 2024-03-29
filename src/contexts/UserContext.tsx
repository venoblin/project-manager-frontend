import { PropsWithChildren, createContext, useEffect, useState } from 'react'
import { UserType, UserContextType } from '../types/user'
import { CheckSession } from '../services/auth'
import { DeleteBug, DeleteNotification, DeleteProject, DeleteTodo, GetUser, PatchBug, PatchNotification, PatchProject, PatchTodo, PostBug, PostEvent, PostNotification, PostProject, PostTodo } from '../services'
import useToggle from '../hooks/useToggle'
import useUser from '../hooks/useUser'
import useUserProjects from '../hooks/useUserProjects'
import { ProjectPatchType, ProjectPayloadType, ProjectType } from '../types/project'
import { TodoPatchType, TodoPayloadType, TodoType } from '../types/todo'
import { BugPatchType, BugPayloadType, BugType } from '../types/bug'
import { updateObjInArr } from '../utils'
import useUserContributor from '../hooks/useUserContributions'
import useUserNotification from '../hooks/useUserNotifications'
import { NotificationPatchType, NotificationPayloadType, NotificationType } from '../types/notification'

export const UserContext = createContext<UserContextType | null>(null)

export const UserProvider = (props: PropsWithChildren) => {
  const [user, setUser, resetUser] = useUser()
  const [userProjects, setUserProjects] = useUserProjects()
  const [userContributions, setUserContributions] = useUserContributor()
  const [userNotifications, setUserNotifications] = useUserNotification()
  const [authenticated, toggleAuthenticated] = useToggle(false)

  const handleLogout = () => {
    resetUser()
    toggleAuthenticated(false)
    localStorage.clear()
  }

  const getAndSetUser = async (id: number) => {
    if (typeof id === 'number') {
      const userRes = await GetUser(id)

      setUser({
        id: userRes.id,
        username: userRes.username,
        name: userRes.name,
        email: userRes.email
      })
      setUserProjects([...userRes.projects])
      setUserContributions([...userRes.contributions])
      setUserNotifications([...userRes.notifications])
      toggleAuthenticated(true)
    }
  }

  const checkToken = async () => {
    const userPayload: UserType = await CheckSession()
    
    if (userPayload.id) await getAndSetUser(userPayload.id)
  }

  const findProject = (name: string) => {
    let foundProject = null

    userProjects.forEach(project => {
      if (project.name === name) foundProject = project
    })

    return foundProject
  }

  const postProject = async (payload: ProjectPayloadType) => {
    if (user.id) {
      const newProject = await PostProject({
        name: payload.name,
        git_url: payload.git_url,
        owner_id: user.id
      })

      const updatedProjects = [...userProjects]
      updatedProjects.push(newProject)
      setUserProjects(updatedProjects)
    }
  }

  const deleteProject = async (project: ProjectType) => {
    await DeleteProject(project.id)

    const updatedProjects = [...userProjects]
    updatedProjects.forEach((p, i) => {
      if (p.id === project.id) {
        updatedProjects.splice(i, 1);
      }
    })
    setUserProjects(updatedProjects)
  }

  const patchProject = async (project: ProjectType, update: ProjectPatchType, setProject: React.Dispatch<React.SetStateAction<ProjectType>>) => {
    await PatchProject(project.id, update)
    
    const newProject = {...project, ...update}
    const updatedProjects = updateObjInArr(userProjects, project, newProject)
    
    setProject(newProject)
    setUserProjects(updatedProjects)  
  }

  const postTodo = async (payload: TodoPayloadType, project: ProjectType, setProject: React.Dispatch<React.SetStateAction<ProjectType>>) => {
    const todo = await PostTodo(payload)

    const newProject = {...project, todos: [...project.todos, todo]}

    const updatedProjects = updateObjInArr(userProjects, project, newProject)

    setProject(newProject)
    setUserProjects(updatedProjects)
  }

  const deleteTodo = async (project: ProjectType, todoId: number | null, setProject: React.Dispatch<React.SetStateAction<ProjectType>>) => {
    await DeleteTodo(todoId)

    const newTodos = project.todos.filter(t => t.id !== todoId)
    const newProject = {...project, todos: newTodos}
    const updatedProjects = updateObjInArr(userProjects, project, newProject)
    setProject(newProject)
    setUserProjects(updatedProjects)
  }

  const postBug = async (payload: BugPayloadType, project: ProjectType, setProject: React.Dispatch<React.SetStateAction<ProjectType>>) => {
    const bug = await PostBug(payload)

    const newProject = {...project, bugs: [...project.bugs, bug]}

    const updatedProjects = updateObjInArr(userProjects, project, newProject)
    setProject(newProject)
    setUserProjects(updatedProjects)
  }

  const deleteBug = async (project: ProjectType, bugId: number | null, setProject: React.Dispatch<React.SetStateAction<ProjectType>>) => {
    await DeleteBug(bugId)

    const newBugs = project.bugs.filter(b => b.id !== bugId)
    const newProject = {...project, bugs: newBugs}
    const updatedProjects = updateObjInArr(userProjects, project, newProject)
    setProject(newProject)
    setUserProjects(updatedProjects)
  }

  const patchBug = async (project: ProjectType, bug: BugType, update: BugPatchType, setProject: React.Dispatch<React.SetStateAction<ProjectType>>) => {
    await PatchBug(bug.id, update)

    let newEvent = null
    if (update.completed) {
      newEvent = await PostEvent({
        event: `Completed "${bug.bug}" bug`,
        project_id: project.id
      })
    }

    const newEvents = newEvent !== null ? [...project.events, newEvent] : [...project.events]
    const newBugs = project.bugs.map(b => b.id === bug.id ? {...b, ...update} : b)
    const newProject = {...project, bugs: newBugs, events: newEvents}
    const updatedProjects = updateObjInArr(userProjects, project, newProject)
    setProject(newProject)
    setUserProjects(updatedProjects)
  }

  const patchTodo = async (project: ProjectType, todo: TodoType, update: TodoPatchType, setProject: React.Dispatch<React.SetStateAction<ProjectType>>) => {
    await PatchTodo(todo.id, update)

    let newEvent = null
    if (update.completed) {
      newEvent = await PostEvent({
        event: `Completed "${todo.todo}" todo`,
        project_id: project.id
      })
    }
    
    const newEvents = newEvent !== null ? [...project.events, newEvent] : [...project.events]
    const newTodos = project.todos.map(t => t.id === todo.id ? {...t, ...update} : t)
    const newProject = {...project, todos: newTodos, events: newEvents}
    const updatedProjects = updateObjInArr(userProjects, project, newProject)
    setProject(newProject)
    setUserProjects(updatedProjects)
  }

  const postNotification = async (payload: NotificationPayloadType) => {
    const newNotification = await PostNotification(payload)
    setUserNotifications([...userNotifications, newNotification])
  }

  const patchNotification = async (notification: NotificationType, payload: NotificationPatchType) => {
    const update = await PatchNotification(notification.id, payload)

    const updatedNotifications = updateObjInArr(userNotifications, notification, update)

    setUserNotifications([...updatedNotifications])
  }

  const deleteNotification = async (notification: NotificationType) => {
    await DeleteNotification(notification.id)

    const updatedNotifications = [...userNotifications]
    updatedNotifications.forEach((n, i) => {
      if (n.id === notification.id) {
        updatedNotifications.splice(i, 1);
      }
    })
    setUserNotifications(updatedNotifications)
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      checkToken()
    }
  }, [])

  return (
    <UserContext.Provider value={{
        user, 
        setUser,
        getAndSetUser,
        userProjects,
        setUserProjects,
        findProject,
        postProject,
        deleteProject,
        patchProject,
        postTodo,
        deleteTodo,
        patchTodo,
        postBug,
        deleteBug,
        patchBug,
        userContributions,
        setUserContributions,
        userNotifications,
        setUserNotifications,
        postNotification,
        patchNotification,
        deleteNotification,
        authenticated, 
        toggleAuthenticated,
        handleLogout
      }}
    >
      {props.children}
    </UserContext.Provider>
  )
}
