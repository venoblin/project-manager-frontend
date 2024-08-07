import { useState } from 'react'
import { ProjectType } from '../types/project'

const useProject = (): [ProjectType, React.Dispatch<React.SetStateAction<ProjectType>>, () => void] => {
  const nullProject = {
    owner: {
      id: null,
      name: '',
      username: '',
      email: '',
      projects: []
    },
    name: '',
    git_url: '',
    owner_id: null,
    is_private: false,
    id: null,
    bugs: [],
    todos: [],
    events: [],
    contributors: []
  }
  
  const [project, setProject] = useState<ProjectType>(nullProject)

  const resetProject = () => {
    setProject(nullProject)
  }

  return [project, setProject, resetProject]
}

export default useProject