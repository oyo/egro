import './style.css'
import App from './ui/app'
import { rebase } from './util/nav'

rebase()
App.appendTo(document.body)

//import { store } from '@/ui/features/storeRTK'
//import { slice as account } from '@/ui/features/account'
//
//const promise = store.dispatch(account.endpoints.getData.initiate(2026))
//const { data, isError } = await promise
//
//console.log(isError)
//console.log(data)
