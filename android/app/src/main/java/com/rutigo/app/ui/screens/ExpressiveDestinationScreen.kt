package com.rutigo.app.ui.screens

import androidx.activity.BackEventCompat
import androidx.activity.compose.PredictiveBackHandler
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.animateContentSize
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.spring
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.ArrowBack
import androidx.compose.material.icons.rounded.Explore
import androidx.compose.material.icons.rounded.Favorite
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.unit.dp
import com.rutigo.app.ui.theme.LocalExpressiveMotion
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ExpressiveDestinationScreen(
    onNavigateBack: () -> Unit = {}
) {
    val motion = LocalExpressiveMotion.current
    val coroutineScope = rememberCoroutineScope()

    var isExpanded by remember { mutableStateOf(false) }
    var isFavorite by remember { mutableStateOf(false) }

    // Estado reactivo para la física del Gesto de Regreso Predictivo (Predictive Back)
    val backScale = remember { Animatable(1f) }
    val backCornerRadius = remember { Animatable(0f) }
    val backTranslationX = remember { Animatable(0f) }

    // Interceptor nativo de regreso predictivo con físicas de resorte
    PredictiveBackHandler { progressFlow ->
        try {
            progressFlow.collect { backEvent: BackEventCompat ->
                val progress = backEvent.progress // 0.0f a 1.0f
                val targetScale = 1f - (progress * 0.12f)
                val targetCorner = progress * 36f
                val targetTranslation = if (backEvent.swipeEdge == BackEventCompat.EDGE_LEFT) {
                    progress * 48f
                } else {
                    -progress * 48f
                }

                backScale.snapTo(targetScale)
                backCornerRadius.snapTo(targetCorner)
                backTranslationX.snapTo(targetTranslation)
            }
            // Gesto confirmado: ejecuta salida
            onNavigateBack()
        } catch (e: CancellationException) {
            // Gesto cancelado: recuperación suave con física de resorte (Spring Overshoot)
            coroutineScope.launch {
                val springSpec = spring<Float>(
                    dampingRatio = Spring.DampingRatioLowBouncy,
                    stiffness = Spring.StiffnessMediumLow
                )
                launch { backScale.animateTo(1f, springSpec) }
                launch { backCornerRadius.animateTo(0f, springSpec) }
                launch { backTranslationX.animateTo(0f, springSpec) }
            }
        }
    }

    // Animación de física con resorte con rebote orgánico para el botón de favorito
    val favoriteScale by animateFloatAsState(
        targetValue = if (isFavorite) 1.28f else 1.0f,
        animationSpec = spring(
            dampingRatio = Spring.DampingRatioLowBouncy,
            stiffness = Spring.StiffnessMediumLow
        ),
        label = "FavoriteSpringBounce"
    )

    Box(
        modifier = Modifier
            .fillMaxSize()
            .graphicsLayer {
                scaleX = backScale.value
                scaleY = backScale.value
                translationX = backTranslationX.value
            }
            .clip(RoundedCornerShape(backCornerRadius.value.dp))
            .background(MaterialTheme.colorScheme.surface)
    ) {
        Scaffold(
            modifier = Modifier.fillMaxSize(),
            containerColor = MaterialTheme.colorScheme.surface,
            topBar = {
                CenterAlignedTopAppBar(
                    title = {
                        Text(
                            text = "RutiGo Expressive",
                            style = MaterialTheme.typography.titleMedium
                        )
                    },
                    navigationIcon = {
                        IconButton(onClick = onNavigateBack) {
                            Icon(
                                imageVector = Icons.Rounded.ArrowBack,
                                contentDescription = "Atrás"
                            )
                        }
                    },
                    colors = TopAppBarDefaults.centerAlignedTopAppBarColors(
                        containerColor = MaterialTheme.colorScheme.surface
                    )
                )
            }
        ) { innerPadding ->
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding)
                    .padding(horizontal = 20.dp, vertical = 10.dp),
                verticalArrangement = Arrangement.spacedBy(18.dp)
            ) {
                // Título con tipografía Display expresiva
                Text(
                    text = "Atlántico Mágico",
                    style = MaterialTheme.typography.displayLarge,
                    color = MaterialTheme.colorScheme.onSurface
                )

                // Contenedor con Transformación de Forma y Animación de Contenido por Resorte
                Card(
                    onClick = { isExpanded = !isExpanded },
                    shape = if (isExpanded) RoundedCornerShape(36.dp) else MaterialTheme.shapes.large,
                    colors = CardDefaults.cardColors(
                        containerColor = MaterialTheme.colorScheme.secondaryContainer
                    ),
                    modifier = Modifier
                        .fillMaxWidth()
                        .animateContentSize(
                            animationSpec = spring(
                                dampingRatio = Spring.DampingRatioLowBouncy,
                                stiffness = Spring.StiffnessMediumLow
                            )
                        )
                ) {
                    Column(modifier = Modifier.padding(24.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "Ruta del Poeta y la Palma de Iraca",
                                style = MaterialTheme.typography.titleLarge,
                                color = MaterialTheme.colorScheme.onSecondaryContainer,
                                modifier = Modifier.weight(1f)
                            )
                        }

                        Spacer(modifier = Modifier.height(10.dp))

                        Text(
                            text = if (isExpanded) {
                                "Explora Usiacurí, sus más de 80 macromurales en techos y fachadas, el legado del poeta Julio Flórez y el senderismo ecológico en los arroyos de la reserva Luriza.\n\n" +
                                "• Duración estimada: 4 horas\n" +
                                "• Distancia: 28 km\n" +
                                "• Transporte: Autobús intermunicipal o vehículo propio"
                            } else {
                                "Toca aquí para expandir detalles y consejos de viaje..."
                            },
                            style = MaterialTheme.typography.bodyLarge,
                            color = MaterialTheme.colorScheme.onSecondaryContainer.copy(alpha = 0.88f)
                        )
                    }
                }

                Spacer(modifier = Modifier.weight(1f))

                // Barra de acción expresiva flotante en forma de píldora
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 16.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Button(
                        onClick = { /* Acción de iniciar ruta */ },
                        shape = CircleShape,
                        colors = ButtonDefaults.buttonColors(
                            containerColor = MaterialTheme.colorScheme.primary,
                            contentColor = MaterialTheme.colorScheme.onPrimary
                        ),
                        modifier = Modifier
                            .weight(1f)
                            .height(56.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Rounded.Explore,
                            contentDescription = null,
                            modifier = Modifier.size(22.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Iniciar Ruta",
                            style = MaterialTheme.typography.labelLarge
                        )
                    }

                    FilledTonalIconButton(
                        onClick = { isFavorite = !isFavorite },
                        shape = CircleShape,
                        modifier = Modifier
                            .size(56.dp)
                            .scale(favoriteScale),
                        colors = IconButtonDefaults.filledTonalIconButtonColors(
                            containerColor = if (isFavorite) MaterialTheme.colorScheme.primaryContainer 
                                             else MaterialTheme.colorScheme.surfaceVariant
                        )
                    ) {
                        Icon(
                            imageVector = Icons.Rounded.Favorite,
                            contentDescription = "Favorito",
                            tint = if (isFavorite) MaterialTheme.colorScheme.primary 
                                   else MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }
        }
    }
}
