package com.rutigo.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import com.rutigo.app.ui.screens.ExpressiveDestinationScreen
import com.rutigo.app.ui.theme.RutiGoExpressiveTheme

class ComposeExpressiveActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Habilita diseño inmersivo Edge-to-Edge nativo
        enableEdgeToEdge()

        setContent {
            RutiGoExpressiveTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.surface
                ) {
                    ExpressiveDestinationScreen(
                        onNavigateBack = { finish() }
                    )
                }
            }
        }
    }
}
