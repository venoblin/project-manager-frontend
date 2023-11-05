import '../../styles/Project.css'
import { useParams } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../contexts/UserContext'
import Todos from '../Todos'
import Bugs from '../Bugs'

const Project = () => {
  const userContext = useContext(UserContext)
  const [project, setProject] = useState(null)
  const { projectName } = useParams()

  const findProject = () => {
    userContext?.user.projects?.forEach(project => {
      if (project.name === projectName) setProject(project)
    })
  }

  useEffect(() => {
    findProject()
  }, [])

  return (
    <div className='project'>
      <h1>Project</h1>

      <Todos project={project} />
      <Bugs project={project} />
    </div>
  )
}

export default Project