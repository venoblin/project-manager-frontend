import './Users.css'
import Panel from '../ui/Panel'
import useFormState from '../../hooks/useFormState'
import { changeListen } from '../../utils/inputHandler'
import { submit } from '../../utils/formHandler'
import { GetUserByIdentifier } from '../../services'
import useUser from '../../hooks/useUser'
import UserCard from '../UserCard/UserCard'
import useToggle from '../../hooks/useToggle'
import ErrorPopup from '../ErrorPopup/ErrorPopup'

const Users = () => {
  const [formState, setFormState, resetFormState] = useFormState(['identifier'])
  const [user, setUser] = useUser()
  const [isError, toggleIsError] = useToggle()

  const submitHandler = async () => {
    try {
      const user = await GetUserByIdentifier(formState.identifier)
      setUser({...user})
    } catch (err: any) {
      console.log(err.response.data.message)
      toggleIsError()
    }

    resetFormState()
  }

  return (
    <Panel>
      <h2>Users</h2>

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
        <UserCard user={user} />
      )}

      {isError && (
        <ErrorPopup message="ERROR" onClose={toggleIsError} />
      )}
    </Panel>
  )
}

export default Users