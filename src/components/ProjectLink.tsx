import '../styles/ProjectLink.css'
import { Link } from 'react-router-dom'
import { ProjectLinkProps } from '../types/props'

const ProjectLink = (props: ProjectLinkProps) => {
  
  return (
    <Link to={`/projects/${props.project.id}`}>
      {`${props.owner.name}/${props.project.name}`}
    </Link>
  )
}

export default ProjectLink