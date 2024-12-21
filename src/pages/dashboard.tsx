import { userStore } from '@/store/user-store'

export default function Dashboard () {
  const token = userStore(state => state.token)

  return (
    <div>
      eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWI3YmEzYmEyNzQzM2Q0MTkwOWYxNWMiLCJpYXQiOjE3MzQ3ODg4MTAsImV4cCI6MTczNDg3NTIxMH0.cZX1ew6wfq0bt5b-qmfKoSeB_r6iRGadw_Q2oaf64H8
      {token}
    </div>
  )
}
