import { session } from 'electron'

export class WindowSession {
  public view = session.fromPartition('persist:webview')
  public viewIncognito = session.fromPartition('incognito:webview')
}
