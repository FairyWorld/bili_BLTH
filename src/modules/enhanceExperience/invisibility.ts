import type { OnFrameTypes, RunAtMoment } from '@/types'
import { type FetchHookProxyConfig, fproxy } from '@/library/fetch-hook'
import { getUrlFromFetchInput, createFetchInputWithNewUrl } from '@/library/utils'
import BaseModule from '@/modules/BaseModule'
import { unsafeWindow } from '$'
import { useModuleStore } from '@/stores'

class Invisibility extends BaseModule {
  static runOnMultiplePages: boolean = true
  static runAt: RunAtMoment = 'document-start'
  static runAfterDefault: boolean = false
  static onFrame: OnFrameTypes = 'all'

  config = useModuleStore().moduleConfig.EnhanceExperience.invisibility

  public run(): void {
    this.logger.log('隐身入场模块开始运行')

    const fetchHookConfig: FetchHookProxyConfig = {
      onRequest: (config, handler) => {
        const url = getUrlFromFetchInput(config.input)

        if (url.includes('//api.live.bilibili.com/xlive/web-room/v1/index/getInfoByUser')) {
          const nextUrl = url.replace('not_mock_enter_effect=0', 'not_mock_enter_effect=1')
          config.input = createFetchInputWithNewUrl(nextUrl, config.input)
        }

        handler.next(config)
      },
    }

    fproxy(fetchHookConfig, unsafeWindow)
  }
}

export default Invisibility
