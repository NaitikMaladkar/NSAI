package com.nervesynapse.app

import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint

class MainActivity : ReactActivity() {
  override val mainComponentName: String = "NerveSynapse"

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(null)
  }
}
