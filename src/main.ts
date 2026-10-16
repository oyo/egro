import { App } from '@/ui/app'
import { keyValid } from '@/ui/components/key'
import { rebase } from '@/util/nav'

rebase()

void keyValid().then(() => new App().appendTo(document.body))
