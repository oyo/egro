import { App } from '@/ui/app'
import { keyValid } from '@/ui/components/key'

void keyValid().then(() => new App().appendTo(document.body))
