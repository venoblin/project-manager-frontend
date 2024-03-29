import './ProjectNav.css'
import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../../contexts/UserContext'
import { ProjectPropsType } from '../../types/props'

const ProjectNav = (props: ProjectPropsType) => {
  const userContext = useContext(UserContext)
  
  const projectLink = `/${userContext?.user.username}/${props.project?.name}`
  
  return (
    <nav className='project-nav'>
      <div className='links'>
        <Link className='project-name' to={projectLink}>{`${userContext?.user.username}/${props.project.name}`}</Link>
        <Link to={`${projectLink}/todos`}>Todos</Link>
        <Link to={`${projectLink}/bugs`}>Bugs</Link>
        <Link to={`${projectLink}/settings`}>Settings</Link>
      </div>

      <div className='icon-links'>
        {props.project?.git_url.length ? (
          <Link to={props.project.git_url} target='_blank'>Git</Link>
        ) : (
          ''
        )}
      </div>
    </nav>
  )
}

export default ProjectNav