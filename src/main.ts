import './style.css'
import App from './ui/app'
import { rebase } from './util/nav'

rebase()
App.appendTo(document.body)
