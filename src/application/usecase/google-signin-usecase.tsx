import { ToastAction } from '@/components/ui/toast'
import { toast } from '@/hooks/use-toast'
import { AuthGateway } from '@/infra/gateways'
import Utilities from '@/utils/Utilities'
import { router } from '@/protected-route'
import { userStore } from '@/infra/store/user-store'

export default class GoogleSignin {

  constructor(
    private readonly authGateway: AuthGateway,
    private readonly toaster: typeof toast
  ) { }

  async execute (credential: string): Promise<void> {
    try {
      const { data } = await this.authGateway.googleSignin(credential)
      localStorage.setItem('access-token', data.token)
      userStore.getState().setUser(data.token, data.name, data.lastName, data.email)
      router.navigate('/')
    } catch (e: any) {
      this.toaster({
        variant: 'destructive',
        title: e.message,
        description: Utilities.dateFormat(new Date(), 'dddd, D MMMM [de] YYYY [às] h:mm A'),
        action: (
          <ToastAction altText="Goto schedule to undo">Ok</ToastAction>
        )
      })
    }
  }
}
