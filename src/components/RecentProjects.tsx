import '../styles/RecentProjects.css'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../contexts/UserContext'
import Panel from './ui/Panel'
import ProjectCard from './ProjectCard'

const RecentProjects = () => {
  const userContext = useContext(UserContext)
  const navigate = useNavigate()
  
  const newHandler = () => {
    navigate('/projects/new')
  }
  
  return (
    <Panel className="recent-projects">
      <h2>Recent Projects</h2>
      <button onClick={newHandler}>New</button>

      <div className='projects'>
        {userContext?.user.projects ? (
          userContext.user.projects.map(project => (
            <ProjectCard project={project} />
          ))
        ) : (
          <p>No projects found!</p>
        )}
      </div>
    </Panel>
  )
}

export default RecentProjects