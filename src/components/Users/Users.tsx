import './Users.css'
import useFormState from '../../hooks/useFormState'
import { changeListen } from '../../utils/inputHandler'
import { submit } from '../../utils/formHandler'
import { GetUserByIdentifier } from '../../services'
import { UtilitiesContext } from '../../contexts/UtilitiesContext'
import { UserContext } from '../../contexts/UserContext'
import useUser from '../../hooks/useUser'
import UserCard from '../UserCard/UserCard'
import { useContext } from 'react'
import PopUpMessage from '../PopUpMessage/PopUpMessage'
import { ProjectType } from '../../types/project'

const Users = (props: {isAddMode?: boolean, project?: ProjectType}) => {
  const utilitiesContext = useContext(UtilitiesContext)
  const [formState, setFormState, resetFormState] = useFormState(['identifier'])
  const [user, setUser, resetUser] = useUser()

  const submitHandler = async () => {
    try {
      const user = await utilitiesContext?.load(GetUserByIdentifier(formState.identifier))
      setUser({...user})
    } catch {
      utilitiesContext?.showPopUp(<PopUpMessage msg='User not found!' />)
    }

    resetFormState()
  }

  return (
    <div className='users'>
      <form onSubmit={(evt) => submit(evt, submitHandler)}>
        <label htmlFor='identifier'>Search User</label>
        <input 
          type='text'
          id='identifier'
          name='identifier'
          placeholder='Email or Username'
          required
          value={formState.identifier}
          onChange={(evt) => changeListen(evt, formState, setFormState)}
        />

        <button>Search</button>
      </form>

      {user.id && (
        <UserCard 
          user={user} 
          resetUser={resetUser}
          isAddMode={props.isAddMode} 
          project={props.project} 
        />
      )}
    </div>
  )
}

export default Users