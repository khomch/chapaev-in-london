import { action, makeAutoObservable, observable } from 'mobx'
import { CreateUserDto, SigninDto, User } from '../types/dto/user.dto'
import { apiService } from '../api/ApiService'
import { NavigateFunction } from 'react-router-dom'
import { RoutePaths } from '../types/routes'

class Authorization {
  @observable
  user: User | undefined | null = null

  @observable
  errorText = ''

  private api = apiService.getAuthApi()

  constructor() {
    makeAutoObservable(this, {}, { deep: true })
  }

  @action
  isLogin(navigate: NavigateFunction) {
    this.errorText = ''

    this.api.getUser()
      .then(({ data, message }) => {
        if (data) this.user = data

        message && this.errorResponse(message, navigate)
      })
      .catch((e: Error) => this.errorResponse(e.message, navigate))
  }

  @action
  signIn(signInDto: SigninDto, navigate: NavigateFunction) {
    this.errorText = ''

    this.api.signin(signInDto)
      .then(({ data, message }) => {
        data && navigate(RoutePaths.MAIN, { replace: true })

        message && this.errorResponse(message, navigate)
      })
      .catch((e: Error) => this.errorResponse(e.message, navigate))
  }

  @action
  signUp(signUpDto: CreateUserDto, navigate: NavigateFunction) {
    this.errorText = ''

    this.api.signup(signUpDto)
      .then(({ data, message }) => {
        data?.id && navigate(RoutePaths.MAIN, { replace: true })

        message && this.errorResponse(message, navigate)
      })
      .catch((e: Error) => this.errorResponse(e.message, navigate))
  }

  @action
  logout(navigate: NavigateFunction) {
    this.errorText = ''

    this.api.logout()
      .finally(() => this.errorResponse('', navigate))
  }

  private errorResponse(errorText: string, navigate?: NavigateFunction) {
    this.user = null
    this.errorText = errorText

    if (navigate) {
      navigate(RoutePaths.SIGN_IN, { replace: true })
    }
  }
}

export default new Authorization()
